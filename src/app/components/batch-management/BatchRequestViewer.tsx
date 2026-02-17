// Batch Request Viewer Component
// Displays transfer and handover requests with approval actions

import { useState } from 'react';
import { X, ArrowLeftRight, UserCog, CheckCircle, XCircle, Clock } from 'lucide-react';
import { BatchAPI } from '../../types/batch-api';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

interface Request {
  id: string;
  type: 'transfer' | 'handover';
  sourceBatchId?: string;
  sourceBatchName?: string;
  destinationBatchId?: string;
  destinationBatchName?: string;
  currentTrainer?: string;
  newTrainer?: string;
  studentsInvolved: string[];
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  requestedBy: string;
  requestedDate: string;
  expiryDate: string;
}

interface BatchRequestViewerProps {
  isOpen: boolean;
  onClose: () => void;
  batch: BatchAPI;
  requestType: 'transfer' | 'handover';
  onApprove: (requestId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
}

export function BatchRequestViewer({
  isOpen,
  onClose,
  batch,
  requestType,
  onApprove,
  onReject
}: BatchRequestViewerProps) {
  const [loading, setLoading] = useState(false);
  
  // Mock requests data
  const mockRequests: Request[] = [
    {
      id: 'REQ-001',
      type: 'transfer',
      sourceBatchId: 'D02AI',
      sourceBatchName: 'Azure Data Engineering - Morning Batch',
      destinationBatchId: 'D02AF',
      destinationBatchName: 'Azure Data Engineering - Evening Batch',
      studentsInvolved: ['Lakshmi A', 'Balaji Krishnamoorthy'],
      status: 'pending',
      requestedBy: 'Elakiya V',
      requestedDate: '2026-02-10T09:30:00Z',
      expiryDate: '2026-02-17T23:59:59Z'
    },
    {
      id: 'REQ-002',
      type: 'handover',
      sourceBatchId: 'C02AU',
      sourceBatchName: 'AWS & DevOps - Weekday Batch',
      currentTrainer: 'Harsha Priyadharshini',
      newTrainer: 'Yogeshwaran Rajapandian',
      studentsInvolved: ['Jagath B', 'Mullaivendhan Saravanan', 'Balaji Nag'],
      status: 'pending',
      requestedBy: 'Admin',
      requestedDate: '2026-02-11T14:15:00Z',
      expiryDate: '2026-02-18T23:59:59Z'
    },
    {
      id: 'REQ-003',
      type: 'transfer',
      sourceBatchId: 'C02AT',
      sourceBatchName: 'AWS & DevOps - Fast Track',
      destinationBatchId: 'C02AU',
      destinationBatchName: 'AWS & DevOps - Regular',
      studentsInvolved: ['Visvakumar Sreekumar'],
      status: 'approved',
      requestedBy: 'Harsha',
      requestedDate: '2026-02-08T11:20:00Z',
      expiryDate: '2026-02-15T23:59:59Z'
    }
  ];

  const filteredRequests = mockRequests.filter(r => r.type === requestType);

  const handleApprove = async (requestId: string) => {
    setLoading(true);
    try {
      await onApprove(requestId);
      toast.success(`Request ${requestId} approved successfully`);
    } catch (error) {
      toast.error('Failed to approve request');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (requestId: string) => {
    setLoading(true);
    try {
      await onReject(requestId);
      toast.success(`Request ${requestId} rejected`);
    } catch (error) {
      toast.error('Failed to reject request');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
      approved: 'bg-green-100 text-green-700 border border-green-300',
      rejected: 'bg-red-100 text-red-700 border border-red-300',
      expired: 'bg-gray-100 text-gray-700 border border-gray-300'
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const hoursUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilExpiry < 24 && hoursUntilExpiry > 0;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              requestType === 'transfer' ? 'bg-purple-100' : 'bg-orange-100'
            }`}>
              {requestType === 'transfer' ? (
                <ArrowLeftRight className={requestType === 'transfer' ? 'text-purple-600' : 'text-orange-600'} size={20} />
              ) : (
                <UserCog className="text-orange-600" size={20} />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {requestType === 'transfer' ? 'Transfer Requests' : 'Handover Requests'}
              </h2>
              <p className="text-sm text-gray-600">
                Batch: {batch.batch_id}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              {requestType === 'transfer' ? (
                <ArrowLeftRight size={64} className="text-gray-300 mb-4" />
              ) : (
                <UserCog size={64} className="text-gray-300 mb-4" />
              )}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No {requestType} requests
              </h3>
              <p className="text-sm text-gray-600">
                There are no pending {requestType} requests for this batch
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map(request => (
                <div
                  key={request.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                  {/* Request Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-gray-700 text-white border-0 font-semibold">
                        {request.id}
                      </Badge>
                      <Badge className={getStatusBadge(request.status)}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                      {isExpiringSoon(request.expiryDate) && request.status === 'pending' && (
                        <Badge className="bg-orange-100 text-orange-700 border border-orange-300 flex items-center gap-1">
                          <Clock size={12} />
                          Expires Soon
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {requestType === 'transfer' ? (
                      <>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Source Batch</p>
                          <p className="font-medium text-gray-900">{request.sourceBatchId}</p>
                          <p className="text-sm text-gray-600">{request.sourceBatchName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Destination Batch</p>
                          <p className="font-medium text-gray-900">{request.destinationBatchId}</p>
                          <p className="text-sm text-gray-600">{request.destinationBatchName}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Current Trainer</p>
                          <p className="font-medium text-gray-900">{request.currentTrainer}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">New Trainer</p>
                          <p className="font-medium text-orange-600">{request.newTrainer}</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Students Involved */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-2">
                      Students Involved ({request.studentsInvolved.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {request.studentsInvolved.map((student, idx) => (
                        <Badge key={idx} className="bg-blue-50 text-blue-700 border border-blue-200">
                          {student}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Request Metadata */}
                  <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <span>Requested by: <span className="font-medium text-gray-900">{request.requestedBy}</span></span>
                      <span>Date: {formatDate(request.requestedDate)}</span>
                    </div>
                    <div>
                      <span className="text-xs">Expires: {formatDate(request.expiryDate)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {request.status === 'pending' && (
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                      <Button
                        onClick={() => handleApprove(request.id)}
                        disabled={loading}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
                      >
                        <CheckCircle size={16} />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(request.id)}
                        disabled={loading}
                        variant="outline"
                        className="flex-1 border-red-300 text-red-700 hover:bg-red-50 gap-2"
                      >
                        <XCircle size={16} />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end">
          <Button variant="outline" onClick={onClose} className="px-6">
            Close
          </Button>
        </div>
      </div>
    </>
  );
}
