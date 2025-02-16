import React from 'react';
import { useStore } from '../store';
import RequestList from './RequestList';
import { FileText, UserCheck, UserX, Forward } from 'lucide-react';

export default function StaffDashboard() {
  const [user, requests] = useStore((state) => [state.user, state.requests]);
  const updateRequest = useStore((state) => state.updateRequest);

  // const handleAction = (requestId: string, action: 'approve' | 'reject' | 'forward') => {
  //   const request = requests.find((r) => r.id === requestId);
  //   if (!request) return;

  //   if (action === 'forward') {
  //     const nextLevel =
  //       request.currentLevel === 'caretaker'
  //         ? 'warden'
  //         : request.currentLevel === 'warden'
  //         ? 'dean'
  //         : request.currentLevel;
      
  //     updateRequest(requestId, {
  //       status: 'forwarded',
  //       currentLevel: nextLevel,
  //       updatedAt: new Date().toISOString(),
  //     });
  //   } else {
  //     updateRequest(requestId, {
  //       status: action === 'approve' ? 'approved' : 'rejected',
  //       approvedBy: user?.name,
  //       updatedAt: new Date().toISOString(),
  //     });
  //   }
  // };
  const handleAction = (requestId: string, action: 'approve' | 'reject' | 'forward') => {
    const request = requests.find((r) => r.id === requestId);
    if (!request) return;
  
    if (action === 'forward') {
      const nextLevel =
        request.currentLevel === 'caretaker'
          ? 'warden'
          : request.currentLevel === 'warden'
          ? 'dean'
          : request.currentLevel;
      
      updateRequest(requestId, {
        status: 'pending', // Reset status to pending when forwarded
        currentLevel: nextLevel,
        updatedAt: new Date().toISOString(),
      });
    } else {
      updateRequest(requestId, {
        status: action === 'approve' ? 'approved' : 'rejected',
        approvedBy: user?.name,
        updatedAt: new Date().toISOString(),
      });
    }
  };
  

  const filteredRequests = requests.filter((request) => {
    if (user?.role === 'caretaker') {
      return request.currentLevel === 'caretaker';
    }
    if (user?.role === 'warden') {
      return request.currentLevel === 'warden';
    }
    if (user?.role === 'dean') {
      return request.currentLevel === 'dean';
    }
    return false;
  });

  const stats = {
    total: filteredRequests.length,
    pending: filteredRequests.filter((r) => r.status === 'pending').length,
    approved: filteredRequests.filter((r) => r.status === 'approved').length,
    rejected: filteredRequests.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Staff'} Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-semibold">{stats.pending}</p>
              </div>
              <Forward className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-semibold">{stats.approved}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-semibold">{stats.rejected}</p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <RequestList
          requests={filteredRequests}
          isStaff
          onApprove={(id) => handleAction(id, 'approve')}
          onReject={(id) => handleAction(id, 'reject')}
          onForward={(id) => handleAction(id, 'forward')}
          staffRole={user?.role}
        />
      </div>
    </div>
  );
}