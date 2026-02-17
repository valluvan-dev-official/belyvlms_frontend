// Batch Export Modal Component
// Export batch data in multiple formats

import { useState } from 'react';
import { X, Download, FileText, Table, CheckCircle } from 'lucide-react';
import { BatchAPI } from '../../types/batch-api';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

interface BatchExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch?: BatchAPI;
  allBatches?: BatchAPI[];
  onExport: (format: 'csv' | 'excel', scope: 'single' | 'all') => Promise<void>;
}

type ExportFormat = 'csv' | 'excel';
type ExportScope = 'single' | 'all';

export function BatchExportModal({
  isOpen,
  onClose,
  batch,
  allBatches,
  onExport
}: BatchExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('excel');
  const [selectedScope, setSelectedScope] = useState<ExportScope>('single');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      await onExport(selectedFormat, selectedScope);
      const scopeText = selectedScope === 'single' 
        ? `batch ${batch?.batch_id}` 
        : `all ${allBatches?.length} batches`;
      toast.success(`Exported ${scopeText} as ${selectedFormat.toUpperCase()}`);
      onClose();
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const exportFields = [
    'Batch ID',
    'Course Name',
    'Trainer Name',
    'Trainer Type',
    'Batch Type',
    'Start Date',
    'End Date',
    'Tentative End Date',
    'Time Slot',
    'Hours per Day',
    'Days of Week',
    'Status',
    'Completion %',
    'Student Count',
    'Enrolled Students',
    'Created Date',
    'Updated Date',
    'Created By',
    'Updated By'
  ];

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" onClick={onClose}>
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl m-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Download className="text-blue-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Export Batch Data</h2>
                <p className="text-sm text-gray-600">Download batch information in your preferred format</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Export Scope */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Export Scope
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedScope('single')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedScope === 'single'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <FileText size={24} className={selectedScope === 'single' ? 'text-blue-600' : 'text-gray-400'} />
                    {selectedScope === 'single' && (
                      <CheckCircle size={20} className="text-blue-600" />
                    )}
                  </div>
                  <h3 className={`font-semibold mb-1 ${selectedScope === 'single' ? 'text-blue-900' : 'text-gray-900'}`}>
                    Selected Batch
                  </h3>
                  <p className="text-xs text-gray-600">
                    {batch ? `Export ${batch.batch_id} only` : 'Export current batch'}
                  </p>
                </button>

                <button
                  onClick={() => setSelectedScope('all')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedScope === 'all'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Table size={24} className={selectedScope === 'all' ? 'text-blue-600' : 'text-gray-400'} />
                    {selectedScope === 'all' && (
                      <CheckCircle size={20} className="text-blue-600" />
                    )}
                  </div>
                  <h3 className={`font-semibold mb-1 ${selectedScope === 'all' ? 'text-blue-900' : 'text-gray-900'}`}>
                    All Batches
                  </h3>
                  <p className="text-xs text-gray-600">
                    Export all {allBatches?.length || 0} batches
                  </p>
                </button>
              </div>
            </div>

            {/* Export Format */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Export Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedFormat('excel')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedFormat === 'excel'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`text-2xl ${selectedFormat === 'excel' ? 'text-green-600' : 'text-gray-400'}`}>
                      📊
                    </div>
                    {selectedFormat === 'excel' && (
                      <CheckCircle size={20} className="text-green-600" />
                    )}
                  </div>
                  <h3 className={`font-semibold mb-1 ${selectedFormat === 'excel' ? 'text-green-900' : 'text-gray-900'}`}>
                    Excel (.xlsx)
                  </h3>
                  <p className="text-xs text-gray-600">
                    Formatted spreadsheet with styling
                  </p>
                </button>

                <button
                  onClick={() => setSelectedFormat('csv')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedFormat === 'csv'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`text-2xl ${selectedFormat === 'csv' ? 'text-green-600' : 'text-gray-400'}`}>
                      📄
                    </div>
                    {selectedFormat === 'csv' && (
                      <CheckCircle size={20} className="text-green-600" />
                    )}
                  </div>
                  <h3 className={`font-semibold mb-1 ${selectedFormat === 'csv' ? 'text-green-900' : 'text-gray-900'}`}>
                    CSV (.csv)
                  </h3>
                  <p className="text-xs text-gray-600">
                    Plain text comma-separated values
                  </p>
                </button>
              </div>
            </div>

            {/* Export Preview */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Export Summary</h3>
              <div className="space-y-1 text-sm text-blue-800">
                <p>
                  • <strong>Scope:</strong> {selectedScope === 'single' 
                    ? `Single batch (${batch?.batch_id})` 
                    : `All batches (${allBatches?.length} total)`}
                </p>
                <p>
                  • <strong>Format:</strong> {selectedFormat.toUpperCase()}
                </p>
                <p>
                  • <strong>Fields:</strong> {exportFields.length} columns
                </p>
              </div>
            </div>

            {/* Included Fields */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Included Fields</h3>
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                <div className="flex flex-wrap gap-2">
                  {exportFields.map((field, idx) => (
                    <Badge key={idx} className="bg-gray-100 text-gray-700 border-0 text-xs">
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between rounded-b-xl">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 gap-2"
            >
              <Download size={18} />
              {loading ? 'Exporting...' : `Export as ${selectedFormat.toUpperCase()}`}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
