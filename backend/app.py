from flask import Flask, request, jsonify
import face_recognition
import os
import cv2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Path to known faces
KNOWN_FACES_DIR = "/home/rgukt/Documents/personals/scratch project/COLLEGE_LEAVE_MANAGEMENT_SYSTEM (1)/project-bolt-sb1-pmbpm6/backend/images"

# Load known faces
def load_known_faces():
    known_faces = []
    for filename in os.listdir(KNOWN_FACES_DIR):
        if filename.endswith(('.jpg', '.jpeg', '.png')):
            image_path = os.path.join(KNOWN_FACES_DIR, filename)
            image = face_recognition.load_image_file(image_path)
            face_encodings = face_recognition.face_encodings(image)

            if face_encodings:
                known_faces.append({
                    'name': filename.split('.')[0],  # Use filename as the label
                    'encoding': face_encodings[0]
                })
    return known_faces

known_faces = load_known_faces()

@app.route('/recognize/', methods=['POST'])
def recognize_face():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    image = face_recognition.load_image_file(file)

    face_encodings = face_recognition.face_encodings(image)
    if not face_encodings:
        return jsonify({"error": "No face found"}), 400
    
    for face_encoding in face_encodings:
        matches = face_recognition.compare_faces(
            [known_face['encoding'] for known_face in known_faces], face_encoding)
        if True in matches:
            matched_idx = matches.index(True)
            return jsonify({"name": known_faces[matched_idx]['name']}), 200

    return jsonify({"error": "Face not recognized"}), 400

if __name__ == '__main__':
    app.run(debug=True)
