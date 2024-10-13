import os
from pinecone import Pinecone, ServerlessSpec


class PineconeVectorStore:
    def __init__(self, index_name: str, dimension: int, metric: str = "euclidean"):
        api_key = os.getenv("PINECONE_API_KEY")

        if not api_key:
            raise ValueError("Pinecone key not set in environment variables.")

        # Initialize Pinecone client
        self.pc = Pinecone(api_key=api_key)

        # Store the index name and other configuration details
        self.index_name = index_name
        self.dimension = dimension
        self.metric = metric
        self.spec = ServerlessSpec(cloud="aws", region="us-west-2")

        # Check if index already exists, if not, create it
        self._create_index()

    def _create_index(self):
        """Create a new index in Pinecone."""
        if not self.pc.index_exists(self.index_name):
            self.pc.create_index(
                name=self.index_name,
                dimension=self.dimension,
                metric=self.metric,
                spec=self.spec,
            )
            print(f"Index '{self.index_name}' created successfully.")
        else:
            print(f"Index '{self.index_name}' already exists.")

    # def add_documents_to_index(self, documents):
    #     """Add parsed documents to Pinecone index."""
    #     for doc in documents:
    #         # Assuming `doc` is an object with an embedding attribute for simplicity
    #         vector = doc.embedding  # Replace with correct method for extracting embeddings
    #         metadata = {"document": doc.text}
    #         self.pc.index(self.index_name).upsert(vectors=[vector], metadata=[metadata])

    #     print(f"Added {len(documents)} documents to Pinecone index '{self.index_name}'.")
