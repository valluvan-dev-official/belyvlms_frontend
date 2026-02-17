import { CheckCircle2, LucideIcon } from 'lucide-react';

interface Step {
    number: number;
    title: string;
    icon: LucideIcon;
}

interface WizardStepperProps {
    currentStep: number;
    steps: Step[];
}

export function WizardStepper({ currentStep, steps }: WizardStepperProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-2 relative">
                {/* Progress Bar Background */}
                <div className="absolute left-6 right-6 top-[15px] h-[2px] bg-[#E0E0E2] -z-0 hidden md:block" />

                {steps.map((s) => (
                    <div key={s.number} className="flex flex-col items-center relative z-10 w-full">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${currentStep >= s.number
                                    ? 'bg-[#1A1D1F] text-white shadow-md scale-100'
                                    : 'bg-[#F7F7F8] text-[#6E7191] border border-[#E0E0E2] scale-90'
                                }`}
                        >
                            {currentStep > s.number ? <CheckCircle2 size={16} /> : s.number}
                        </div>
                        <span
                            className={`text-[10px] mt-2 font-medium transition-colors duration-300 ${currentStep >= s.number ? 'text-[#1A1D1F]' : 'text-[#6E7191]'
                                }`}
                        >
                            {s.title}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
