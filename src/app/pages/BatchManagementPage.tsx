// Enterprise Batch Management Page - Complete with All Actions
// Integrated with all 8 batch action components

import { useState } from 'react';
import { Plus, Search, Download, Calendar, TrendingUp, Users, GraduationCap, Edit2 } from 'lucide-react';
import { BatchAPI } from '../components/types/batch-api';
import { mockBatchesAPI, mockCourseCategories, mockCoursesWithCategory, mockTrainersAPI, mockStudentsAPI } from '../components/data/batch-api-mock';
import { BatchManagementDrawer } from '../components/batch-management/BatchManagementDrawer';
import { BatchActionsDropdown, BatchAction } from '../components/batch-management/BatchActionsDropdown';
import { AddStudentDrawer } from '../components/batch-management/AddStudentDrawer';
import { TransferStudentWizard } from '../components/batch-management/TransferStudentWizard';
import { TrainerHandoverWizard } from '../components/batch-management/TrainerHandoverWizard';
import { BatchRequestViewer } from '../components/batch-management/BatchRequestViewer';
import { BatchStudentViewer } from '../components/batch-management/BatchStudentViewer';
import { BatchTransactionTimeline } from '../components/batch-management/BatchTransactionTimeline';
import { BatchExportModal } from '../components/batch-management/BatchExportModal';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';

type ActionModal = 
  | 'none'
  | 'add-student'
  | 'transfer-students'
  | 'trainer-handover'
  | 'view-transfer-requests'
  | 'view-handover-requests'
  | 'view-students'
  | 'view-transactions'
  | 'export-data';

