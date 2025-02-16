
import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera, Upload, Clock } from 'lucide-react';
import { useStore } from '../store';
import LeaveForm from './LeaveForm';
import RequestList from './RequestList';

export default function StudentDashboard() {
  const [showCamera, setShowCamera] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isFaceVerified, setIsFaceVerified] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const user = useStore((state) => state.user);
  const requests = useStore((state) => state.requests);

  // Handle face capture and verification
  const handleCapture = async () => {
    if (webcamRef.current) {
      try {
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) {
          alert("Failed to capture image. Please try again.");
          return;
        }
  
        const blob = await fetch(imageSrc).then((res) => res.blob());
        const formData = new FormData();
        formData.append("file", blob, "face.jpg");
  
        const response = await fetch("http://127.0.0.1:5000/recognize/", {
          method: "POST",
          body: formData,
        });
  
        const data = await response.json();
        console.log("Recognition result:", data);
  
        if (!response.ok) {
          throw new Error(data.error || 'Face verification failed');
        }
  
        // More lenient confidence threshold (0.4 instead of 0.6)
        if (data.name === user?.id && data.confidence > 0.4) {
          alert(`Face verified successfully! (${(data.confidence * 100).toFixed(1)}% confidence)`);
          setIsFaceVerified(true);
          setShowCamera(false);
        } else if (data.name !== user?.id) {
          alert("Face does not match registered user. Please try again.");
          setIsFaceVerified(false);
        } else {
          alert("Confidence too low. Please try again in better lighting.");
          setIsFaceVerified(false);
        }
      } catch (error) {
        console.error("Error during face verification:", error);
        alert(error instanceof Error ? error.message : 'Face verification failed');
        setIsFaceVerified(false);
      }
    }
  };
  
  
  const studentRequests = requests.filter((req) => req.studentId === user?.id);
  const hasPendingRequest = studentRequests.some(
    (req) => req.status === 'pending' || req.status === 'forwarded'
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Student Dashboard</h2>
          <button
            onClick={() => setShowCamera(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Camera className="h-5 w-5" />
            <span>Verify Face ID</span>
          </button>
        </div>

        {showCamera && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="rounded-lg"
              />
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => setShowCamera(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCapture}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Capture
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Student Information</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>ID:</strong> {user?.id}</p>
              <p><strong>Branch:</strong> {user?.branch}</p>
              <p><strong>Year:</strong> {user?.year}</p>
              <p><strong>Room:</strong> {user?.hostelRoom}</p>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
            <div className="space-y-4">
              <button
                onClick={() => setShowForm(true)}
                disabled={hasPendingRequest || !isFaceVerified}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md ${
                  hasPendingRequest || !isFaceVerified
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Clock className="h-5 w-5" />
                <span>New Leave Request</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                <Upload className="h-5 w-5" />
                <span>Upload Documents</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showForm && isFaceVerified && (
        <LeaveForm onClose={() => setShowForm(false)} />
      )}

      <RequestList requests={studentRequests} />
    </div>
  );
}
