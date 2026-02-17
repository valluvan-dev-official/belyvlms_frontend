import { useState } from 'react';
import { User, Star, Calendar, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { BatchCreationForm } from '../../../types/batch';
import { mockTrainers, mockTrainerWorkload } from '../../../data/batch-mock';

interface TrainerAssignmentStepProps {
  data: Partial<BatchCreationForm>;
  onComplete: (data: Partial<BatchCreationForm>) => void;
}

export function TrainerAssignmentStep({ data, onComplete }: TrainerAssignmentStepProps) {
  const [formData, setFormData] = useState({
    primaryTrainerId: data.primaryTrainerId || '',
    backupTrainerId: data.backupTrainerId || '',
  });

  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    conflicts: string[];
    workloadWarning?: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate trainer availability
    const conflicts: string[] = [];
    let workloadWarning: string | undefined;

    const primaryWorkload = mockTrainerWorkload.find(w => w.trainerId === formData.primaryTrainerId);
    if (primaryWorkload && primaryWorkload.utilizationRate > 90) {
      workloadWarning = `${primaryWorkload.trainerName} has high utilization (${primaryWorkload.utilizationRate}%). Consider assigning backup trainer.`;
    }

    if (formData.primaryTrainerId === formData.backupTrainerId) {
      conflicts.push('Primary and backup trainer cannot be the same');
    }

    setValidationResult({
      isValid: conflicts.length === 0,
      conflicts,
      workloadWarning,
    });

    if (conflicts.length === 0) {
      onComplete(formData);
    }
  };

  const primaryTrainer = mockTrainers.find(t => t.id === formData.primaryTrainerId);
  const backupTrainer = mockTrainers.find(t => t.id === formData.backupTrainerId);
  const primaryWorkload = mockTrainerWorkload.find(w => w.trainerId === formData.primaryTrainerId);
  const backupWorkload = mockTrainerWorkload.find(w => w.trainerId === formData.backupTrainerId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Primary Trainer Selection */}
      <div className="space-y-2">
        <Label htmlFor="primaryTrainer">Primary Trainer *</Label>
        <Select 
          value={formData.primaryTrainerId} 
          onValueChange={(value) => setFormData({ ...formData, primaryTrainerId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select primary trainer" />
          </SelectTrigger>
          <SelectContent>
            {mockTrainers.map((trainer) => (
              <SelectItem key={trainer.id} value={trainer.id}>
                <div className="flex items-center gap-2">
                  {trainer.name}
                  {!trainer.isAvailable && (
                    <Badge variant="outline" className="text-xs">Unavailable</Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Primary Trainer Details */}
      {primaryTrainer && primaryWorkload && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">{primaryTrainer.name}</h4>
                </div>
                <p className="text-sm text-blue-700 mt-1">{primaryTrainer.email}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-blue-900">{primaryTrainer.rating}</span>
              </div>
            </div>

            {/* Specialization */}
            <div>
              <p className="text-xs text-blue-700 mb-2">Specialization</p>
              <div className="flex flex-wrap gap-2">
                {primaryTrainer.specialization.map((spec, index) => (
                  <Badge key={index} variant="outline" className="bg-white border-blue-300 text-blue-700">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Workload Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-blue-700 mb-1">Active Batches</p>
                <p className="text-lg font-bold text-blue-900">{primaryWorkload.activeBatches}</p>
              </div>
              <div>
                <p className="text-xs text-blue-700 mb-1">Weekly Hours</p>
                <p className="text-lg font-bold text-blue-900">{primaryWorkload.weeklyHours}h</p>
              </div>
            </div>

            {/* Utilization Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-blue-700">Utilization Rate</p>
                <span className={`text-sm font-medium ${
                  primaryWorkload.utilizationRate > 90 ? 'text-red-600' :
                  primaryWorkload.utilizationRate > 75 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {primaryWorkload.utilizationRate}%
                </span>
              </div>
              <Progress value={primaryWorkload.utilizationRate} className="h-2" />
              {primaryWorkload.utilizationRate > 85 && (
                <div className="flex items-center gap-2 mt-2 text-xs text-yellow-700">
                  <AlertCircle className="w-3 h-3" />
                  <span>High workload - recommend assigning backup trainer</span>
                </div>
              )}
            </div>

            {/* Availability Schedule */}
            <div>
              <p className="text-xs text-blue-700 mb-2">Weekly Availability</p>
              <div className="grid grid-cols-5 gap-1">
                {primaryWorkload.availability.map((day, index) => (
                  <div 
                    key={index}
                    className={`text-center p-2 rounded text-xs ${
                      day.isAvailable 
                        ? 'bg-green-100 text-green-700 border border-green-300' 
                        : 'bg-gray-100 text-gray-500 border border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{day.dayOfWeek.slice(0, 3)}</div>
                    <div className="text-[10px] mt-1">
                      {day.isAvailable ? `${day.startTime}-${day.endTime}` : 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="flex items-center justify-between pt-3 border-t border-blue-200">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <TrendingUp className="w-4 h-4" />
                <span>Performance Score: {primaryWorkload.performanceScore}/5.0</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <Calendar className="w-4 h-4" />
                <span>Total Batches: {primaryWorkload.totalBatches}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Backup Trainer Selection */}
      <div className="space-y-2">
        <Label htmlFor="backupTrainer">Backup Trainer (Optional)</Label>
        <Select 
          value={formData.backupTrainerId} 
          onValueChange={(value) => setFormData({ ...formData, backupTrainerId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select backup trainer (recommended)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No backup trainer</SelectItem>
            {mockTrainers
              .filter(t => t.id !== formData.primaryTrainerId)
              .map((trainer) => (
                <SelectItem key={trainer.id} value={trainer.id}>
                  <div className="flex items-center gap-2">
                    {trainer.name}
                    {!trainer.isAvailable && (
                      <Badge variant="outline" className="text-xs">Unavailable</Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          Backup trainer will be notified and can substitute when primary trainer is unavailable
        </p>
      </div>

      {/* Backup Trainer Details */}
      {backupTrainer && backupWorkload && (
        <Card className="p-4 bg-gray-50 border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                <h4 className="font-medium text-gray-900">{backupTrainer.name}</h4>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium">{backupTrainer.rating}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Utilization: {backupWorkload.utilizationRate}%</span>
              <span className="text-gray-600">Active Batches: {backupWorkload.activeBatches}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Validation Results */}
      {validationResult && !validationResult.isValid && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-900 mb-2">Validation Errors</h4>
              <ul className="space-y-1">
                {validationResult.conflicts.map((conflict, index) => (
                  <li key={index} className="text-sm text-red-700">• {conflict}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {validationResult && validationResult.isValid && validationResult.workloadWarning && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900 mb-1">Workload Warning</h4>
              <p className="text-sm text-yellow-700">{validationResult.workloadWarning}</p>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Summary */}
      {formData.primaryTrainerId && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-green-900 mb-2">Trainer Assignment Summary</h4>
              <div className="space-y-1 text-sm text-green-800">
                <p>Primary: {primaryTrainer?.name}</p>
                {backupTrainer && <p>Backup: {backupTrainer.name}</p>}
                <p className="text-xs text-green-700 mt-2">
                  Both trainers will receive notification upon batch creation
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pt-4">
        <Button type="submit" className="w-full" disabled={!formData.primaryTrainerId}>
          Continue to Schedule Planning
        </Button>
      </div>
    </form>
  );
}