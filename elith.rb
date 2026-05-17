# Homebrew Formula for Elith CLI
# To install: brew install /path/to/elith.rb
# Or publish to tap: brew tap your-org/elith && brew install elith

class Elith < Formula
  include Language::Python::Virtualenv

  desc "Universal repo-aware AI agent framework with auto-service management"
  homepage "https://github.com/Silo-HQ/elith"
  url "https://github.com/Silo-HQ/elith/archive/refs/tags/v0.1.0.tar.gz"
  sha256 "YOUR_SHA256_HERE"  # Generate with: shasum -a 256 v0.1.0.tar.gz
  license "MIT"
  head "https://github.com/Silo-HQ/elith.git", branch: "main"

  depends_on "python@3.10"
  depends_on "node"  # For TUI

  # Core dependencies
  resource "anthropic" do
    url "https://files.pythonhosted.org/packages/source/a/anthropic/anthropic-0.102.0.tar.gz"
    sha256 "ANTHROPIC_SHA256"
  end

  resource "openai" do
    url "https://files.pythonhosted.org/packages/source/o/openai/openai-2.37.0.tar.gz"
    sha256 "OPENAI_SHA256"
  end

  resource "google-generativeai" do
    url "https://files.pythonhosted.org/packages/source/g/google-generativeai/google-generativeai-0.3.0.tar.gz"
    sha256 "GEMINI_SHA256"
  end

  resource "fastapi" do
    url "https://files.pythonhosted.org/packages/source/f/fastapi/fastapi-0.104.0.tar.gz"
    sha256 "FASTAPI_SHA256"
  end

  resource "uvicorn" do
    url "https://files.pythonhosted.org/packages/source/u/uvicorn/uvicorn-0.24.0.tar.gz"
    sha256 "UVICORN_SHA256"
  end

  resource "rich" do
    url "https://files.pythonhosted.org/packages/source/r/rich/rich-15.0.0.tar.gz"
    sha256 "RICH_SHA256"
  end

  resource "requests" do
    url "https://files.pythonhosted.org/packages/source/r/requests/requests-2.34.2.tar.gz"
    sha256 "REQUESTS_SHA256"
  end

  resource "pydantic" do
    url "https://files.pythonhosted.org/packages/source/p/pydantic/pydantic-2.13.4.tar.gz"
    sha256 "PYDANTIC_SHA256"
  end

  resource "psutil" do
    url "https://files.pythonhosted.org/packages/source/p/psutil/psutil-5.9.6.tar.gz"
    sha256 "PSUTIL_SHA256"
  end

  resource "sse-starlette" do
    url "https://files.pythonhosted.org/packages/source/s/sse-starlette/sse-starlette-1.6.5.tar.gz"
    sha256 "SSE_SHA256"
  end

  resource "python-dotenv" do
    url "https://files.pythonhosted.org/packages/source/p/python-dotenv/python-dotenv-1.0.0.tar.gz"
    sha256 "DOTENV_SHA256"
  end

  def install
    # Install Python package with all dependencies
    virtualenv_install_with_resources
    
    # Create config directory
    (var/"elith").mkpath
    
    # Install TUI dependencies
    cd "tui" do
      system "npm", "install", "--production"
    end if File.directory?("tui")
    
    # Install completion scripts (optional)
    # bash_completion.install "completions/elith.bash" => "elith"
    # zsh_completion.install "completions/_elith"
  end

  def post_install
    # Create default config directory
    (var/"elith/config").mkpath
    
    # Create .elith directory in user home
    (Dir.home/".elith").mkpath
  end

  def caveats
    <<~EOS
      🎉 Elith has been installed!
      
      Quick Start:
        1. Run: elith
           (First run will guide you through setup)
        
        2. The backend service will auto-start when needed
        
        3. Use 'elith service status' to check backend status
      
      Commands:
        elith                    # Start interactive mode (auto-starts backend)
        elith init               # Reconfigure providers
        elith service start      # Manually start backend
        elith service stop       # Stop backend
        elith service status     # Check backend status
        elith --help             # Show all commands
      
      Configuration: ~/.elith/config.toml
      Backend logs: ~/.elith/backend.log
      
      The backend runs on http://localhost:8000 and persists between sessions.
    EOS
  end

  test do
    system "#{bin}/elith", "--version"
    system "#{bin}/elith", "--help"
    system "#{bin}/elith", "service", "status"
  end
end

# Made with Bob
