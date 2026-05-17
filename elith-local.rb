# Homebrew Formula for Elith CLI (Local Testing Version)
# For local testing only - uses current directory instead of downloading

class ElithLocal < Formula
  include Language::Python::Virtualenv

  desc "Universal repo-aware AI agent framework with auto-service management"
  homepage "https://github.com/Silo-HQ/elith"
  url "file:///Volumes/DataVault/Projects/elith", using: :git, branch: "dev"
  version "0.1.0-local"
  license "MIT"

  depends_on "python@3.10"
  depends_on "node"

  def install
    # Install Python package
    virtualenv_install_with_resources
    
    # Create config directory
    (var/"elith").mkpath
    
    # Install TUI dependencies if directory exists
    if (buildpath/"tui").directory?
      cd "tui" do
        system "npm", "install", "--production"
      end
    end
  end

  def post_install
    # Create default config directory
    (var/"elith/config").mkpath
    
    # Create .elith directory in user home
    (Dir.home/".elith").mkpath
  end

  def caveats
    <<~EOS
      🎉 Elith has been installed (local test version)!
      
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
  end
end

# Made with Bob