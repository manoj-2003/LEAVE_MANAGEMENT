// import React, { useState, useRef } from 'react';
// import Webcam from 'react-webcam';
// import { Camera, Upload, Clock } from 'lucide-react';
// import { useStore } from '../store';
// import LeaveForm from './LeaveForm';
// import RequestList from './RequestList';

// export default function StudentDashboard() {
//   const [showCamera, setShowCamera] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const webcamRef = useRef<Webcam>(null);
//   const user = useStore((state) => state.user);
//   const requests = useStore((state) => state.requests);

//   .
// const handleCapture = async () => {
//   if (webcamRef.current) {
//     const imageSrc = webcamRef.current.getScreenshot();
//     if (imageSrc) {
//       const blob = await fetch(imageSrc).then((res) => res.blob());
//       const formData = new FormData();
//       formData.append("file", blob, "face.jpg");

//       try {
//         const response = await fetch("http://127.0.0.1:8000/recognize/", {
//           method: "POST",
//           body: formData,
//         });
//         const data = await response.json();
//         console.log("Recognized Name:", data.name);
//         alert(`Recognized as: ${data.name}`);
//       } catch (error) {
//         console.error("Error recognizing face:", error);
//       }
//     } else {
//       console.error("No image captured");
//     }
//   }
// };
// // ...existing code...
  

//   const studentRequests = requests.filter((req) => req.studentId === user?.id);
//   const hasPendingRequest = studentRequests.some(
//     (req) => req.status === 'pending' || req.status === 'forwarded'
//   );

//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold text-gray-900">Student Dashboard</h2>
//           <button
//             onClick={() => setShowCamera(true)}
//             className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             <Camera className="h-5 w-5" />
//             <span>Verify Face ID</span>
//           </button>
//         </div>

//         {showCamera && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-xl">
//               <Webcam
//                 ref={webcamRef}
//                 screenshotFormat="image/jpeg"
//                 className="rounded-lg"
//               />
//               <div className="mt-4 flex justify-end space-x-4">
//                 <button
//                   onClick={() => setShowCamera(false)}
//                   className="px-4 py-2 text-gray-600 hover:text-gray-800"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleCapture}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                 >
//                   Capture
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-blue-50 p-6 rounded-lg">
//             <h3 className="text-lg font-semibold mb-2">Student Information</h3>
//             <div className="space-y-2">
//               <p><strong>Name:</strong> {user?.name}</p>
//               <p><strong>ID:</strong> {user?.id}</p>
//               <p><strong>Branch:</strong> {user?.branch}</p>
//               <p><strong>Year:</strong> {user?.year}</p>
//               <p><strong>Room:</strong> {user?.hostelRoom}</p>
//             </div>
//           </div>
          
//           <div className="bg-green-50 p-6 rounded-lg">
//             <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
//             <div className="space-y-4">
//               <button
//                 onClick={() => setShowForm(true)}
//                 disabled={hasPendingRequest}
//                 className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md ${
//                   hasPendingRequest
//                     ? 'bg-gray-300 cursor-not-allowed'
//                     : 'bg-blue-600 hover:bg-blue-700 text-white'
//                 }`}
//               >
//                 <Clock className="h-5 w-5" />
//                 <span>New Leave Request</span>
//               </button>
//               <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
//                 <Upload className="h-5 w-5" />
//                 <span>Upload Documents</span>
//               </button>
//             </div>
//           </div>

//           <div className="bg-purple-50 p-6 rounded-lg">
//             <h3 className="text-lg font-semibold mb-2">Request Status</h3>
//             <div className="space-y-2">
//               <p><strong>Total Requests:</strong> {studentRequests.length}</p>
//               <p>
//                 <strong>Pending:</strong>{' '}
//                 {studentRequests.filter((r) => r.status === 'pending').length}
//               </p>
//               <p>
//                 <strong>Approved:</strong>{' '}
//                 {studentRequests.filter((r) => r.status === 'approved').length}
//               </p>
//               <p>
//                 <strong>Rejected:</strong>{' '}
//                 {studentRequests.filter((r) => r.status === 'rejected').length}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showForm && (
//         <LeaveForm onClose={() => setShowForm(false)} />
//       )}

//       <RequestList requests={studentRequests} />
//     </div>
//   );
// }

// import React, { useState, useRef } from 'react';
// import Webcam from 'react-webcam';
// import { Camera, Upload, Clock } from 'lucide-react';
// import { useStore } from '../store';
// import LeaveForm from './LeaveForm';
// import RequestList from './RequestList';

// export default function StudentDashboard() {
//   const [showCamera, setShowCamera] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [isFaceVerified, setIsFaceVerified] = useState(false); // Track face verification status
//   const webcamRef = useRef<Webcam>(null);
//   const user = useStore((state) => state.user);
//   const requests = useStore((state) => state.requests);

//   // Handle face capture and verification
//   const handleCapture = async () => {
//     if (webcamRef.current) {
//       const imageSrc = webcamRef.current.getScreenshot();
//       if (imageSrc) {
//         const blob = await fetch(imageSrc).then((res) => res.blob());
//         const formData = new FormData();
//         formData.append("file", blob, "face.jpg");
  
