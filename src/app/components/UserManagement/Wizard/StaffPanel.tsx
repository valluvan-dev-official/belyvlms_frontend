import { useFormContext } from 'react-hook-form';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

export function StaffPanel() {
    const { register, setValue, formState: { errors } } = useFormContext();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-4">
                <h3 className="font-semibold text-[#1A1D1F] border-b pb-2">Organization Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Department <span className="text-red-500">*</span></Label>
                        <Select onValueChange={(val) => setValue('department', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="engineering">Engineering</SelectItem>
                                <SelectItem value="product">Product</SelectItem>
                                <SelectItem value="design">Design</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="sales">Sales</SelectItem>
                                <SelectItem value="hr">Human Resources</SelectItem>
                                <SelectItem value="operations">Operations</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.department && <span className="text-xs text-red-500">Required</span>}
                    </div>

                    <div className="space-y-2">
                        <Label>Designation <span className="text-red-500">*</span></Label>
                        <Input {...register('designation')} placeholder="e.g. Senior Manager" />
                        {errors.designation && <span className="text-xs text-red-500">Required</span>}
                    </div>

                    <div className="space-y-2">
                        <Label>Base Location <span className="text-red-500">*</span></Label>
                        <Select onValueChange={(val) => setValue('location', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Location" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ny">New York, USA</SelectItem>
                                <SelectItem value="sf">San Francisco, USA</SelectItem>
                                <SelectItem value="ldn">London, UK</SelectItem>
                                <SelectItem value="mum">Mumbai, India</SelectItem>
                                <SelectItem value="rem">Remote</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.location && <span className="text-xs text-red-500">Required</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}
