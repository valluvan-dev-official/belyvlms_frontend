import { useFormContext, Controller } from 'react-hook-form';
import { UserRoleEnum, RoleSelectionFormValues } from './types';
import { Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Label } from '../../ui/label';

interface RoleSelectionStepProps {
    roles: any[]; // Replace 'any' with proper Role type if available
}

export function RoleSelectionStep({ roles }: RoleSelectionStepProps) {
    const { control, formState: { errors } } = useFormContext<RoleSelectionFormValues>();

    const isHighPrivilege = (code: string) => ['ADM', 'SAM'].includes(code.toUpperCase());

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
                <Label className="text-[#1A1D1F]">Select Role <span className="text-[#FF6B9D]">*</span></Label>

                <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {roles.map((role) => {
                                const isSelected = field.value === role.code;
                                const highPrivilege = isHighPrivilege(role.code);

                                return (
                                    <div
                                        key={role.code}
                                        onClick={() => field.onChange(role.code)}
                                        className={`
                      relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                      ${isSelected
                                                ? 'border-[#4ECDC4] bg-[#F0FDF4] shadow-sm'
                                                : 'border-[#E0E0E2] bg-white hover:border-[#4ECDC4]/50 hover:bg-[#F7F7F8]'
                                            }
                    `}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#4ECDC4]/20 text-[#44A08D]' : 'bg-[#F7F7F8] text-[#6E7191]'}`}>
                                                <Shield size={20} />
                                            </div>
                                            {isSelected && <CheckCircle2 size={20} className="text-[#4ECDC4]" />}
                                        </div>

                                        <div>
                                            <h3 className={`font-semibold ${isSelected ? 'text-[#1A1D1F]' : 'text-[#6E7191]'}`}>
                                                {role.name}
                                            </h3>
                                            <p className="text-xs text-[#6E7191] mt-1 line-clamp-2">
                                                {role.description || `Access level for ${role.name}`}
                                            </p>
                                        </div>

                                        {highPrivilege && (
                                            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-[#FF6B9D] bg-[#FFF5F7] px-2 py-1 rounded-full w-fit">
                                                <AlertTriangle size={12} />
                                                High Privilege
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                />
                {errors.role && <span className="text-xs text-red-500">{errors.role.message}</span>}
            </div>
        </div>
    );
}
