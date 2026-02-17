import { 
  CheckCircle, 
  Calendar, 
  Users, 
  GraduationCap, 
  User, 
  MapPin, 
  Monitor,
  Clock,
  BookOpen,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { BatchCreationForm } from '../../../types/batch';
import { mockCourses, mockTrainers } from '../../../data/batch-mock';

interface ReviewConfirmStepProps {
  data: Partial<BatchCreationForm>;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function ReviewConfirmStep({ data, onSubmit, isSubmitting = false }: ReviewConfirmStepProps) {
  const course = mockCourses.find(c => c.id === data.courseId);
  const primaryTrainer = mockTrainers.find(t => t.id === data.primaryTrainerId);
  const backupTrainer = mockTrainers.find(t => t.id === data.backupTrainerId);

  // Calculate risk indicators
  const riskIndicators = [];
  if (!data.backupTrainerId) {
    riskIndicators.push('No backup trainer assigned');
  }
  if ((data.schedules?.length || 0) < 5) {
    riskIndicators.push('Limited number of sessions');
  }
  if ((data.capacity || 0) > 30) {
    riskIndicators.push('Large batch size may affect engagement');
  }

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center bg-green-50 border border-green-200 rounded-lg p-6">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-900 mb-2">
          Ready to Create Batch
        </h3>
        <p className="text-green-700">
          Please review all details before finalizing batch creation
        </p>
      </div>

      {/* Batch Information */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          Batch Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Batch Name</p>
            <p className="font-medium text-gray-900">{data.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Course</p>
            <p className="font-medium text-gray-900">{course?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Delivery Mode</p>
            <Badge variant="outline" className="mt-1">
              {data.deliveryMode}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600">Batch Capacity</p>
            <p className="font-medium text-gray-900">
              {data.capacity} students
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Start Date</p>
            <p className="font-medium text-gray-900">
              {data.startDate ? new Date(data.startDate).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">End Date</p>
            <p className="font-medium text-gray-900">
              {data.endDate ? new Date(data.endDate).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          {data.location && (
            <div>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Location
              </p>
              <p className="font-medium text-gray-900">{data.location}</p>
            </div>
          )}
          {data.virtualPlatform && (
            <div>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Monitor className="w-3 h-3" />
                Virtual Platform
              </p>
              <p className="font-medium text-gray-900">{data.virtualPlatform}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Delivery Configuration */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600" />
          Delivery Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Training Format</p>
            <Badge variant="outline" className="mt-1">
              {data.trainingFormat}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600">Session Frequency</p>
            <Badge variant="outline" className="mt-1">
              {data.sessionFrequency}
            </Badge>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600 mb-2">Learning Resources</p>
            <div className="flex flex-wrap gap-2">
              {(data.resourceMappings?.length || 0) > 0 ? (
                <Badge variant="outline">
                  {data.resourceMappings?.length} resources selected
                </Badge>
              ) : (
                <p className="text-sm text-gray-500">No resources selected</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Trainer Assignment */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-orange-600" />
          Trainer Assignment
        </h3>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1">Primary Trainer</p>
                <p className="font-medium text-blue-900">{primaryTrainer?.name || 'N/A'}</p>
                <p className="text-sm text-blue-700">{primaryTrainer?.email}</p>
              </div>
              <Badge className="bg-blue-600">Primary</Badge>
            </div>
          </div>
          
          {backupTrainer ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Backup Trainer</p>
                  <p className="font-medium text-gray-900">{backupTrainer.name}</p>
                  <p className="text-sm text-gray-600">{backupTrainer.email}</p>
                </div>
                <Badge variant="outline">Backup</Badge>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">No backup trainer assigned</p>
            </div>
          )}
        </div>
      </Card>

      {/* Schedule Summary */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-600" />
          Schedule Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-sm text-green-700 mb-1">Total Sessions</p>
            <p className="text-3xl font-bold text-green-900">
              {data.schedules?.length || 0}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-700 mb-1">Timezone</p>
            <p className="text-lg font-medium text-blue-900">
              {data.timezone || 'N/A'}
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <p className="text-sm text-purple-700 mb-1">Duration</p>
            <p className="text-lg font-medium text-purple-900">
              {course?.duration || 'N/A'}
            </p>
          </div>
        </div>

        {(data.schedules?.length || 0) > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <p className="text-sm font-medium text-gray-700 mb-2">Session Schedule Preview:</p>
            {data.schedules?.slice(0, 5).map((session, index) => (
              <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">#{session.sessionNumber}</Badge>
                  <span className="text-gray-900">{session.sessionTitle}</span>
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(session.sessionDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {session.startTime}
                  </span>
                </div>
              </div>
            ))}
            {(data.schedules?.length || 0) > 5 && (
              <p className="text-xs text-gray-500 text-center pt-2">
                +{(data.schedules?.length || 0) - 5} more sessions
              </p>
            )}
          </div>
        )}
      </Card>

      {/* Risk Indicators */}
      {riskIndicators.length > 0 && (
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Risk Indicators
          </h3>
          <ul className="space-y-2">
            {riskIndicators.map((risk, index) => (
              <li key={index} className="text-sm text-yellow-800 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full" />
                {risk}
              </li>
            ))}
          </ul>
          <p className="text-xs text-yellow-700 mt-3">
            These are recommendations and won't prevent batch creation
          </p>
        </Card>
      )}

      {/* Resource Allocation Snapshot */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-4">Resource Allocation Snapshot</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{data.capacity}</p>
            <p className="text-xs text-blue-700">Student Capacity</p>
          </div>
          <div>
            <User className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{backupTrainer ? '2' : '1'}</p>
            <p className="text-xs text-blue-700">Trainers Assigned</p>
          </div>
          <div>
            <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{data.schedules?.length || 0}</p>
            <p className="text-xs text-blue-700">Sessions Planned</p>
          </div>
          <div>
            <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{data.resourceMappings?.length || 0}</p>
            <p className="text-xs text-blue-700">Resources Linked</p>
          </div>
        </div>
      </Card>

      {/* Final Actions */}
      <Card className="p-6">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6">
          <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Batch will be created with status "Scheduled"</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Trainers will receive notification emails</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Session calendar will be activated</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Student enrollment will be opened</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Batch audit log will begin tracking</span>
            </li>
          </ul>
        </div>

        <Button onClick={onSubmit} className="w-full" size="lg">
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <CheckCircle className="w-5 h-5 mr-2" />
          )}
          Create Batch & Notify Trainers
        </Button>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          By creating this batch, you confirm all details are accurate and ready for deployment
        </p>
      </Card>
    </div>
  );
}