import os
import re
import fitz  # PyMuPDF
import shutil
from tkinter import Tk, filedialog

# ---------------------------
# Helper: Clean filename
# ---------------------------
def clean_filename(name):
    name = name.strip()
    name = re.sub(r'[\\/*?:"<>|]', "", name)
    name = re.sub(r'\s+', "_", name)
    return name[:150]

# ---------------------------
# Extract title
# ---------------------------
def extract_title(doc):
    metadata = doc.metadata
    if metadata and metadata.get("title"):
        return metadata.get("title")

    try:
        first_page = doc[0]
        text = first_page.get_text("text")
        lines = text.split("\n")

        for line in lines:
            line = line.strip()
            if len(line) > 10:
                return line
    except:
        pass

    return "Untitled"

# ---------------------------
# Handle duplicate filenames
# ---------------------------
def get_unique_path(path):
    base, ext = os.path.splitext(path)
    counter = 1
    new_path = path
    while os.path.exists(new_path):
        new_path = f"{base}_{counter}{ext}"
        counter += 1
    return new_path

# ---------------------------
# Main processing
# ---------------------------
def process_pdfs(folder_path):
    backup_folder = os.path.join(folder_path, "backup_originals")
    full_folder = os.path.join(folder_path, "renamed_full")
    first_page_folder = os.path.join(folder_path, "first_page_only")

    os.makedirs(backup_folder, exist_ok=True)
    os.makedirs(full_folder, exist_ok=True)
    os.makedirs(first_page_folder, exist_ok=True)

    for filename in os.listdir(folder_path):
        if filename.lower().endswith(".pdf"):
            old_path = os.path.join(folder_path, filename)

            # Skip if it's already inside output folders
            if any(folder in old_path for folder in [backup_folder, full_folder, first_page_folder]):
                continue

            try:
                doc = fitz.open(old_path)

                if doc.page_count == 0:
                    print(f"Skipping empty PDF: {filename}")
                    continue

                # Extract and clean title
                title = extract_title(doc)
                clean_title = clean_filename(title)

                # ---------------------------
                # Save FULL renamed PDF
                # ---------------------------
                full_path = os.path.join(full_folder, clean_title + ".pdf")
                full_path = get_unique_path(full_path)
                shutil.copy(old_path, full_path)

                # ---------------------------
                # Save FIRST PAGE PDF
                # ---------------------------
                first_page_path = os.path.join(first_page_folder, clean_title + "_page1.pdf")
                first_page_path = get_unique_path(first_page_path)

                new_doc = fitz.open()
                new_doc.insert_pdf(doc, from_page=0, to_page=0)
                new_doc.save(first_page_path)
                new_doc.close()

                doc.close()

                # ---------------------------
                # Move ORIGINAL to backup
                # ---------------------------
                backup_path = os.path.join(backup_folder, filename)
                backup_path = get_unique_path(backup_path)
                shutil.move(old_path, backup_path)

                print(f"\nProcessed: {filename}")
                print(f" → Full PDF: {full_path}")
                print(f" → First Page: {first_page_path}")
                print(f" → Backup: {backup_path}")

            except Exception as e:
                print(f"Error processing {filename}: {e}")

# ---------------------------
# Folder selection GUI
# ---------------------------
def select_folder():
    root = Tk()
    root.withdraw()
    folder_selected = filedialog.askdirectory(title="Select Folder with PDFs")
    return folder_selected

# ---------------------------
# Run
# ---------------------------
if __name__ == "__main__":
    folder = select_folder()
    if folder:
        process_pdfs(folder)
        print("\n✅ All PDFs processed successfully!")
    else:
        print("No folder selected.")