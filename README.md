# Timeline of You: Comprehensive Career Analysis and Documentation

Our project aims to revolutionize how professionals document, analyze, and showcase their career achievements, and a part of [Agentic RAG-A-THON](https://rag-a-thon-2.devpost.com/) submission that was organized by LlamaIndex in Palo Alto, CA, USA. View our [Devpost submission](post.com/software/timeline-of-you).

This repository contains a FastAPI application that parses documents using a custom document parser LlamaParser and process it using Agent powered by Llama-index.

## Features
- Multiple file upload support
- Document parsing using `LlamaParser`
- Saving parsed sections into separate text files
- Extract entities using TextExtractEntitiesAgent using `llama-index` agents
- Ingested entities into Neo4j instance
- Query GraphRAG with `llama-index` agent
- 

## Requirements
- pip install -r requirements.txt

## Setup Instructions

- Set up the ENV Variables
   - GROQ_API_KEY
   - LLAMAINDEX_CLOUD
   - NEO4J_URI
   - NEO4J_USERNAME
   - NEO4J_PASSWORD
   - AURA_INSTANCEID
   - AURA_INSTANCENAME
   - TOGETHER_API_KEY
   - OPENAI_API_KEY


- create virtual env
- install the dependencies
- Start the server:
```uvicorn app.main:app --reload````
