"""Elith FastAPI backend."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import scan, execute, stream, models, results, tasks

app = FastAPI(
    title="Elith API",
    version="0.1.0",
    description="Universal repo-aware agent framework"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(scan.router, prefix="/api", tags=["scan"])
app.include_router(execute.router, prefix="/api", tags=["execute"])
app.include_router(stream.router, prefix="/api", tags=["stream"])
app.include_router(models.router, prefix="/api", tags=["models"])
app.include_router(results.router, prefix="/api", tags=["results"])
app.include_router(tasks.router, prefix="/api", tags=["tasks"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "Elith API",
        "version": "0.1.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}

# Made with Bob
