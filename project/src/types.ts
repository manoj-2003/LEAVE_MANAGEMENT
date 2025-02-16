export interface User {
  id: string;
  name: string;
  role: 'student' | 'caretaker' | 'warden' | 'dean';
  department?: string;
  year?: number;
  branch?: string;
  hostelRoom?: string;
  phoneNumber?: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  year: number;
  branch: string;
  hostelRoom: string;
  phoneNumber: string;
  reason: string;
  outTime: string;
  inTime: string;
  status: 'pending' | 'approved' | 'rejected' | 'forwarded';
  currentLevel: 'caretaker' | 'warden' | 'dean';
  attachments?: string[];
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}