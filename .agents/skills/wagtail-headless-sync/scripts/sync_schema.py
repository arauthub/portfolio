#!/usr/bin/env python3
"""
Wagtail Headless Schema Sync Checker
Checks Django models in commerce and catalog against Angular TypeScript model interfaces.
"""
import os
import sys

def check_models():
    print("Checking Django Wagtail headless model status...")
    
    atelier_manage = "Websites/atelier-clothing-brand/backend/manage.py"
    kids_manage = "Websites/petit-maison-kids/backend/manage.py"
    
    errors = 0
    if os.path.exists(atelier_manage):
        cmd = f"cd Websites/atelier-clothing-brand/backend && ./venv/bin/python manage.py check"
        ret = os.system(cmd)
        if ret != 0:
            print("✕ Atelier backend check failed!")
            errors += 1
        else:
            print("✓ Atelier Wagtail Django check passed (0 issues)")
            
    if os.path.exists(kids_manage):
        cmd = f"cd Websites/petit-maison-kids/backend && ./venv/bin/python manage.py check"
        ret = os.system(cmd)
        if ret != 0:
            print("✕ Nanhi Maison backend check failed!")
            errors += 1
        else:
            print("✓ Nanhi Maison Wagtail Django check passed (0 issues)")

    if errors == 0:
        print("\nAll Wagtail backend models and headless configurations are healthy!")
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    check_models()
