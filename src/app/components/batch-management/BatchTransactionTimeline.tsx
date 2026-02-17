// Batch Transaction Timeline Component
// Audit interface showing batch lifecycle actions

import { useState } from 'react';
import { X, Clock, User, Filter, Calendar } from 'lucide-react';
import { BatchAPI } from '../../types/batch-api';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';

interface Transaction {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  actionType: 'create' | 'update' | 'delete' | 'enroll' | 'transfer' | 'handover' | 'status_change';
  details: string;
  metadata?: Record<string, any>;
}

interface BatchTransactionTimelineProps {
  isOpen: boolean;
  onClose: () => void;
  batch: BatchAPI;
}

export function BatchTransactionTimeline({
  isOpen,
  onClose,
  batch
}: BatchTransactionTimelineProps) {
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('all');
  const [actorFilter, setActorFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Mock transaction data
  const mockTransactions: Transaction[] = [
    {
      id: 'TXN-001',
      timestamp: '2026-02-13T09:43:00Z',
      actor: 'Elakiya V',
      action: 'Updated batch schedule',
      actionType: 'update',
      details: 'Modified time slot from 09:00-10:00 to 10:00-11:00',
      metadata: { field: 'time_slot', oldValue: '09:00-10:00', newValue: '10:00-11:00' }
    },
    {
      id: 'TXN-002',
      timestamp: '2026-02-12T14:30:00Z',
      actor: 'Harsha',
      action: 'Enrolled 3 students',
      actionType: 'enroll',
      details: 'Added Lakshmi A, Balaji Krishnamoorthy, Moharaj El to batch',
      metadata: { studentCount: 3 }
    },
    {
      id: 'TXN-003',
      timestamp: '2026-02-10T11:15:00Z',
      actor: 'Admin',
      action: 'Changed batch status',
      actionType: 'status_change',
      details: 'Status changed from Scheduled to In Progress',
      metadata: { oldStatus: 'scheduled', newStatus: 'active' }
    },
    {
      id: 'TXN-004',
      timestamp: '2026-02-08T16:20:00Z',
      actor: 'Elakiya V',
      action: 'Updated trainer assignment',
      actionType: 'handover',
      details: 'Trainer changed from Gokul Gururaj R to Yogeshwaran Rajapandian',
      metadata: { oldTrainer: 'Gokul Gururaj R', newTrainer: 'Yogeshwaran Rajapandian' }
    },
    {
      id: 'TXN-005',
      timestamp: '2026-02-01T10:00:00Z',
      actor: 'Admin',
      action: 'Created batch',
      actionType: 'create',
      details: 'Batch D02AI created for Azure Data Engineering course',
      metadata: { courseId: 'course-3', batchType: 'WD' }
    }
  ];

  const filteredTransactions = mockTransactions.filter(txn => {
    const matchesActionType = actionTypeFilter === 'all' || txn.actionType === actionTypeFilter;
    const matchesActor = actorFilter === 'all' || txn.actor === actorFilter;
    
    let matchesDate = true;
    if (dateFrom) {
      matchesDate = matchesDate && new Date(txn.timestamp) >= new Date(dateFrom);
    }
    if (dateTo) {
      matchesDate = matchesDate && new Date(txn.timestamp) <= new Date(dateTo);
    }
    
    return matchesActionType && matchesActor && matchesDate;
  });

  const uniqueActors = Array.from(new Set(mockTransactions.map(t => t.actor)));

  const getActionIcon = (actionType: string) => {
    const icons = {
      create: '🎉',
      update: '✏️',
      delete: '🗑️',
      enroll: '👥',
      transfer: '↔️',
      handover: '🤝',
      status_change: '🔄'
    };
    return icons[actionType as keyof typeof icons] || '📝';
  };

  const getActionColor = (actionType: string) => {
    const colors = {
      create: 'bg-green-100 text-green-700 border-green-300',
      update: 'bg-blue-100 text-blue-700 border-blue-300',
      delete: 'bg-red-100 text-red-700 border-red-300',
      enroll: 'bg-purple-100 text-purple-700 border-purple-300',
      transfer: 'bg-orange-100 text-orange-700 border-orange-300',
      handover: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      status_change: 'bg-indigo-100 text-indigo-700 border-indigo-300'
    };
    return colors[actionType as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Clock className="text-indigo-600" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Transaction Timeline</h2>
              <p className="text-sm text-gray-600">
                Audit log for {batch.batch_id}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Select value={actionTypeFilter} onValueChange={setActionTypeFilter}>
              <SelectTrigger className="bg-white border-gray-300">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="enroll">Enroll</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="handover">Handover</SelectItem>
                <SelectItem value="status_change">Status Change</SelectItem>
              </SelectContent>
            </Select>

            <Select value={actorFilter} onValueChange={setActorFilter}>
              <SelectTrigger className="bg-white border-gray-300">
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {uniqueActors.map(actor => (
                  <SelectItem key={actor} value={actor}>{actor}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="From Date"
              className="bg-white border-gray-300"
            />

            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="To Date"
              className="bg-white border-gray-300"
            />
          </div>

          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-gray-600">
              {filteredTransactions.length} transaction(s) found
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActionTypeFilter('all');
                setActorFilter('all');
                setDateFrom('');
                setDateTo('');
              }}
              className="text-xs"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Clock size={64} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
              <p className="text-sm text-gray-600">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

              {/* Timeline Items */}
              <div className="space-y-6">
                {filteredTransactions.map((txn, idx) => {
                  const timestamp = formatTimestamp(txn.timestamp);
                  return (
                    <div key={txn.id} className="relative pl-16">
                      {/* Timeline Dot */}
                      <div className="absolute left-4 top-2 w-5 h-5 bg-white border-4 border-indigo-600 rounded-full z-10" />

                      {/* Transaction Card */}
                      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getActionIcon(txn.actionType)}</span>
                            <div>
                              <h3 className="font-semibold text-gray-900">{txn.action}</h3>
                              <p className="text-sm text-gray-600">{txn.details}</p>
                            </div>
                          </div>
                          <Badge className={`${getActionColor(txn.actionType)} border`}>
                            {txn.actionType.replace('_', ' ')}
                          </Badge>
                        </div>

                        {/* Metadata */}
                        {txn.metadata && Object.keys(txn.metadata).length > 0 && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Details:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {Object.entries(txn.metadata).map(([key, value]) => (
                                <div key={key}>
                                  <span className="text-gray-600">{key}:</span>{' '}
                                  <span className="font-medium text-gray-900">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User size={14} />
                              <span className="font-medium text-gray-900">{txn.actor}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{timestamp.date}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{timestamp.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
