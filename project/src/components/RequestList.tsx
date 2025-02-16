import React from 'react';
import { format } from 'date-fns';
import { Download, CheckCircle, XCircle, Forward } from 'lucide-react';
import { LeaveRequest } from '../types';

interface RequestListProps {
  requests: LeaveRequest[];
  isStaff?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onForward?: (id: string) => void;
  staffRole?: string;
}

export default function RequestList({
  requests,
  isStaff,
  onApprove,
  onReject,
  onForward,
  staffRole,
}: RequestListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Rejected
          </span>
        );
      case 'forwarded':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Forwarded
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            Pending
          </span>
        );
    }
  };

  const handleDownload = (request: LeaveRequest) => {
    const content = [
      'RAJIV GANDHI UNIVERSITY OF KNOWLEDGE TECHNOLOGIES',
      'LEAVE APPLICATION FORM',
      '',
      'Student Details:',
      `Name: ${request.studentName}`,
      `ID: ${request.studentId}`,
      `Branch: ${request.branch}`,
      `Year: ${request.year}`,
      `Hostel Room: ${request.hostelRoom}`,
      `Phone: ${request.phoneNumber}`,
      '',
      'Leave Details:',
      `Out Time: ${format(new Date(request.outTime), 'PPpp')}`,
      `In Time: ${format(new Date(request.inTime), 'PPpp')}`,
      `Reason: ${request.reason}`,
      '',
      `Status: ${request.status.toUpperCase()}`,
      request.approvedBy ? `Approved By: ${request.approvedBy}` : '',
      '',
      `Generated on: ${format(new Date(), 'PPpp')}`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leave-application-${request.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium text-gray-900">Leave Requests</h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {requests.map((request) => (
            <li key={request.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">
                      {request.studentName}
                    </p>
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Out Time</p>
                      <p className="text-sm font-medium">
                        {format(new Date(request.outTime), 'PPpp')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">In Time</p>
                      <p className="text-sm font-medium">
                        {format(new Date(request.inTime), 'PPpp')}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{request.reason}</p>
                </div>
                <div className="flex items-center space-x-4 ml-4">
                  {request.status === 'approved' && (
                    <button
                      onClick={() => handleDownload(request)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  )}
                  {isStaff && request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onApprove?.(request.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onReject?.(request.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                      {staffRole !== 'dean' && (
                        <button
                          onClick={() => onForward?.(request.id)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          <Forward className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
          {requests.length === 0 && (
            <li className="p-4">
              <p className="text-center text-gray-500">No requests found</p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}