export function BatchManagementPage() {
  const [batches, setBatches] = useState<BatchAPI[]>(mockBatchesAPI);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedBatch, setSelectedBatch] = useState<BatchAPI | null>(null);
  const [activeModal, setActiveModal] = useState<ActionModal>('none');

  // Filter batches
  const filteredBatches = batches.filter(batch => {
    const matchesSearch = 
      searchQuery === '' ||
      batch.batch_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.course_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.trainer_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
    const matchesMode = modeFilter === 'all' || batch.batch_type === modeFilter;
    
    return matchesSearch && matchesStatus && matchesMode;
  });

  // Statistics
  const stats = {
    total: batches.length,
    active: batches.filter(b => b.status === 'active').length,
    totalStudents: batches.reduce((sum, b) => sum + (b.student_count || 0), 0),
    avgAttendance: 'NaN'
  };

  const handleCreateBatch = () => {
    setDrawerMode('create');
    setSelectedBatch(null);
    setDrawerOpen(true);
  };

  const handleEditBatch = (batch: BatchAPI) => {
    setDrawerMode('edit');
    setSelectedBatch(batch);
    setDrawerOpen(true);
  };

  const handleSaveBatch = async (batch: BatchAPI) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (drawerMode === 'create') {
      setBatches(prev => [...prev, { ...batch, id: `${prev.length + 1}` }]);
      toast.success('Batch created successfully');
    } else {
      setBatches(prev => prev.map(b => b.id === batch.id ? batch : b));
      toast.success('Batch updated successfully');
    }
  };

  const handleAddStudents = async (batchId: string, studentIds: string[]) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setBatches(prev => prev.map(b => 
      b.id === batchId 
        ? { ...b, student_count: (b.student_count || 0) + studentIds.length }
        : b
    ));
  };

  const handleBatchAction = (action: BatchAction, batch: BatchAPI) => {
    setSelectedBatch(batch);
    
    switch (action) {
      case 'add-student':
        setActiveModal('add-student');
        break;
      case 'transfer-students':
        setActiveModal('transfer-students');
        break;
      case 'trainer-handover':
        setActiveModal('trainer-handover');
        break;
      case 'view-transfer-requests':
        setActiveModal('view-transfer-requests');
        break;
      case 'view-handover-requests':
        setActiveModal('view-handover-requests');
        break;
      case 'view-students':
        setActiveModal('view-students');
        break;
      case 'view-transactions':
        setActiveModal('view-transactions');
        break;
      case 'export-data':
        setActiveModal('export-data');
        break;
    }
  };

  const handleTransferStudents = async (sourceBatchId: string, destBatchId: string, studentIds: string[]) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Update batch counts
    setBatches(prev => prev.map(b => {
      if (b.id === sourceBatchId) {
        return { ...b, student_count: (b.student_count || 0) - studentIds.length };
      }
      if (b.id === destBatchId) {
        return { ...b, student_count: (b.student_count || 0) + studentIds.length };
      }
      return b;
    }));
  };

  const handleTrainerHandover = async (batchId: string, newTrainerId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newTrainer = mockTrainersAPI.find(t => t.id === newTrainerId);
    if (newTrainer) {
      setBatches(prev => prev.map(b =>
        b.id === batchId ? { ...b, trainer_id: newTrainerId, trainer_name: newTrainer.name } : b
      ));
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const handleRejectRequest = async (requestId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const handleExport = async (format: 'csv' | 'excel', scope: 'single' | 'all') => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const closeModal = () => {
    setActiveModal('none');
    setSelectedBatch(null);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-700 border border-gray-300',
      'scheduled': 'bg-yellow-100 text-yellow-700 border border-yellow-300',
      'active': 'bg-green-100 text-green-700 border border-green-300',
      'completed': 'bg-purple-100 text-purple-700 border border-purple-300',
      'cancelled': 'bg-red-100 text-red-700 border border-red-300',
      'on-hold': 'bg-orange-100 text-orange-700 border border-orange-300'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'active': 'In Progress',
      'scheduled': 'Yet to Start',
      'draft': 'Draft',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'on-hold': 'On Hold'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const formatDate = (dateStr: string) => {
    return dateStr;
  };

  const formatTimeSlot = (startTime: string, endTime: string) => {
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    };
    
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const formatUpdatedDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    
    return `${month}. ${day}, ${year}, ${displayHour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Batch Management</h1>
          <p className="text-gray-600 mt-1">
            Manage learning delivery batches, schedules, and enrollments
          </p>
        </div>
        <Button 
          onClick={handleCreateBatch}
          className="bg-black hover:bg-gray-800 text-white gap-2 px-6 py-3 h-auto"
        >
          <Plus size={18} />
          Create Batch
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Total Batches</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.total}</p>
              <p className="text-xs text-green-600 font-medium">+12% vs last month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Active Batches</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.active}</p>
              <p className="text-xs text-green-600 font-medium">Running smoothly</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalStudents}</p>
              <p className="text-xs text-gray-500 font-medium">Across all batches</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Avg. Attendance</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.avgAttendance}%</p>
              <p className="text-xs text-green-600 font-medium">+23% improvement</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <GraduationCap className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search by batch name, course, or trainer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 bg-white border-gray-300 h-12"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-white border-gray-300 h-12">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="active">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={modeFilter} onValueChange={setModeFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-white border-gray-300 h-12">
              <SelectValue placeholder="All Modes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="WD">Weekday</SelectItem>
              <SelectItem value="WE">Weekend</SelectItem>
              <SelectItem value="WDWE">Full Week</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2 h-12 px-4 bg-white border-gray-300">
            <Download size={18} />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Batches ({filteredBatches.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Batch ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Course</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Trainer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Batch %</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Start</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">End</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Tentative End</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Slot</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Trainer Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Students</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Updated By</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredBatches.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-6 py-12 text-center text-gray-500">
                    <Calendar size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium">No batches found</p>
                    <p className="text-sm mt-1">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : (
                filteredBatches.map(batch => (
                  <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Badge className="bg-gray-700 text-white border-0 font-semibold text-xs px-3 py-1">
                        {batch.batch_id}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 whitespace-nowrap">{batch.course_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 whitespace-nowrap">{batch.trainer_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {batch.batch_completion_percentage?.toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusBadge(batch.status)}>
                        {getStatusLabel(batch.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 whitespace-nowrap">{formatDate(batch.start_date)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 whitespace-nowrap">{formatDate(batch.end_date)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 whitespace-nowrap">
                        {batch.tentative_end_date ? formatDate(batch.tentative_end_date) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 whitespace-nowrap">
                        {formatTimeSlot(batch.start_time, batch.end_time)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 whitespace-nowrap">{batch.trainer_type || 'Freelancer'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-[200px]">
                        {batch.enrolled_students && batch.enrolled_students.length > 0 
                          ? batch.enrolled_students.join(', ')
                          : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 whitespace-nowrap">
                        {batch.updated_at ? formatUpdatedDate(batch.updated_at) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 whitespace-nowrap">{batch.updated_by || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditBatch(batch)}
                          className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                          title="Edit Batch"
                        >
                          <Edit2 size={18} className="text-green-600" />
                        </button>
                        <BatchActionsDropdown batch={batch} onAction={handleBatchAction} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Drawer */}
      <BatchManagementDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        mode={drawerMode}
        batch={selectedBatch}
        categories={mockCourseCategories}
        courses={mockCoursesWithCategory}
        trainers={mockTrainersAPI}
        students={mockStudentsAPI}
        existingBatches={batches}
        onSave={handleSaveBatch}
        onAddStudents={handleAddStudents}
      />

      {/* Action Modals/Drawers */}
      {selectedBatch && activeModal === 'add-student' && (
        <AddStudentDrawer
          isOpen={true}
          onClose={closeModal}
          batch={selectedBatch}
          students={mockStudentsAPI}
          existingBatches={batches}
          onAddStudents={handleAddStudents}
        />
      )}

      {selectedBatch && activeModal === 'transfer-students' && (
        <TransferStudentWizard
          isOpen={true}
          onClose={closeModal}
          sourceBatch={selectedBatch}
          allBatches={batches}
          students={mockStudentsAPI}
          onTransfer={handleTransferStudents}
        />
      )}

      {selectedBatch && activeModal === 'trainer-handover' && (
        <TrainerHandoverWizard
          isOpen={true}
          onClose={closeModal}
          batch={selectedBatch}
          trainers={mockTrainersAPI}
          allBatches={batches}
          onHandover={handleTrainerHandover}
        />
      )}

      {selectedBatch && activeModal === 'view-transfer-requests' && (
        <BatchRequestViewer
          isOpen={true}
          onClose={closeModal}
          batch={selectedBatch}
          requestType="transfer"
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
        />
      )}

      {selectedBatch && activeModal === 'view-handover-requests' && (
        <BatchRequestViewer
          isOpen={true}
          onClose={closeModal}
          batch={selectedBatch}
          requestType="handover"
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
        />
      )}

      {selectedBatch && activeModal === 'view-students' && (
        <BatchStudentViewer
          isOpen={true}
          onClose={closeModal}
          batch={selectedBatch}
          students={mockStudentsAPI}
        />
      )}

      {selectedBatch && activeModal === 'view-transactions' && (
        <BatchTransactionTimeline
          isOpen={true}
          onClose={closeModal}
          batch={selectedBatch}
        />
      )}

      {selectedBatch && activeModal === 'export-data' && (
        <BatchExportModal
          isOpen={true}
          onClose={closeModal}
          batch={selectedBatch}
          allBatches={batches}
          onExport={handleExport}
        />
      )}
    </div>
  );
}
