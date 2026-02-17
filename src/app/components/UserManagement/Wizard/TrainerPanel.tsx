import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Button } from '../../ui/button';
import { Plus, Trash2 } from 'lucide-react';

export function TrainerPanel() {
    const { register, control, formState: { errors } } = useFormContext();

    // Timing Slots Field Array
    const { fields: timingFields, append: appendTiming, remove: removeTiming } = useFieldArray({
        control,
        name: "timingSlots"
    });

    // Commercials Field Array
    const { fields: commercialFields, append: appendCommercial, remove: removeCommercial } = useFieldArray({
        control,
        name: "commercials"
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

            {/* SECTION 1 — Employment Details */}
            <div className="space-y-4">
                <h3 className="font-semibold text-[#1A1D1F] border-b pb-2">Employment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Employment Type <span className="text-red-500">*</span></Label>
                        <Controller
                            control={control}
                            name="employmentType"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FT">Full Time</SelectItem>
                                        <SelectItem value="FL">Freelancer</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.employmentType && <span className="text-xs text-red-500">Required</span>}
                    </div>
                    <div className="space-y-2">
                        <Label>Years of Experience</Label>
                        <Input type="number" {...register('experienceYears', { valueAsNumber: true })} placeholder="e.g. 5" />
                        {errors.experienceYears && <span className="text-xs text-red-500">Required</span>}
                    </div>
                </div>
            </div>

            {/* SECTION 2 — Availability & Timing */}
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-semibold text-[#1A1D1F]">Availability & Timing</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendTiming({ startTime: '', endTime: '', mode: 'Online', availability: 'WD' })}>
                        <Plus size={14} className="mr-1" /> Add Slot
                    </Button>
                </div>

                <div className="space-y-3">
                    {timingFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-gray-50 p-3 rounded-md relative group">
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500">Start Time</Label>
                                <Input type="time" {...register(`timingSlots.${index}.startTime` as const)} className="h-8 text-sm" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500">End Time</Label>
                                <Input type="time" {...register(`timingSlots.${index}.endTime` as const)} className="h-8 text-sm" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500">Mode</Label>
                                <Controller
                                    control={control}
                                    name={`timingSlots.${index}.mode` as const}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="Mode" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Online">Online</SelectItem>
                                                <SelectItem value="Offline">Offline</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div className="space-y-1 flex gap-1">
                                <div className="flex-1">
                                    <Label className="text-xs text-gray-500">Type</Label>
                                    <Controller
                                        control={control}
                                        name={`timingSlots.${index}.availability` as const}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="Day" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="WD">Weekday</SelectItem>
                                                    <SelectItem value="WE">Weekend</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 mt-5 self-start text-red-500 hover:text-red-700" onClick={() => removeTiming(index)}>
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {timingFields.length === 0 && <p className="text-sm text-gray-400 italic">No timing slots added.</p>}
                </div>
            </div>

            {/* SECTION 3 — Commercials */}
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-semibold text-[#1A1D1F]">Commercials</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendCommercial({ type: 'hourly', rate: 0 })}>
                        <Plus size={14} className="mr-1" /> Add Rate
                    </Button>
                </div>

                <div className="space-y-3">
                    {commercialFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-end bg-gray-50 p-3 rounded-md">
                            <div className="flex-1 space-y-1">
                                <Label className="text-xs text-gray-500">Type</Label>
                                <Controller
                                    control={control}
                                    name={`commercials.${index}.type` as const}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="h-9">
                                                <SelectValue placeholder="Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="hourly">Hourly</SelectItem>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                                <SelectItem value="course">Per Course</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div className="flex-1 space-y-1">
                                <Label className="text-xs text-gray-500">Rate</Label>
                                <Input type="number" {...register(`commercials.${index}.rate` as const, { valueAsNumber: true })} placeholder="Amount" className="h-9" />
                            </div>
                            <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:text-red-700" onClick={() => removeCommercial(index)}>
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    ))}
                    {commercialFields.length === 0 && <p className="text-sm text-gray-400 italic">No commercial rates added.</p>}
                </div>
            </div>

        </div>
    );
}
