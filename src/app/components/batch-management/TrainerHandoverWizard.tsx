// Trainer Handover - Simple Modal Design
// Clean form with trainer selection, reason, and handover date

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { BatchAPI, TrainerAPI } from '../../types/batch-api';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { toast } from 'sonner';

interface TrainerHandoverWizardProps {
  isOpen: boolean;
  onClose: () => void;
  batch: BatchAPI;
  trainers: TrainerAPI[];
  allBatches: BatchAPI[];
  onHandover: (batchId: string, newTrainerId: string) => Promise<void>;
}

export function TrainerHandoverWizard({
  isOpen,
  onClose,
  batch,
  trainers,
  allBatches,
  onHandover
}: TrainerHandoverWizardProps) {
  const [selectedTrainerId, setSelectedTrainerId] = useState('');
  const [reason, setReason] = useState('');
  const [handoverDate, setHandoverDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedTrainerId('');
      setReason('');
      setHandoverDate('');
    }
  }, [isOpen]);

  // Filter trainers who can teach this course
  const eligibleTrainers = trainers.filter(
    t => t.id !== batch.trainer_id && 
         t.stack.includes(batch.course_name || '') &&
         t.is_available
  );

  const handleSubmit = async () => {
    if (!selectedTrainerId) {
      toast.error('Please select a trainer');
      return;
    }
    if (!reason.trim()) {
      toast.error('Please provide a reason for handover');
      return;
    }
    if (!handoverDate) {
      toast.error('Please select a handover date');
      return;
    }

    setLoading(true);
    try {
      await onHandover(batch.id, selectedTrainerId);
      toast.success('Trainer handover request submitted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to submit handover request');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-[630px] m-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Trainer Handover</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-5">
            {/* New Trainer */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                New Trainer
              </label>
              <Select value={selectedTrainerId} onValueChange={setSelectedTrainerId}>
                <SelectTrigger className="w-full bg-white border-gray-300">
                  <SelectValue placeholder="Select a trainer" />
                </SelectTrigger>
                <SelectContent>
                  {eligibleTrainers.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No eligible trainers available
                    </div>
                  ) : (
                    eligibleTrainers.map(trainer => (
                      <SelectItem key={trainer.id} value={trainer.id}>
                        {trainer.name} - Rating: {trainer.rating}/5
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Reason
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder=""
                className="w-full min-h-[120px] border-gray-300 resize-none"
              />
            </div>

            {/* Handover Date */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Handover Date
              </label>
              <Input
                type="date"
                value={handoverDate}
                onChange={(e) => setHandoverDate(e.target.value)}
                placeholder="dd-mm-yyyy"
                className="w-full border-gray-300"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end">
            <Button
              onClick={handleSubmit}
              disabled={loading || !selectedTrainerId || !reason.trim() || !handoverDate}
              className="px-6 bg-blue-900 hover:bg-blue-950 text-white"
            >
              {loading ? 'Submitting...' : 'Submit Handover'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
