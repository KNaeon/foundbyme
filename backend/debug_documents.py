
import sys
import os

# Add current directory to sys.path
sys.path.append(os.getcwd())

from app import list_documents, chroma

print("Testing list_documents...")
try:
    # Test with default session
    res = list_documents(session_id="default")
    print("Result for default:", res)
    
    # Test with a specific session
    res = list_documents(session_id="test_session")
    print("Result for test_session:", res)
    
except Exception as e:
    print("Error:", e)
    import traceback
    traceback.print_exc()
