import os
import json
from typing import List, Dict
import ast

from app.parsers import DocumentParser
from config.constants import GROQ_MODEL_LLAMA3_70B
from prompts.entity_extraction_prompt import entity_extraction_template
from llama_index.llms.groq import Groq


class TextEntitySearchAgent:
    def __init__(self):
        self.agent = None

    def load_parsed_data_from_dir(self, output_dir: str):
        """Load the pickled documents from a file using the file hash as the file name."""
        document_parser = DocumentParser()
        all_loaded_doc = document_parser.load_parsed_data_from_dir(output_dir)
        return all_loaded_doc

    def extract_entities_from_documents(self, documents) -> List[str]:
        """
        Use the LlamaIndex agent to extract entities from the documents.

        :param documents: List of parsed documents.
        :return: List of identified entities.
        """
        entities = []
        error_docs = 0
        GROQ_API_KEY = os.getenv("GROQ_API_KEY")
        if not GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY environment variable not set.")
        llm = Groq(model=GROQ_MODEL_LLAMA3_70B, api_key=GROQ_API_KEY)
        print(f"total docs to process: {len(documents)}")
        for i, doc in enumerate(documents):
            # Assuming doc.text contains the text content from which we extract entities
            if i % 20 == 0:
                print(f"processing file: {i}")
            text = doc.text
            prompt = entity_extraction_template.format(doc=text)
            try:
                response = llm.complete(prompt)
                ans = ast.literal_eval(response.text)
                entities.append({"doc": doc, "entities": ans})
            except Exception as e:
                print(f"could not process chunks: {doc}")
                error_docs += 1
        print(f"Total error chunks: {error_docs}")
        return entities

    def generate_neo4j_data(self, entities) -> Dict:
        """
        Generate a list of nodes and relationships for ingestion into Neo4J.

        :param documents: List of parsed documents.
        :return: Dictionary with "nodes" and "relationships" for Neo4J.
        """
        nodes = []
        relationships = []

        for prompt_extracted_data in entities:
            # Add each entity as a node
            for entity in entities:
                nodes.append({"name": entity})

            # Establish relationships between entities (basic example based on proximity)
            for i, entity in enumerate(entities):
                if i < len(entities) - 1:
                    relationships.append(
                        {"source": entities[i], "target": entities[i + 1], "relationship": "related_to"}
                    )

        return {"nodes": nodes, "relationships": relationships}

    def save_neo4j_data_to_file(self, data: Dict, file_path: str):
        """Save the Neo4J data (nodes and relationships) to a file."""
        with open(file_path, "w") as f:
            json.dump(data, f)

    def load_neo4j_data_from_file(self, file_path: str) -> Dict:
        """Load Neo4J data (nodes and relationships) from a file."""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Neo4J data file {file_path} not found.")

        with open(file_path, "r") as f:
            data = json.load(f)

        return data

    def check_if_neo4j_data_exists(self, file_hash: str, output_dir: str) -> str:
        """Check if Neo4J data already exists for the given file hash."""
        file_path = os.path.join(output_dir, f"{file_hash}_neo4j.json")
        if os.path.exists(file_path):
            return file_path
        return None
