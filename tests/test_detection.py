#!/usr/bin/env python3
"""Test if project creation detection works"""

import re

def _is_project_creation_request(message: str) -> bool:
    """Detect if message is requesting project creation"""
    creation_keywords = [
        # Broad patterns - match create/build/etc + anything + app/application/etc
        r'(create|build|develop|make|generate)\s+.*(app|application|project|system|platform|service|microservice)',
    ]
    
    # Exclude patterns that are NOT project creation
    exclude_patterns = [
        r'how\s+(do|to|can)',  # "how do I create..."
        r'what\s+is',          # "what is..."
        r'explain',            # "explain..."
        r'create\s+a\s+(function|class|method|variable)',  # code-level creation
    ]
    
    message_lower = message.lower()
    
    # Check if it matches creation pattern
    matches_creation = any(re.search(pattern, message_lower) for pattern in creation_keywords)
    
    # Check if it matches exclusion pattern
    matches_exclusion = any(re.search(pattern, message_lower) for pattern in exclude_patterns)
    
    return matches_creation and not matches_exclusion

# Test cases
test_messages = [
    ("create me an itinerary application", True),
    ("build a todo app", True),
    ("create an e-commerce platform", True),
    ("make me a blog system", True),
    ("what is DevSecOps?", False),
    ("how do I create a function?", False),
    ("explain microservices", False),
]

print("🧪 Testing Project Creation Detection\n")

all_passed = True
for message, expected in test_messages:
    result = _is_project_creation_request(message)
    status = "✅" if result == expected else "❌"
    
    if result != expected:
        all_passed = False
    
    print(f"{status} '{message}'")
    print(f"   Expected: {expected}, Got: {result}\n")

if all_passed:
    print("✅ All tests passed!")
else:
    print("❌ Some tests failed!")

# Made with Bob