//         try {
//           const response = await fetch("http://127.0.0.1:5000/recognize/", {
//             method: "POST",
//             body: formData,
//           });
  
//           if (!response.ok) {
//             throw new Error('Failed to communicate with the server');
//           }
  
//           const data = await response.json();
//           console.log("Recognized Name:", data.name);
  
//           if (data.name === user?.id) {
//             alert("Face verified! You can now apply for a leave request.");
//             setIsFaceVerified(true); // Set to true if the face matches the user ID
//           } else {
//             alert("Face not recognized. Please try again.");
//             setIsFaceVerified(false); // Set to false if face does not match
//           }
//         } catch (error) {
//           console.error("Error recognizing face:", error);
//           if (error instanceof Error) {
//             alert(`There was an error with face recognition. ${error.message}`);
//           } else {
//             alert('There was an unknown error with face recognition.');
//           }
//         }
//       } else {
//         console.error("No image captured");
//         alert("No image captured. Please try again.");
//       }
//     }
//   };
  

//   const studentRequests = requests.filter((req) => req.studentId === user?.id);
//   const hasPendingRequest = studentRequests.some(
//     (req) => req.status === 'pending' || req.status === 'forwarded'
//   );

//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold text-gray-900">Student Dashboard</h2>
//           <button
//             onClick={() => setShowCamera(true)}
//             className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             <Camera className="h-5 w-5" />
//             <span>Verify Face ID</span>
//           </button>
//         </div>

//         {showCamera && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-xl">
//               <Webcam
//                 ref={webcamRef}
//                 screenshotFormat="image/jpeg"
//                 className="rounded-lg"
//               />
//               <div className="mt-4 flex justify-end space-x-4">
//                 <button
//                   onClick={() => setShowCamera(false)}
//                   className="px-4 py-2 text-gray-600 hover:text-gray-800"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleCapture}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                 >
//                   Capture
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-blue-50 p-6 rounded-lg">
//             <h3 className="text-lg font-semibold mb-2">Student Information</h3>
//             <div className="space-y-2">
//               <p><strong>Name:</strong> {user?.name}</p>
//               <p><strong>ID:</strong> {user?.id}</p>
//               <p><strong>Branch:</strong> {user?.branch}</p>
//               <p><strong>Year:</strong> {user?.year}</p>
//               <p><strong>Room:</strong> {user?.hostelRoom}</p>
//             </div>
//           </div>
          
//           <div className="bg-green-50 p-6 rounded-lg">
//             <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
//             <div className="space-y-4">
//               <button
//                 onClick={() => setShowForm(true)}
//                 disabled={hasPendingRequest || !isFaceVerified}  // Disable form if face is not verified
//                 className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md ${
//                   hasPendingRequest || !isFaceVerified
//                     ? 'bg-gray-300 cursor-not-allowed'
//                     : 'bg-blue-600 hover:bg-blue-700 text-white'
//                 }`}
//               >
//                 <Clock className="h-5 w-5" />
//                 <span>New Leave Request</span>
//               </button>
//               <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
//                 <Upload className="h-5 w-5" />
//                 <span>Upload Documents</span>
//               </button>
//             </div>
//           </div>

//           <div className="bg-purple-50 p-6 rounded-lg">
//             <h3 className="text-lg font-semibold mb-2">Request Status</h3>
//             <div className="space-y-2">
//               <p><strong>Total Requests:</strong> {studentRequests.length}</p>
//               <p>
//                 <strong>Pending:</strong>{' '}
//                 {studentRequests.filter((r) => r.status === 'pending').length}
//               </p>
//               <p>
//                 <strong>Approved:</strong>{' '}
//                 {studentRequests.filter((r) => r.status === 'approved').length}
//               </p>
//               <p>
//                 <strong>Rejected:</strong>{' '}
//                 {studentRequests.filter((r) => r.status === 'rejected').length}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showForm && isFaceVerified && (
//         <LeaveForm onClose={() => setShowForm(false)} />
//       )}

//       <RequestList requests={studentRequests} />
//     </div>
//   );
// }
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
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const blob = await fetch(imageSrc).then((res) => res.blob());
        const formData = new FormData();
        formData.append("file", blob, "face.jpg");
  
        try {
          const response = await fetch("http://127.0.0.1:5000/recognize/", {
            method: "POST",
            body: formData,
          });
  
          if (!response.ok) {
            throw new Error('Failed to communicate with the server');
          }
  
          const data = await response.json();
          console.log("Recognized Name:", data.name);
          console.log("Logged-in User ID:", user?.id);
  
          // Ensure that the recognized face matches the logged-in user's ID
          if (data.name === user?.id) {
            alert("Face verified! You can now apply for a leave request.");
            setIsFaceVerified(true);
          } else {
            alert("Face not matching! You are not permitted to apply for leave.");
            setIsFaceVerified(false);
          }
        } catch (error) {
          console.error("Error recognizing face:", error);
          alert('There was an error with face recognition. Please try again.');
        }
      } else {
        alert("No image captured. Please try again.");
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
