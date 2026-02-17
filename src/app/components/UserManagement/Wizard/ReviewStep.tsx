import { useFormContext } from 'react-hook-form';
import { WizardFormValues } from './types';
import { Edit2, CheckCircle2 } from 'lucide-react';
import { Button } from '../../ui/button';

interface ReviewStepProps {
    onEditStep: (step: number) => void;
}

export function ReviewStep({ onEditStep }: ReviewStepProps) {
    const { getValues } = useFormContext<WizardFormValues>();
    const values = getValues();

    // Helper to safely get nested values or display '-'
    const val = (v: any) => v || '-';

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

            <div className="bg-[#F0FDF4] border border-[#4ECDC4]/20 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] flex items-center justify-center text-white shrink-0">
                    <CheckCircle2 size={24} />
                </div>
                <div>
                    <h4 className="font-semibold text-[#1A1D1F]">Ready to Onboard</h4>
                    <p className="text-sm text-[#6E7191]">Please review the details below before creating the user account.</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Identity Section */}
                <section className="bg-white rounded-xl border border-[#E0E0E2] overflow-hidden">
                    <div className="bg-[#F7F7F8] px-4 py-3 border-b border-[#E0E0E2] flex justify-between items-center">
                        <h3 className="font-semibold text-[#1A1D1F]">Identity Details</h3>
                        <Button variant="ghost" size="sm" onClick={() => onEditStep(1)} className="text-[#6E7191] hover:text-[#1A1D1F]">
                            <Edit2 size={14} className="mr-1" /> Edit
                        </Button>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-[#6E7191] block mb-1">Full Name</span><span className="font-medium">{val(values.firstName)} {val(values.lastName)}</span></div>
                        <div><span className="text-[#6E7191] block mb-1">Email</span><span className="font-medium">{val(values.email)}</span></div>
                        <div><span className="text-[#6E7191] block mb-1">Phone</span><span className="font-medium">{val(values.phone)}</span></div>
                    </div>
                </section>

                {/* Role Section */}
                <section className="bg-white rounded-xl border border-[#E0E0E2] overflow-hidden">
                    <div className="bg-[#F7F7F8] px-4 py-3 border-b border-[#E0E0E2] flex justify-between items-center">
                        <h3 className="font-semibold text-[#1A1D1F]">Role Configuration</h3>
                        <Button variant="ghost" size="sm" onClick={() => onEditStep(2)} className="text-[#6E7191] hover:text-[#1A1D1F]">
                            <Edit2 size={14} className="mr-1" /> Edit
                        </Button>
                    </div>
                    <div className="p-4 text-sm">
                        <div className="mb-4"><span className="text-[#6E7191] block mb-1">Assigned Role</span><span className="font-bold text-[#1A1D1F] bg-[#F0FDF4] text-[#44A08D] px-2 py-1 rounded inline-block">{val(values.role)}</span></div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed border-[#E0E0E2]">
                            {values.role === 'BTR' && (
                                <>
                                    <div><span className="text-[#6E7191] block mb-1">Course</span><span className="font-medium">{val(values.courseId)}</span></div>
                                    <div><span className="text-[#6E7191] block mb-1">Mode</span><span className="font-medium">{val(values.mode)}</span></div>
                                    <div><span className="text-[#6E7191] block mb-1">Location</span><span className="font-medium">{val(values.city)}, {val(values.country)}</span></div>
                                    <div><span className="text-[#6E7191] block mb-1">Fees</span><span className="font-medium">{val(values.totalFees)}</span></div>
                                </>
                            )}

                            {values.role === 'TRN' && (
                                <>
                                    <div><span className="text-[#6E7191] block mb-1">Type</span><span className="font-medium">{val(values.employmentType)}</span></div>
                                    <div><span className="text-[#6E7191] block mb-1">Exp</span><span className="font-medium">{val(values.experienceYears)} Years</span></div>
                                    <div className="col-span-2"><span className="text-[#6E7191] block mb-1">Stack</span><span className="font-medium">{values.stack?.join(', ') || '-'}</span></div>
                                </>
                            )}

                            {['ADM', 'SAM', 'STF', 'BTC', 'PLO', 'CON'].includes(values.role || '') && (
                                <>
                                    <div><span className="text-[#6E7191] block mb-1">Department</span><span className="font-medium">{val((values as any).department)}</span></div>
                                    <div><span className="text-[#6E7191] block mb-1">Designation</span><span className="font-medium">{val((values as any).designation)}</span></div>
                                    <div><span className="text-[#6E7191] block mb-1">Location</span><span className="font-medium">{val((values as any).location)}</span></div>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
