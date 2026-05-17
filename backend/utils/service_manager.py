"""Service manager for auto-starting backend and managing processes."""
import os
import sys
import time
import signal
import subprocess
import socket
import atexit
from pathlib import Path
from typing import Optional
import psutil


class ServiceManager:
    """Manages backend service lifecycle."""
    
    def __init__(self):
        self.backend_process: Optional[subprocess.Popen] = None
        self.pid_file = Path.home() / ".elith" / "backend.pid"
        self.log_file = Path.home() / ".elith" / "backend.log"
        self.backend_port = 8000
        
        # Ensure directories exist
        self.pid_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Register cleanup on exit
        atexit.register(self.cleanup)
    
    def is_port_in_use(self, port: int) -> bool:
        """Check if a port is already in use."""
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("127.0.0.1", port))
                return False
            except OSError:
                return True
    
    def is_backend_running(self) -> bool:
        """Check if backend is already running."""
        # Check if port is in use
        if not self.is_port_in_use(self.backend_port):
            return False
        
        # Check if PID file exists and process is alive
        if self.pid_file.exists():
            try:
                pid = int(self.pid_file.read_text().strip())
                if psutil.pid_exists(pid):
                    # Verify it's actually our backend process
                    try:
                        proc = psutil.Process(pid)
                        cmdline = " ".join(proc.cmdline())
                        if "uvicorn" in cmdline and "backend.main:app" in cmdline:
                            return True
                    except (psutil.NoSuchProcess, psutil.AccessDenied):
                        pass
            except (ValueError, FileNotFoundError):
                pass
        
        return False
    
    def wait_for_backend(self, timeout: int = 30) -> bool:
        """Wait for backend to be ready."""
        import requests
        
        start_time = time.time()
        while time.time() - start_time < timeout:
            try:
                response = requests.get(f"http://localhost:{self.backend_port}/health", timeout=1)
                if response.status_code == 200:
                    return True
            except requests.exceptions.RequestException:
                pass
            time.sleep(0.5)
        
        return False
    
    def start_backend(self, verbose: bool = False) -> bool:
        """Start the backend service if not already running."""
        if self.is_backend_running():
            if verbose:
                print(f"✓ Backend already running on port {self.backend_port}")
            return True
        
        if verbose:
            print(f"Starting backend on port {self.backend_port}...")
        
        # Find the elith installation directory
        elith_dir = Path(__file__).parent.parent.parent
        
        # Prepare environment
        env = os.environ.copy()
        
        # Start backend process
        try:
            log_handle = open(self.log_file, "w")
            
            self.backend_process = subprocess.Popen(
                [
                    sys.executable, "-m", "uvicorn",
                    "backend.main:app",
                    "--host", "127.0.0.1",
                    "--port", str(self.backend_port),
                    "--log-level", "warning"
                ],
                cwd=str(elith_dir),
                stdout=log_handle,
                stderr=subprocess.STDOUT,
                env=env,
                start_new_session=True  # Detach from parent
            )
            
            # Save PID
            self.pid_file.write_text(str(self.backend_process.pid))
            
            # Wait for backend to be ready
            if self.wait_for_backend():
                if verbose:
                    print(f"✓ Backend started successfully (PID: {self.backend_process.pid})")
                return True
            else:
                if verbose:
                    print("✗ Backend failed to start within timeout")
                self.stop_backend()
                return False
        
        except Exception as e:
            if verbose:
                print(f"✗ Failed to start backend: {e}")
            return False
    
    def stop_backend(self, verbose: bool = False):
        """Stop the backend service."""
        stopped = False
        
        # Try to stop via PID file
        if self.pid_file.exists():
            try:
                pid = int(self.pid_file.read_text().strip())
                if psutil.pid_exists(pid):
                    proc = psutil.Process(pid)
                    proc.terminate()
                    try:
                        proc.wait(timeout=5)
                        stopped = True
                    except psutil.TimeoutExpired:
                        proc.kill()
                        stopped = True
                
                self.pid_file.unlink()
            except (ValueError, FileNotFoundError, psutil.NoSuchProcess):
                pass
        
        # Stop our subprocess if we have one
        if self.backend_process:
            try:
                self.backend_process.terminate()
                self.backend_process.wait(timeout=5)
                stopped = True
            except subprocess.TimeoutExpired:
                self.backend_process.kill()
                stopped = True
            except Exception:
                pass
            finally:
                self.backend_process = None
        
        if verbose and stopped:
            print("✓ Backend stopped")
    
    def restart_backend(self, verbose: bool = False) -> bool:
        """Restart the backend service."""
        self.stop_backend(verbose)
        time.sleep(1)
        return self.start_backend(verbose)
    
    def get_status(self) -> dict:
        """Get backend service status."""
        running = self.is_backend_running()
        
        status = {
            "running": running,
            "port": self.backend_port,
            "pid": None,
            "log_file": str(self.log_file)
        }
        
        if running and self.pid_file.exists():
            try:
                status["pid"] = int(self.pid_file.read_text().strip())
            except (ValueError, FileNotFoundError):
                pass
        
        return status
    
    def cleanup(self):
        """Cleanup on exit - but don't stop backend (let it run)."""
        # We intentionally don't stop the backend here
        # It should keep running even after CLI exits
        pass
    
    def ensure_backend(self, verbose: bool = False) -> bool:
        """Ensure backend is running, start if needed."""
        if not self.is_backend_running():
            return self.start_backend(verbose)
        return True


# Global instance
_service_manager = None


def get_service_manager() -> ServiceManager:
    """Get or create the global service manager instance."""
    global _service_manager
    if _service_manager is None:
        _service_manager = ServiceManager()
    return _service_manager


# Made with Bob