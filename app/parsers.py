import os
import pickle
from llama_index.core import SimpleDirectoryReader
from llama_parse import LlamaParse


class LlamaParser:
    def parse(self, document_content: str) -> dict:
        """Simulate document parsing."""
        return {"section1": "Parsed content of section 1", "section2": "Parsed content of section 2"}


class DocumentParser:
    def __init__(self):
        api_key = os.getenv("LLAMAINDEX_CLOUD")
        if not api_key:
            raise ValueError("LLAMAINDEX_CLOUD environment variable not set.")

        self.parser = LlamaParse(
            api_key=api_key,
            result_type="markdown",  # Can be "markdown" or "text"
            num_workers=4,  # Split in `num_workers` API calls for multiple files
            verbose=True,
            language="en",
        )

    def parse_document(self, content, extra_info):
        documents = self.parser.load_data(content, extra_info=extra_info)
        return documents

    def write_parsed_data_to_files(self, documents, output_dir: str, file_hash: str):
        """Write the parsed data to local files using the file hash as the file name."""
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        # Save the pickled documents to a file named after the file hash
        pickle_file = os.path.join(output_dir, f"{file_hash}.pkl")
        with open(pickle_file, "wb") as f:
            pickle.dump(documents, f)

    def load_parsed_data_from_files(self, output_dir: str):
        """Load the pickled documents from a file using the file hash as the file name."""

        if not os.path.exists(output_dir):
            raise FileNotFoundError(f"Pickle file {output_dir} not found.")

        # Load the pickled documents
        with open(output_dir, "rb") as f:
            documents = pickle.load(f)

        return documents

    def load_parsed_data_from_dir(self, output_dir: str):
        all_documents = []
        processed_files_dir = os.path.join(output_dir, "processed_files")

        for file_name in os.listdir(processed_files_dir):
            if file_name.endswith(".pkl"):
                file_path = os.path.join(processed_files_dir, file_name)
                try:
                    with open(file_path, "rb") as f:
                        documents = pickle.load(f)
                        all_documents.extend(documents)
                except Exception as e:
                    print(f"Error loading file {file_path}: {e}")
        return all_documents
