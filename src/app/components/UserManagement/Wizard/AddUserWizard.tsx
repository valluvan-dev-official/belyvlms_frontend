import { useState, useMemo, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WizardStepper } from './WizardStepper';
import { IdentityStep } from './IdentityStep';
import { RoleSelectionStep } from './RoleSelectionStep';
import { DynamicRoleStep } from './DynamicRoleStep';
import { ReviewStep } from './ReviewStep';
import { wizardSchema, WizardFormValues, identitySchema, roleSelectionSchema } from './types';
import { Button } from '../../ui/button';
import { ArrowLeft, ArrowRight, Loader2, Save, User, Building, Shield, CheckCircle2 } from 'lucide-react';
import { SheetFooter } from '../../ui/sheet';
import { toast } from 'sonner';
import { getOnboardingOptions, OnboardingOptions } from '../../../services/RbacService/RbacService';

interface AddUserWizardProps {
    roles: any[];
    onSubmit: (data: WizardFormValues) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const steps = [
    { number: 1, title: "Identity", icon: User },
    { number: 2, title: "Role", icon: Shield },
    { number: 3, title: "Details", icon: Building },
    { number: 4, title: "Review", icon: CheckCircle2 },
];

export function AddUserWizard({ roles, onSubmit, onCancel, isLoading }: AddUserWizardProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [options, setOptions] = useState<OnboardingOptions | null>(null);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const data = await getOnboardingOptions();
                setOptions(data);
            } catch (error) {
                console.error("Failed to fetch onboarding options", error);
                // toast.error("Failed to load generic options");
            }
        };
        fetchOptions();
    }, []);

    // Dynamic Schema Selection based on Step
    const currentSchema = useMemo(() => {
        switch (currentStep) {
            case 1:
                return identitySchema;
            case 2:
                // We need to retain identity fields validity, but honestly, 
                // validating just the new fields is cleaner for the UI.
                // However, useForm state holds all. 
                // Let's use roleSelectionSchema.
                return roleSelectionSchema;
            case 3:
                // At step 3, we have Role + Identity. The intersection is now valid.
                // We use wizardSchema to validate everything including dynamic role fields.
                return wizardSchema;
            default:
                return wizardSchema;
        }
    }, [currentStep]);

    const methods = useForm<WizardFormValues>({
        resolver: zodResolver(currentSchema) as any, // Cast to any to avoid partial schema mismatch with full form type
        mode: 'onChange',
        defaultValues: {
            countryCode: '+91',
            role: undefined,
            placementRequired: false,
            isExperienced: false,
            sendInvite: true,
            requirePasswordChange: true,
        }
    });

    const { trigger, handleSubmit, watch, formState: { errors } } = methods;

    // Debugging
    // console.log("Form Errors", errors);
    // console.log("Current Values", watch());

    const handleNext = async () => {
        // Trigger validation against the CURRENT schema (defined by resolver)
        const isValid = await trigger();

        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length));
        } else {
            console.log("Validation Errors:", errors);
            // toast.error("Please fix the validation errors before proceeding.");
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const onFinalSubmit = async (data: WizardFormValues) => {
        await onSubmit(data);
    };

    return (
        <FormProvider {...methods}>
            <div className="flex flex-col h-full">
                {/* Progress */}
                <WizardStepper currentStep={currentStep} steps={steps} />

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-1 py-2 min-h-[400px]">
                    {currentStep === 1 && <IdentityStep />}
                    {currentStep === 2 && <RoleSelectionStep roles={roles} />}
                    {currentStep === 3 && <DynamicRoleStep options={options} />}
                    {currentStep === 4 && <ReviewStep onEditStep={setCurrentStep} />}
                </div>

                {/* Footer */}
                <SheetFooter className="mt-8 pt-4 border-t border-[#E0E0E2] flex items-center justify-between sm:justify-between sticky bottom-0 bg-white">
                    <Button
                        variant="outline"
                        onClick={currentStep === 1 ? onCancel : handleBack}
                        className="border-[#E0E0E2] text-[#6E7191] hover:bg-[#F7F7F8] hover:text-[#1A1D1F]"
                        type="button"
                    >
                        {currentStep === 1 ? 'Cancel' : <><ArrowLeft size={16} className="mr-2" /> Back</>}
                    </Button>

                    {currentStep < steps.length ? (
                        <Button
                            onClick={handleNext}
                            className="bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white hover:shadow-lg transition-all border-none"
                            type="button"
                        >
                            Next Step
                            <ArrowRight size={16} className="ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit(onFinalSubmit)}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white hover:shadow-lg transition-all border-none"
                            type="button"
                        >
                            {isLoading ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
                            Create User
                        </Button>
                    )}
                </SheetFooter>
            </div>
        </FormProvider>
    );
}
