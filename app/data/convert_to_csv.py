import json
import csv
import os

def convert_json_to_csv(json_file_path):
    # Output file path (same folder, different extension)
    csv_file_path = os.path.splitext(json_file_path)[0] + '.csv'
    
    try:
        # Load JSON data
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # In this specific file, stories are under the "stories" key
        stories = data.get('stories', [])
        
        if not stories:
            print("No stories found in the JSON file.")
            return

        # Get all unique keys from all stories to use as headers
        headers = set()
        for story in stories:
            headers.update(story.keys())
        headers = sorted(list(headers))

        # Write to CSV
        with open(csv_file_path, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=headers)
            writer.writeheader()
            writer.writerows(stories)
            
        print(f"Successfully converted to CSV: {csv_file_path}")
        print("Note: CSV files are natively supported by Excel and are much more portable.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    target_file = "/var/www/html/old/stories/app/data/stories.json"
    convert_json_to_csv(target_file)
