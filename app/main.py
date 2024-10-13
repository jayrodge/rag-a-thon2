from fastapi import FastAPI
from app.routes import router

app = FastAPI()

# Include the routes
app.include_router(router)
