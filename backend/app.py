from flask import Flask, request, jsonify
import face_recognition
import os
import cv2

from flask_cors import CORS
app = Flask(__name__)
CORS(app)

# Path to known faces and encodings
KNOWN_FACES_DIR = "/home/rgukt/Documents/personals/PROJECT_MAJOR/project-bolt-sb1-pmbpm6/backend/images"

# Load all known faces from the images folder
def load_known_faces():
    known_faces = []
    try:
        for filename in os.listdir(KNOWN_FACES_DIR):
            if filename.endswith(('.jpg', '.jpeg', '.png')):
                # Load the image file
                image_path = os.path.join(KNOWN_FACES_DIR, filename)
                image = face_recognition.load_image_file(image_path)
                
                # Find face locations and encodings
                face_locations = face_recognition.face_locations(image)
                face_encodings = face_recognition.face_encodings(image, face_locations)
                
                # If faces are found, add their encodings and the image filename (name)
                for face_encoding in face_encodings:
                    known_faces.append({
                        'name': filename.split('.')[0],  # Use the filename as the name
                        'encoding': face_encoding
                    })
        print(f"Loaded {len(known_faces)} known faces.")
    except Exception as e:
        print(f"Error loading known faces: {e}")
    
    return known_faces

# Initialize known faces
known_faces = load_known_faces()

# Endpoint for uploading the face image and performing recognition
@app.route('/recognize/', methods=['POST'])
def recognize_face():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        # Read the uploaded image
        image = face_recognition.load_image_file(file)
        
        # Find faces in the uploaded image
        face_locations = face_recognition.face_locations(image)
        face_encodings = face_recognition.face_encodings(image, face_locations)
        
        if not face_encodings:
            return jsonify({"error": "No face found in the image"}), 400
        
        # Compare the uploaded face with known faces
        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces([known_face['encoding'] for known_face in known_faces], face_encoding)
            if True in matches:
                matched_idx = matches.index(True)
                matched_face = known_faces[matched_idx]
                return jsonify({"name": matched_face['name']}), 200
        
        return jsonify({"error": "Face not recognized"}), 400
    except Exception as e:
        print(f"Error during face recognition: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
