import { CheckCircle, Calendar, Users, GraduationCap, ArrowRight, Home, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Batch } from '../../types/batch';

interface BatchCreationSuccessModalProps {
  batch: Partial<Batch>;
  onViewBatch: () => void;
  onCreateAnother: () => void;
  onGoHome: () => void;
}

export function BatchCreationSuccessModal({ 
  batch, 
  onViewBatch, 
  onCreateAnother, 
  onGoHome 
}: BatchCreationSuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Batch Created Successfully!
          </h2>
          <p className="text-green-50 text-lg">
            Your batch has been created and is ready to go
          </p>
        </div>

        {/* Batch Details */}
        <div className="p-8 space-y-6">
          {/* Batch Info Card */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  <h3 className="text-2xl font-bold text-blue-900">{batch.name}</h3>
                </div>
                <p className="text-blue-700">{batch.courseName}</p>
              </div>
              <Badge className="bg-green-500 text-white">
                {batch.status || 'Scheduled'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-blue-600">Start Date</p>
                  <p className="font-medium text-blue-900">
                    {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-purple-600">Capacity</p>
                  <p className="font-medium text-purple-900">
                    {batch.capacity} Students
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">What Happens Next?</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">Trainer Notification</p>
                  <p className="text-sm text-gray-600">
                    {batch.primaryTrainerName} will receive an email with batch details and schedule
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">Enrollment Opens</p>
                  <p className="text-sm text-gray-600">
                    Students can now enroll in this batch through the enrollment portal
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">Calendar Integration</p>
                  <p className="text-sm text-gray-600">
                    All scheduled sessions have been added to the system calendar
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                  4
                </div>
                <div>
                  <p className="font-medium text-gray-900">Resources Available</p>
                  <p className="text-sm text-gray-600">
                    All learning resources are now accessible to enrolled students
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-900 text-xs font-bold">
                !
              </span>
              Important Notes
            </h4>
            <ul className="space-y-1 text-sm text-yellow-800 ml-7">
              <li>• You can monitor batch progress from the Batch Monitoring Dashboard</li>
              <li>• Enrollment requests will appear in the Enrollment Management section</li>
              <li>• You can modify batch details before the start date if needed</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={onViewBatch}
              className="flex-1 gap-2"
              size="lg"
            >
              <Eye className="w-5 h-5" />
              View Batch Details
            </Button>

            <Button 
              onClick={onCreateAnother}
              variant="outline"
              className="flex-1 gap-2"
              size="lg"
            >
              <ArrowRight className="w-5 h-5" />
              Create Another Batch
            </Button>
          </div>

          <Button 
            onClick={onGoHome}
            variant="ghost"
            className="w-full gap-2"
          >
            <Home className="w-4 h-4" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
