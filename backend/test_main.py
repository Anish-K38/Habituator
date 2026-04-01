import sys
import traceback

try:
    import main
    print("Success!")
except Exception as e:
    print("ERROR CAUGHT:")
    traceback.print_exc()
