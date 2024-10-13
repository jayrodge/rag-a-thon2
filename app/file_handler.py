import os
import hashlib
import zipfile
from fastapi import HTTPException


class FileHandler:
    @staticmethod
    def calculate_file_hash(file_content: bytes) -> str:
        """Calculate SHA-256 hash of the file content."""
        sha256_hash = hashlib.sha256()
        sha256_hash.update(file_content)
        return sha256_hash.hexdigest()

    # @staticmethod
    # def file_exists(file_hash: str, output_dir: str) -> bool:
    #     """Check if a file with the given hash already exists."""
    #     existing_files = os.listdir(output_dir)
    #     return f"{file_hash}.txt" in existing_files

    # @staticmethod
    # def save_file_hash(file_hash: str, output_dir: str):
    #     """Save an empty file named by its hash to signify that the file has been processed."""
    #     output_file = os.path.join(output_dir, f"{file_hash}.txt")
    #     with open(output_file, "w") as f:
    #         f.write("Processed")

    @staticmethod
    def extract_zip(zip_content: bytes, extract_dir: str) -> str:
        """Extract zip file content to a specified directory."""
        if not os.path.exists(extract_dir):
            os.makedirs(extract_dir)

        zip_path = os.path.join(extract_dir, "uploaded.zip")
        with open(zip_path, "wb") as f:
            f.write(zip_content)

        try:
            with zipfile.ZipFile(zip_path, "r") as zip_ref:
                zip_ref.extractall(extract_dir)
        except zipfile.BadZipFile:
            raise HTTPException(status_code=400, detail="Uploaded file is not a valid zip file.")

        # After extraction, remove the .zip file
        os.remove(zip_path)
        return extract_dir
