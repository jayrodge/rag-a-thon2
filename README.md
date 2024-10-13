# FastAPI Document Parser

This repository contains a FastAPI application that parses documents using a custom document parser LlamaParser and process it using Agent powered by Llama-index.

## Features
- Multiple file upload support
- Document parsing using `LlamaParser`
- Saving parsed sections into separate text files
- Extract entities using TextExtractEntitiesAgent using `llama-index`

## Requirements
- Python 3.7+
- FastAPI
- Uvicorn

## Setup Instructions

- Set up the ENV Variables
   - GROQ_API_KEY
   - LLAMAINDEX_CLOUD
   - NEO4J_URI
   - NEO4J_USERNAME
   - NEO4J_PASSWORD



Start the server:
``` uvicorn app.main:app --reload ````
