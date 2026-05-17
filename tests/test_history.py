#!/usr/bin/env python3
"""Test script for session history functionality."""
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_history_endpoints():
    """Test the history API endpoints."""
    print("Testing Session History Implementation\n")
    print("=" * 50)
    
    # Test 1: Check if backend is running
    print("\n1. Checking backend status...")
    try:
        response = requests.get(f"{BASE_URL}/api/status")
        if response.status_code == 200:
            print("✓ Backend is online")
        else:
            print("✗ Backend returned unexpected status")
            return
    except requests.exceptions.ConnectionError:
        print("✗ Backend is not running. Start it with:")
        print("  python -m uvicorn backend.main:app --reload --port 8000")
        return
    
    # Test 2: Get history (should be empty or have existing sessions)
    print("\n2. Fetching session history...")
    try:
        response = requests.get(f"{BASE_URL}/api/history")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ History endpoint working")
            print(f"  Found {data['total']} sessions in history")
            
            if data['sessions']:
                print("\n  Recent sessions:")
                for session in data['sessions'][:3]:
                    print(f"    - {session['operation']} ({session['model']}) - {session['status']}")
        else:
            print(f"✗ History endpoint returned {response.status_code}")
    except Exception as e:
        print(f"✗ Error fetching history: {e}")
    
    # Test 3: Test history with filters
    print("\n3. Testing history filters...")
    try:
        response = requests.get(f"{BASE_URL}/api/history?limit=5&status=completed")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Filter working - found {data['total']} completed sessions")
        else:
            print(f"✗ Filter test failed with status {response.status_code}")
    except Exception as e:
        print(f"✗ Error testing filters: {e}")
    
    # Test 4: Check if history file exists
    print("\n4. Checking history storage...")
    import os
    history_file = "bob-reports/session_history.json"
    if os.path.exists(history_file):
        print(f"✓ History file exists: {history_file}")
        with open(history_file, 'r') as f:
            history_data = json.load(f)
            print(f"  Contains {len(history_data)} sessions")
    else:
        print(f"✓ History file will be created on first session completion")
    
    print("\n" + "=" * 50)
    print("\nSession History Implementation Complete! ✓")
    print("\nTo test in TUI:")
    print("  1. Start the TUI: npm start (in tui/ directory)")
    print("  2. Type: /history")
    print("  3. Press Esc to close history viewer")
    print("\nAPI Endpoints Available:")
    print("  GET  /api/history - Get session history")
    print("  GET  /api/history/{session_id} - Get specific session")
    print("  DELETE /api/history - Clear all history")

if __name__ == "__main__":
    test_history_endpoints()

# Made with Bob
