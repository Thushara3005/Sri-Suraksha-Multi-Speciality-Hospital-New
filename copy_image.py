#!/usr/bin/env python3
import shutil
import os

source = r"C:\Users\Admin\Downloads\WhatsApp Image 2026-08-14 at 14.21.03.jpeg"
dest = r"d:\SriSurakshaHospital-Fresh\public\dr-triveni-reddy-new.png"

print(f"Source: {source}")
print(f"Source exists: {os.path.exists(source)}")

if os.path.exists(source):
    print(f"Source file size: {os.path.getsize(source)} bytes")
    try:
        shutil.copy2(source, dest)
        print(f"Copy successful")
        if os.path.exists(dest):
            print(f"Destination file size: {os.path.getsize(dest)} bytes")
            print(f"SUCCESS: File verified at {dest}")
        else:
            print(f"ERROR: File not found after copy")
    except Exception as e:
        print(f"ERROR during copy: {e}")
else:
    print(f"ERROR: Source file not found")
