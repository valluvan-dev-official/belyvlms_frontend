import { useFormContext, Controller } from 'react-hook-form';
import { User, Mail, Phone, Globe } from 'lucide-react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { IdentityFormValues } from './types';

export function IdentityStep() {
    const { register, control, formState: { errors } } = useFormContext<IdentityFormValues>();

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-[#1A1D1F]">First Name <span className="text-[#FF6B9D]">*</span></Label>
                    <div className="relative">
                        <User size={16} className="absolute left-3 top-3 text-[#6E7191]" />
                        <Input
                            id="firstName"
                            placeholder="John"
                            className={`pl-9 border-[#E0E0E2] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20 ${errors.firstName ? 'border-red-500' : ''}`}
                            {...register('firstName')}
                        />
                    </div>
                    {errors.firstName && <span className="text-xs text-red-500">{errors.firstName.message}</span>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-[#1A1D1F]">Last Name <span className="text-[#FF6B9D]">*</span></Label>
                    <Input
                        id="lastName"
                        placeholder="Doe"
                        className={`border-[#E0E0E2] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20 ${errors.lastName ? 'border-red-500' : ''}`}
                        {...register('lastName')}
                    />
                    {errors.lastName && <span className="text-xs text-red-500">{errors.lastName.message}</span>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email" className="text-[#1A1D1F]">Email Address <span className="text-[#FF6B9D]">*</span></Label>
                <div className="relative">
                    <Mail size={16} className="absolute left-3 top-3 text-[#6E7191]" />
                    <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@company.com"
                        className={`pl-9 border-[#E0E0E2] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20 ${errors.email ? 'border-red-500' : ''}`}
                        {...register('email')}
                    />
                </div>
                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#1A1D1F]">Phone Number</Label>
                <div className="flex gap-2">
                    <Controller
                        control={control}
                        name="countryCode"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-[100px] border-[#E0E0E2]">
                                    <SelectValue placeholder="+91" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="+91">+91</SelectItem>
                                    <SelectItem value="+1">+1</SelectItem>
                                    <SelectItem value="+44">+44</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <div className="relative flex-1">
                        <Phone size={16} className="absolute left-3 top-3 text-[#6E7191]" />
                        <Controller
                            control={control}
                            name="phone"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="phone"
                                    placeholder="9876543210"
                                    className={`pl-9 border-[#E0E0E2] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20 ${errors.phone ? 'border-red-500' : ''}`}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                                        field.onChange(value);
                                    }}
                                    value={field.value || ''}
                                    maxLength={15}
                                />
                            )}
                        />
                    </div>
                </div>
                {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
            </div>
        </div>
    );
}
