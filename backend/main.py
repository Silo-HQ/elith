"""Elith FastAPI backend."""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .routes import scan, execute, stream, models, results, tasks
from .utils.logger import logger
import time
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

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


@app.get("/api/status")
async def api_status():
    """API status endpoint for TUI polling."""
    return {
        "status": "online",
        "version": "0.1.0",
        "model": os.getenv("DEFAULT_MODEL", "lmstudio"),
        "skills": 12,
        "ctx_percent": 0,
        "quota_percent": 0,
        "memory_mb": 0,
        "tokens": 0
    }


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests and add timing."""
    start_time = time.time()
    
    logger.info(f"Request: {request.method} {request.url.path}")
    
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        logger.info(f"Response: {response.status_code} ({process_time:.3f}s)")
        return response
    except Exception as e:
        logger.error(f"Request failed: {str(e)}")
        raise


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle uncaught exceptions."""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc),
            "path": request.url.path
        }
    )


@app.get("/health")
async def health():
    """Health check endpoint."""
    logger.debug("Health check requested")
    return {"status": "healthy", "service": "elith-backend"}

# Made with Bob
