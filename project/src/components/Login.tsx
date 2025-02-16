import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import { useStore } from '../store';
import rgukt from "../assets/rgukt.jpeg";

export default function Login() {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  const [role, setRole] = useState<'student' | 'caretaker' | 'warden' | 'dean'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // User details object structure
    let userDetails: {
      id: string;
      name: string;
      role: 'student' | 'caretaker' | 'warden' | 'dean';
      department: string;
      year: number;
      branch: string;
      hostelRoom: string;
      phoneNumber: string;
    } | undefined;

    // Users object with different email and roles
    const users: { [key: string]: typeof userDetails } = {
      'n191043@rguktn.ac.in': {
        id: 'N191043',
        name: 'Anji Kumar Narukula',
        role: 'student',
        department: 'EEE',
        year: 2,
        branch: 'Electrical Engineering ',
        hostelRoom: 'A-101',
        phoneNumber: '9090456789',
      },
      'n190974@rguktn.ac.in': {
        id: 'N190974',
        name: 'Dampi Hari Babu',
        role: 'student',
        department: 'CSE',
        year: 4,
        branch: 'Computer Science',
        hostelRoom: 'A-101',
        phoneNumber: '9090456789',
      },
      'n190004@rguktn.ac.in': {
        id: 'N190004',
        name: 'Basava Gnaneshwar',
        role: 'student',
        department: 'ECE',
        year: 4,
        branch: 'Electronics',
        hostelRoom: 'GF-32',
        phoneNumber: '1234567890',
      },

      'manoj@example.com': {
        id: 'N190050',
        name: 'Manoj Nandyala',
        role: 'student',
        department: 'ECE',
        year: 3,
        branch: 'Electronics',
        hostelRoom: 'B-202',
        phoneNumber: '9876543210',
      },
      'alex.johnson@example.com': {
        id: '3',
        name: 'Alex Johnson',
        role: 'student',
        department: 'ME',
        year: 1,
        branch: 'Mechanical',
        hostelRoom: 'C-303',
        phoneNumber: '1122334455',
      },
      // Caretakers
      'n191130@rguktn.ac.in': {
        id: 'N191130',
        name: 'Prabhudas Verma',
        role: 'student',
        department: 'N/A',
        year: 0,
        branch: 'N/A',
        hostelRoom: 'N/A',
        phoneNumber: '2233445566',
      },
      'anita.caretaker@example.com': {
        id: '5',
        name: 'Anita Desai',
        role: 'caretaker',
        department: 'N/A',
        year: 0,
        branch: 'N/A',
        hostelRoom: 'N/A',
        phoneNumber: '5566778899',
      },
      // Wardens
      'surendra@example.com': {
        id: '6',
        name: 'Surendra Rao',
        role: 'warden',
        department: 'N/A',
        year: 0,
        branch: 'N/A',
        hostelRoom: 'N/A',
        phoneNumber: '3344556677',
      },
      'raj.warden@example.com': {
        id: '7',
        name: 'Rajesh Sharma',
        role: 'warden',
        department: 'N/A',
        year: 0,
        branch: 'N/A',
        hostelRoom: 'N/A',
        phoneNumber: '6677889900',
      },
      // Deans
      'hari@example.com': {
        id: '8',
        name: 'Hari Mohan',
        role: 'dean',
        department: 'N/A',
        year: 0,
        branch: 'N/A',
        hostelRoom: 'N/A',
        phoneNumber: '4455667788',
      },
      'vijay@example.com': {
        id: '9',
        name: 'Vijay Singh',
        role: 'dean',
        department: 'N/A',
        year: 0,
        branch: 'N/A',
        hostelRoom: 'N/A',
        phoneNumber: '7788990011',
      },
    };

    // Retrieve user details based on email
    userDetails = users[email as keyof typeof users];

    // Validate user credentials
    if (!userDetails || password !== 'password123' || userDetails.role !== role) {
      return alert('Invalid email or password or role mismatch');
    }

    // Login successful
    setUser(userDetails);  // Ensure the correct user object is set
    console.log("Logged-in User:", userDetails);
    navigate('/');
    
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
        <img
  src={rgukt}
  alt="RGUKT Logo"
  className="h-20 mx-auto mb-4"
/>
          <h2 className="text-3xl font-bold text-gray-900">
            RGUKT Leave Management System
          </h2>
        </div>
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="student">Student</option>
                <option value="caretaker">Caretaker</option>
                <option value="warden">Warden</option>
                <option value="dean">Dean</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}