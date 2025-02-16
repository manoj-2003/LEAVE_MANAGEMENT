# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import face_recognition
# import numpy as np
# import os
# import cv2
# from PIL import Image
# import io

# app = Flask(__name__)
# CORS(app)

# # Path to known faces
# KNOWN_FACES_DIR = "/home/rgukt/Documents/personals/scratch project/COLLEGE_LEAVE_MANAGEMENT_SYSTEM (1)/project-bolt-sb1-pmbpm6/backend/images"

# def load_known_faces():
#     known_faces = {}  # Using dictionary for better lookup
#     for filename in os.listdir(KNOWN_FACES_DIR):
#         if filename.endswith(('.jpg', '.jpeg', '.png')):
#             try:
#                 # Get student ID from filename
#                 student_id = filename.split('.')[0]
#                 image_path = os.path.join(KNOWN_FACES_DIR, filename)
                
#                 # Load and process image
#                 image = face_recognition.load_image_file(image_path)
#                 face_locations = face_recognition.face_locations(image, model="hog")
                
#                 if face_locations:
#                     # Get encoding for the first detected face
#                     face_encoding = face_recognition.face_encodings(image, face_locations)[0]
#                     known_faces[student_id] = {
#                         'encoding': face_encoding,
#                         'locations': face_locations[0]
#                     }
#                     print(f"Successfully loaded face encoding for student {student_id}")
#                 else:
#                     print(f"No face detected in image for student {student_id}")
            
#             except Exception as e:
#                 print(f"Error processing {filename}: {str(e)}")
#                 continue
    
#     print(f"Loaded {len(known_faces)} face encodings")
#     return known_faces

# # Load known faces at startup
# known_faces = load_known_faces()

# @app.route('/recognize/', methods=['POST'])
# def recognize_face():
#     if 'file' not in request.files:
#         return jsonify({"error": "No file provided"}), 400
    
#     try:
#         file = request.files['file']
        
#         # Read image file
#         image_bytes = file.read()
#         image = face_recognition.load_image_file(io.BytesIO(image_bytes))
        
#         # Detect faces in the image
#         face_locations = face_recognition.face_locations(image, model="hog")
        
#         if not face_locations:
#             return jsonify({"error": "No face detected in the image"}), 400
        
#         # Get encodings for detected faces
#         face_encodings = face_recognition.face_encodings(image, face_locations)
        
#         if not face_encodings:
#             return jsonify({"error": "Could not encode detected face"}), 400
        
#         # Compare with known faces using a lower tolerance for stricter matching
#         best_match = None
#         best_distance = float('inf')
        
#         for student_id, known_face in known_faces.items():
#             # Calculate face distance
#             face_distances = face_recognition.face_distance([known_face['encoding']], face_encodings[0])
#             distance = face_distances[0]
            
#             # Update best match if this is the closest match so far
#             if distance < best_distance and distance < 0.5:  # Adjust threshold as needed
#                 best_distance = distance
#                 best_match = student_id
        
#         if best_match:
#             return jsonify({
#                 "name": best_match,
#                 "confidence": float(1 - best_distance)
#             }), 200
#         else:
#             return jsonify({"error": "No matching face found"}), 400
            
#     except Exception as e:
#         print(f"Error during face recognition: {str(e)}")
#         return jsonify({"error": "Face recognition failed"}), 500

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
import face_recognition
import numpy as np
import os
import cv2
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Path to known faces
KNOWN_FACES_DIR = "/home/rgukt/Documents/personals/scratch project/COLLEGE_LEAVE_MANAGEMENT_SYSTEM (1)/project-bolt-sb1-pmbpm6/backend/images"

def load_known_faces():
    known_faces = {}
    print("Loading known faces from:", KNOWN_FACES_DIR)  # Debug print
    
    for filename in os.listdir(KNOWN_FACES_DIR):
        if filename.endswith(('.jpg', '.jpeg', '.png')):
            try:
                student_id = filename.split('.')[0]
                image_path = os.path.join(KNOWN_FACES_DIR, filename)
                print(f"Processing {filename}")  # Debug print
                
                image = face_recognition.load_image_file(image_path)
                # Use a more lenient face detection model
                face_locations = face_recognition.face_locations(image, model="hog", number_of_times_to_upsample=2)
                
                if face_locations:
                    face_encoding = face_recognition.face_encodings(image, face_locations)[0]
                    known_faces[student_id] = face_encoding
                    print(f"Successfully loaded face encoding for {student_id}")
                else:
                    print(f"No face detected in {filename}")
            except Exception as e:
                print(f"Error processing {filename}: {str(e)}")
    
    return known_faces

known_faces = load_known_faces()

@app.route('/recognize/', methods=['POST'])
def recognize_face():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files['file']
        # Read image file
        image_bytes = file.read()
        
        # Convert to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Convert BGR to RGB
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Detect faces with more lenient parameters
        face_locations = face_recognition.face_locations(rgb_image, model="hog", number_of_times_to_upsample=2)
        
        if not face_locations:
            return jsonify({"error": "No face detected in image"}), 400
            
        face_encodings = face_recognition.face_encodings(rgb_image, face_locations)
        
        if not face_encodings:
            return jsonify({"error": "Could not encode face"}), 400
            
        best_match = None
        best_confidence = 0
        
        # Compare with known faces using a more lenient threshold
        for student_id, known_encoding in known_faces.items():
            # Calculate face distance
            face_distance = face_recognition.face_distance([known_encoding], face_encodings[0])[0]
            # Convert distance to confidence score
            confidence = 1 - face_distance
            
            if confidence > best_confidence and confidence > 0.4:  # More lenient threshold
                best_confidence = confidence
                best_match = student_id
        
        if best_match:
            return jsonify({
                "name": best_match,
                "confidence": float(best_confidence)
            }), 200
        else:
            return jsonify({"error": "No matching face found"}), 400
            
    except Exception as e:
        print(f"Error in face recognition: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)