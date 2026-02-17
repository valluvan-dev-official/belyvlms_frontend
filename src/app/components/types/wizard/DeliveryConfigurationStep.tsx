import { useState } from 'react';
import { BookOpen, Clock, FileText, Folder } from 'lucide-react';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { BatchCreationForm, TrainingFormat, SessionFrequency } from '../../../types/batch';

interface DeliveryConfigurationStepProps {
  data: Partial<BatchCreationForm>;
  onComplete: (data: Partial<BatchCreationForm>) => void;
}

const MOCK_ASSESSMENT_PLANS = [
  { id: 'ap1', name: 'Standard Assessment Plan', description: 'Weekly quizzes + Final project' },
  { id: 'ap2', name: 'Continuous Evaluation', description: 'Daily assignments + Mid-term + Final' },
  { id: 'ap3', name: 'Project-Based Assessment', description: 'Multiple projects with peer review' },
];

const MOCK_RESOURCES = [
  { id: 'r1', name: 'Course Textbook', type: 'PDF' },
  { id: 'r2', name: 'Video Lectures', type: 'Video' },
  { id: 'r3', name: 'Practice Exercises', type: 'Interactive' },
  { id: 'r4', name: 'Reference Materials', type: 'Documents' },
  { id: 'r5', name: 'Code Templates', type: 'Files' },
];

export function DeliveryConfigurationStep({ data, onComplete }: DeliveryConfigurationStepProps) {
  const [formData, setFormData] = useState({
    trainingFormat: data.trainingFormat || 'instructor-led' as TrainingFormat,
    sessionFrequency: data.sessionFrequency || 'weekdays' as SessionFrequency,
    assessmentPlanId: data.assessmentPlanId || '',
    resourceMappings: data.resourceMappings || [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const toggleResource = (resourceId: string) => {
    setFormData({
      ...formData,
      resourceMappings: formData.resourceMappings.includes(resourceId)
        ? formData.resourceMappings.filter(id => id !== resourceId)
        : [...formData.resourceMappings, resourceId]
    });
  };

  const selectedAssessment = MOCK_ASSESSMENT_PLANS.find(ap => ap.id === formData.assessmentPlanId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Training Format */}
      <div className="space-y-2">
        <Label htmlFor="trainingFormat">Training Format *</Label>
        <Select 
          value={formData.trainingFormat} 
          onValueChange={(value) => setFormData({ ...formData, trainingFormat: value as TrainingFormat })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instructor-led">Instructor-Led Training</SelectItem>
            <SelectItem value="self-paced">Self-Paced Learning</SelectItem>
            <SelectItem value="blended">Blended Learning</SelectItem>
          </SelectContent>
        </Select>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-2">
          <p className="text-xs text-gray-700">
            {formData.trainingFormat === 'instructor-led' && 
              'Live sessions with real-time instruction and interaction'}
            {formData.trainingFormat === 'self-paced' && 
              'Students learn at their own pace with recorded content'}
            {formData.trainingFormat === 'blended' && 
              'Combination of live sessions and self-paced modules'}
          </p>
        </div>
      </div>

      {/* Session Frequency */}
      <div className="space-y-2">
        <Label htmlFor="sessionFrequency">Session Frequency *</Label>
        <Select 
          value={formData.sessionFrequency} 
          onValueChange={(value) => setFormData({ ...formData, sessionFrequency: value as SessionFrequency })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily (Monday-Friday)</SelectItem>
            <SelectItem value="weekdays">Weekdays (3-4 sessions/week)</SelectItem>
            <SelectItem value="weekends">Weekends Only</SelectItem>
            <SelectItem value="custom">Custom Schedule</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Assessment Plan */}
      <div className="space-y-2">
        <Label htmlFor="assessmentPlan">Assessment Plan</Label>
        <Select 
          value={formData.assessmentPlanId} 
          onValueChange={(value) => setFormData({ ...formData, assessmentPlanId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select assessment plan (optional)" />
          </SelectTrigger>
          <SelectContent>
            {MOCK_ASSESSMENT_PLANS.map((plan) => (
              <SelectItem key={plan.id} value={plan.id}>
                {plan.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedAssessment && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium">{selectedAssessment.name}</p>
                <p className="text-xs text-blue-700 mt-1">{selectedAssessment.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Learning Resources */}
      <div className="space-y-3">
        <Label>Learning Resource Mapping</Label>
        <p className="text-sm text-gray-600">Select resources to be made available to students</p>
        
        <div className="space-y-2 border border-gray-200 rounded-lg p-4">
          {MOCK_RESOURCES.map((resource) => (
            <div key={resource.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <Checkbox
                id={resource.id}
                checked={formData.resourceMappings.includes(resource.id)}
                onCheckedChange={() => toggleResource(resource.id)}
              />
              <Label htmlFor={resource.id} className="flex items-center gap-3 flex-1 cursor-pointer">
                <Folder className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-sm font-medium">{resource.name}</div>
                  <div className="text-xs text-gray-500">{resource.type}</div>
                </div>
              </Label>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">
            {formData.resourceMappings.length} resource{formData.resourceMappings.length !== 1 ? 's' : ''} selected
          </span>
        </div>
      </div>

      {/* Delivery Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-3">Delivery Configuration Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-blue-800">
            <Clock className="w-4 h-4" />
            <span>Format: {formData.trainingFormat}</span>
          </div>
          <div className="flex items-center gap-2 text-blue-800">
            <Clock className="w-4 h-4" />
            <span>Frequency: {formData.sessionFrequency}</span>
          </div>
          <div className="flex items-center gap-2 text-blue-800">
            <FileText className="w-4 h-4" />
            <span>Assessment: {selectedAssessment ? selectedAssessment.name : 'Not selected'}</span>
          </div>
          <div className="flex items-center gap-2 text-blue-800">
            <Folder className="w-4 h-4" />
            <span>{formData.resourceMappings.length} learning resources</span>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full">
          Continue to Trainer Assignment
        </Button>
      </div>
    </form>
  );
}
