import { useFormContext } from 'react-hook-form';
import { StudentPanel } from './StudentPanel';
import { TrainerPanel } from './TrainerPanel';
import { StaffPanel } from './StaffPanel';
import { RoleSelectionFormValues } from './types';
import { OnboardingOptions } from '../../../services/RbacService/RbacService';

interface DynamicRoleStepProps {
    options: OnboardingOptions | null;
}

export function DynamicRoleStep({ options }: DynamicRoleStepProps) {
    const { watch } = useFormContext<RoleSelectionFormValues>();
    const role = watch('role');

    if (!role) return <div className="text-center text-gray-500 py-8">Please select a role first.</div>;

    switch (role) {
        case 'BTR': // Student
            return <StudentPanel options={options} />;
        case 'TRN': // Trainer
            return <TrainerPanel />;
        case 'ADM':
        case 'SAM':
        case 'STF':
        case 'BTC':
        case 'PLO':
        case 'CON':
            return <StaffPanel />;
        default:
            return <div className="text-center text-gray-500 py-8">No specific configuration for this role.</div>;
    }
}
