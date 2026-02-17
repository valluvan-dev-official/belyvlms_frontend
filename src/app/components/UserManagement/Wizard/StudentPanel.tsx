import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Button } from '../../ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Country, State, City } from 'country-state-city';
import { useMemo } from 'react';
import { OnboardingOptions } from '../../../services/RbacService/RbacService';

interface StudentPanelProps {
    options: OnboardingOptions | null;
}

export function StudentPanel({ options }: StudentPanelProps) {
    const { register, control, watch, setValue, formState: { errors } } = useFormContext();

    // Watch location fields for cascading
    const selectedCountry = watch('country');
    const selectedState = watch('state');
    const selectedCourseId = watch('courseId');

    // Payment Schedule Field Array
    const { fields, append, remove } = useFieldArray({
        control,
        name: "paymentSchedule"
    });

    const countries = useMemo(() => Country.getAllCountries(), []);
    const states = useMemo(() => selectedCountry ? State.getStatesOfCountry(selectedCountry) : [], [selectedCountry]);
    const cities = useMemo(() => selectedState ? City.getCitiesOfState(selectedCountry, selectedState) : [], [selectedCountry, selectedState]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

            {/* SECTION 1 — Course & Delivery */}
            <div className="space-y-4">
                <h3 className="font-semibold text-[#1A1D1F] border-b pb-2">Course & Delivery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Course <span className="text-red-500">*</span></Label>
                        <Controller
                            control={control}
                            name="courseId"
                            render={({ field }) => (
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options?.courses.map((c) => (
                                            <SelectItem key={c.id} value={c.id.toString()}>{c.course_name} ({c.code})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.courseId && <span className="text-xs text-red-500">Course is required</span>}
                    </div>

                    <div className="space-y-2">
                        <Label>Training Mode <span className="text-red-500">*</span></Label>
                        <Controller
                            control={control}
                            name="mode"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ONLINE">Online</SelectItem>
                                        <SelectItem value="OFFLINE">Offline</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.mode && <span className="text-xs text-red-500">Mode is required</span>}
                    </div>

                    <div className="space-y-2">
                        <Label>Week Type <span className="text-red-500">*</span></Label>
                        <Controller
                            control={control}
                            name="weekType"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="WEEKDAY">Weekday</SelectItem>
                                        <SelectItem value="WEEKEND">Weekend</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.weekType && <span className="text-xs text-red-500">Week type is required</span>}
                    </div>

                    <div className="space-y-2">
                        <Label>Batch</Label>
                        <Controller
                            control={control}
                            name="batchId"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Batch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options?.batches.map((b) => (
                                            <SelectItem key={b.id} value={b.batch_id}>{b.batch_id} ({b.status})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* SECTION 2 — Assignment */}
            <div className="space-y-4">
                <h3 className="font-semibold text-[#1A1D1F] border-b pb-2">Assignment</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Trainer</Label>
                        <Controller
                            control={control}
                            name="trainerId"
                            render={({ field }) => (
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Trainer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options?.trainers.map((t) => (
                                            <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Consultant</Label>
                        <Controller
                            control={control}
                            name="consultant"
                            render={({ field }) => (
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Consultant" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options?.consultants.map((c) => (
                                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Source</Label>
                        <Controller
                            control={control}
                            name="sourceOfJoining"
                            render={({ field }) => (
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Source" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options?.sources.map((s) => (
                                            <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* SECTION 3 — Contact & Location */}
            <div className="space-y-4">
                <h3 className="font-semibold text-[#1A1D1F] border-b pb-2">Contact & Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Alternate Phone</Label>
                        <Input {...register('alternatePhone')} placeholder="+1..." />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Country</Label>
                        <Controller
                            control={control}
                            name="country"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((c) => (
                                            <SelectItem key={c.isoCode} value={c.isoCode}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>State</Label>
                        <Controller
                            control={control}
                            name="state"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCountry}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select State" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {states.map((s) => (
                                            <SelectItem key={s.isoCode} value={s.isoCode}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>City</Label>
                        <Controller
                            control={control}
                            name="city"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value} disabled={!selectedState}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select City" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities.map((c) => (
                                            <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* SECTION 4 — Payment */}
            <div className="space-y-4">
                <h3 className="font-semibold text-[#1A1D1F] border-b pb-2">Fees & Payment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Total Fees</Label>
                        <Input type="number" {...register('totalFees', { valueAsNumber: true })} placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                        <Label>Amount Paid</Label>
                        <Input type="number" {...register('amountPaid', { valueAsNumber: true })} placeholder="0.00" />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Payment Schedule (Max 4)</Label>
                        {fields.length < 4 && (
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ amount: 0, date: '' })}>
                                <Plus size={14} className="mr-1" /> Add EMI
                            </Button>
                        )}
                    </div>
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-center">
                            <Input
                                type="number"
                                {...register(`paymentSchedule.${index}.amount` as const, { valueAsNumber: true })}
                                placeholder="Amount"
                                className="flex-1"
                            />
                            <Input
                                type="date"
                                {...register(`paymentSchedule.${index}.date` as const)}
                                className="flex-1"
                            />
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                <Trash2 size={16} className="text-red-500" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
