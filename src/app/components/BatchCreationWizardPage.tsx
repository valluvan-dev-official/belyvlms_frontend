import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { BatchInformationStep } from '../components/batch-management/wizard/BatchInformationStep';
import { DeliveryConfigurationStep } from '../components/batch-management/wizard/DeliveryConfigurationStep';
import { TrainerAssignmentStep } from '../components/batch-management/wizard/TrainerAssignmentStep';
import { SchedulePlanningStep } from '../components/batch-management/wizard/SchedulePlanningStep';
import { ReviewConfirmStep } from '../components/batch-management/wizard/ReviewConfirmStep';
import { BatchCreationSuccessModal } from '../components/batch-management/BatchCreationSuccessModal';
import { BatchCreationForm, Batch } from '../../types/batch';
import { useBatch } from '../context/BatchContext';

const STEPS = [
  { id: 1, title: 'Batch Information', description: 'Basic batch details and configuration' },
  { id: 2, title: 'Delivery Configuration', description: 'Training format and resources' },
  { id: 3, title: 'Trainer Assignment', description: 'Assign trainers and validate availability' },
  { id: 4, title: 'Schedule Planning', description: 'Define batch schedule and timing' },
  { id: 5, title: 'Review & Confirm', description: 'Review and finalize batch creation' },
];

export function BatchCreationWizardPage() {
  const navigate = useNavigate();
  const { addBatch, saveDraft } = useBatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BatchCreationForm>>({
    resourceMappings: [],
    schedules: [],
  });
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdBatch, setCreatedBatch] = useState<Batch | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = (currentStep / STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepComplete = (stepData: Partial<BatchCreationForm>) => {
    setFormData({ ...formData, ...stepData });
    
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    
    handleNext();
  };

  const handleSaveDraft = () => {
    try {
      const draft = saveDraft(formData);
      toast.success('Draft Saved', {
        description: `Your batch draft "${draft.name}" has been saved successfully.`
      });
      navigate('/batches');
    } catch (error) {
      toast.error('Failed to save draft', {
        description: 'Please try again or contact support if the issue persists.'
      });
    }
  };

  const validateFinalSubmission = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Step 1 validation
    if (!formData.name) errors.push('Batch name is required');
    if (!formData.courseId) errors.push('Course selection is required');
    if (!formData.startDate) errors.push('Start date is required');
    if (!formData.endDate) errors.push('End date is required');
    if (!formData.capacity || formData.capacity <= 0) errors.push('Valid capacity is required');

    // Step 2 validation
    if (!formData.trainingFormat) errors.push('Training format is required');
    if (!formData.sessionFrequency) errors.push('Session frequency is required');

    // Step 3 validation
    if (!formData.primaryTrainerId) errors.push('Primary trainer is required');

    // Step 4 validation
    if (!formData.timezone) errors.push('Timezone is required');
    if (!formData.schedules || formData.schedules.length === 0) {
      errors.push('At least one session schedule is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleSubmit = async () => {
    // Validate all required fields
    const validation = validateFinalSubmission();
    
    if (!validation.isValid) {
      toast.error('Validation Failed', {
        description: validation.errors[0]
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create the batch
      const newBatch = addBatch(formData);
      
      setCreatedBatch(newBatch);
      setShowSuccessModal(true);

      // Show success toast
      toast.success('Batch Created Successfully!', {
        description: `${newBatch.name} has been created and trainers have been notified.`
      });

    } catch (error) {
      toast.error('Failed to Create Batch', {
        description: 'An error occurred while creating the batch. Please try again.'
      });
      console.error('Batch creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewBatch = () => {
    setShowSuccessModal(false);
    navigate('/batches');
  };

  const handleCreateAnother = () => {
    setShowSuccessModal(false);
    setCurrentStep(1);
    setFormData({
      resourceMappings: [],
      schedules: [],
    });
    setCompletedSteps([]);
    setCreatedBatch(null);
  };

  const handleGoHome = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BatchInformationStep data={formData} onComplete={handleStepComplete} />;
      case 2:
        return <DeliveryConfigurationStep data={formData} onComplete={handleStepComplete} />;
      case 3:
        return <TrainerAssignmentStep data={formData} onComplete={handleStepComplete} />;
      case 4:
        return <SchedulePlanningStep data={formData} onComplete={handleStepComplete} />;
      case 5:
        return <ReviewConfirmStep data={formData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => navigate('/batches')} className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Batches
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Batch</h1>
          <p className="text-gray-600 mt-1">Follow the wizard to set up a new training batch</p>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-900">
                Step {currentStep} of {STEPS.length}
              </span>
              <span className="text-gray-600">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  currentStep > step.id
                    ? 'bg-green-500 border-green-500 text-white'
                    : currentStep === step.id
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="font-medium">{step.id}</span>
                )}
              </div>
              <div className="mt-2 text-center hidden md:block">
                <div
                  className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 mt-1 max-w-32">
                  {step.description}
                </div>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 ${
                  currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
          <p className="text-gray-600 text-sm mt-1">{STEPS[currentStep - 1].description}</p>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
              >
                Save as Draft
              </Button>
              
              {currentStep < STEPS.length ? (
                <Button onClick={handleNext} className="gap-2">
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="gap-2" disabled={isSubmitting}>
                  <Save className="w-4 h-4" />
                  Create Batch
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Modal */}
      {showSuccessModal && (
        <BatchCreationSuccessModal
          batch={createdBatch!}
          onViewBatch={handleViewBatch}
          onCreateAnother={handleCreateAnother}
          onGoHome={handleGoHome}
        />
      )}
    </div>
  );
}
