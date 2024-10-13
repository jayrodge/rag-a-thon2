import pickle
from fastapi import APIRouter, HTTPException, UploadFile, File
from app.parsers import DocumentParser
from app.file_handler import FileHandler
import os
import nest_asyncio
from llama_index.graph_stores.neo4j import Neo4jGraphStore
from llama_index.core import StorageContext, KnowledgeGraphIndex
from llama_index.core.node_parser import SentenceSplitter

from app.text_entity_search import TextEntitySearchAgent

nest_asyncio.apply()

router = APIRouter()
OUTPUT_DIRECTORY = "parsed_output"

document_parser = DocumentParser()
file_handler = FileHandler()


@router.post("/upload_directory/")
async def upload_directory(zip_file: UploadFile = File(...)):
    """Upload a zipped directory, extract it, and process the files."""

    zip_content = await zip_file.read()
    zip_hash = file_handler.calculate_file_hash(zip_content)
    extract_dir = f"extracted_files_{zip_hash}"

    # Define the processed files directory within the extraction directory
    processed_dir = os.path.join(extract_dir, "processed_files")

    if not os.path.exists(extract_dir):
        extract_dir = file_handler.extract_zip(zip_content, extract_dir)
        os.makedirs(processed_dir, exist_ok=True)
    else:
        print(f"Directory '{extract_dir}' already exists. Skipping extraction.")

    extract_dir = file_handler.extract_zip(zip_content, extract_dir)

    processed_files = []
    skipped_files = []
    document_parser = DocumentParser()
    all_docs = []

    # Process each file in the extracted directory
    for root, dirs, files in os.walk(extract_dir):
        for file_name in files:
            file_path = os.path.join(root, file_name)

            # Skip files in the processed_files directory to avoid re-processing
            if root.startswith(processed_dir):
                continue

            with open(file_path, "rb") as f:
                content = f.read()

            # Calculate the file hash based on content
            file_hash = file_handler.calculate_file_hash(content)

            # Check if the file with this hash already exists in the processed directory
            processed_file_path = os.path.join(processed_dir, f"{file_hash}.pkl")
            if os.path.exists(processed_file_path):
                skipped_files.append(file_name)
                loaded_doc = document_parser.load_parsed_data_from_files(processed_file_path)
                all_docs.append(loaded_doc)
                continue

            # Use LlamaParser to parse the file
            try:
                extra_info = {"file_name": file_name}
                parsed_data = document_parser.parse_document(content, extra_info)
                document_parser.write_parsed_data_to_files(parsed_data, processed_dir, file_hash)
                processed_files.append(file_name)
            except Exception as e:
                skipped_files.append(file_name)
                print(f"Error processing {file_name}: {str(e)}")
                continue

    return {
        "status": "success",
        "processed_files": processed_files,
        "skipped_files": skipped_files,
        "message": f"Processed {len(processed_files)} file(s), skipped {len(skipped_files)} duplicate or unreadable file(s).",
        "extracted_dir": extract_dir,
    }


@router.get("/entity-search/")
async def entity_search(pickle_file_path: str):
    """
    Perform entity search from the processed pickle file and return search results for identified entities.

    :param pickle_file_path: Path to the pickled file containing the parsed documents.
    :return: JSON object with entities.
    """
    # Initialize EntitySearch object
    entity_search_service = TextEntitySearchAgent()

    # Construct the filename for saving/loading entities
    entities_file_name = f"{pickle_file_path}_all_entities.pkl"
    entities_file_path = os.path.join(os.path.dirname(pickle_file_path), entities_file_name)

    # Check if entities are already processed and saved
    if os.path.exists(entities_file_path):
        try:
            # Load the saved entities
            with open(entities_file_path, "rb") as f:
                entities = pickle.load(f)
            return {"entities": entities, "entities_processed_file_path": entities_file_path}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error loading entities: {str(e)}")

    # Load the pickled document contents
    try:
        documents = entity_search_service.load_parsed_data_from_dir(pickle_file_path)
    except FileNotFoundError as e:
        raise Exception(f"An error occurred while processing: {str(e)}")

    # Perform entity extraction
    entities = entity_search_service.extract_entities_from_documents(documents)

    # Save the extracted entities to a file with '_all_entities.pkl' suffix in the given directory
    try:
        with open(entities_file_path, "wb") as f:
            pickle.dump(entities, f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving entities: {str(e)}")

    return {"entities": entities, "entities_processed_file_path": entities_file_path}


@router.post("/neo4j-ingest/")
async def neo4j_ingest(entities_pickle_file_path: str):
    """
    Ingest entities from a previously processed endpoint entity_search into Neo4j.

    :param entities_pickle_file_path: Path to the directory containing the pickled file with extracted entities.
    :return: JSON message indicating success or failure.
    """
    # Load the saved entities
    if os.path.exists(entities_pickle_file_path):
        try:
            with open(entities_pickle_file_path, "rb") as f:
                entities = pickle.load(f)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error loading entities for Neo4j ingestion: {str(e)}")
    else:
        raise HTTPException(status_code=404, detail="Entities file not found for Neo4j ingestion.")

    # Ingest entities into Neo4j
    # entities = entities[:1]  # Limiting for example purposes
    NEO4J_URI = os.getenv("NEO4J_URI")
    NEO4J_USERNAME = os.getenv("NEO4J_USERNAME")
    NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")
    AURA_INSTANCEID = os.getenv("AURA_INSTANCEID")
    AURA_INSTANCENAME = os.getenv("AURA_INSTANCENAME")

    # Check if all required environment variables are set
    if not all([NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD, AURA_INSTANCEID, AURA_INSTANCENAME]):
        missing_keys = []
        if not NEO4J_URI:
            missing_keys.append("NEO4J_URI")
        if not NEO4J_USERNAME:
            missing_keys.append("NEO4J_USERNAME")
        if not NEO4J_PASSWORD:
            missing_keys.append("NEO4J_PASSWORD")
        if not AURA_INSTANCEID:
            missing_keys.append("AURA_INSTANCEID")
        if not AURA_INSTANCENAME:
            missing_keys.append("AURA_INSTANCENAME")

        missing_keys_str = ", ".join(missing_keys)
        raise HTTPException(status_code=500, detail=f"Missing required environment variables: {missing_keys_str}")

    try:
        # Initialize the Neo4j driver and ingest the entities
        graph_store = Neo4jGraphStore(
            username=NEO4J_USERNAME,
            password=NEO4J_PASSWORD,
            url=NEO4J_URI,
        )

        storage_context = StorageContext.from_defaults(graph_store=graph_store)

        # initialize an empty index for now
        index = KnowledgeGraphIndex.from_documents([], storage_context=storage_context)
        node_parser = SentenceSplitter()

        for entity in entities:
            node = node_parser.get_nodes_from_documents([entity["doc"]])
            node_tup = [(each[0], each[2], each[4]) for each in entity["entities"]]
            for tup in node_tup:
                index.upsert_triplet_and_node(tup, node[0])

        query_engine = index.as_query_engine(include_text=True, response_mode="tree_summarize")
        response = query_engine.query("Tell me more about Rohan")
        print(response)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in ingesting data into Neo4J: {str(e)}")

    return {"message": "Neo4j ingestion successful."}
