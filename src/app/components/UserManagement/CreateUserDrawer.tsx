import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../ui/sheet';
import { toast } from 'sonner';
import { listRoles } from "../../services/RbacService/RbacService";
import { createUser } from "../../services/ProfileService/ProfileService";
import { AddUserWizard } from './Wizard/AddUserWizard';
import { WizardFormValues } from './Wizard/types';

interface CreateUserDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated?: () => void;
}

export function CreateUserDrawer({ open, onOpenChange, onUserCreated }: CreateUserDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);

  // Fetch roles on mount
  useEffect(() => {
    if (open) {
      loadRoles();
    }
  }, [open]);

  const loadRoles = async () => {
    try {
      const data = await listRoles();
      setRoles(data || []);
    } catch (error) {
      toast.error("Failed to load roles");
    }
  };

  const handleWizardSubmit = async (data: WizardFormValues) => {
    setLoading(true);
    try {
      // Common Payload
      const payload: any = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        role_code: data.role,
        profile: {
          phone: data.phone || data.alternatePhone, // Use alternate if phone not present? Or just data.phone? Prompt says phone is in Identity.
          // Common
          country: (data as any).country,
          state: (data as any).state,
          city: (data as any).city,
        }
      };

      if (data.role === 'BTR') { // Student
        payload.profile = {
          ...payload.profile,
          mode_of_class: (data as any).mode && (data as any).mode === 'ONLINE' ? 'ON' : 'OF', // Map to ON/OF if needed? Prompt example says "ON". 
          // Wait, prompt example: "mode_of_class": "ON". Role Select says "Student... mode_of_class".
          // My select values are ONLINE/OFFLINE. I should map them.
          // Or change Select values. I'll map them here to be safe.
          // Let's assume ON/OF for now based on example "mode_of_class": "ON"
          // actually, let's use the values from the form if the backend accepts "ONLINE" too.
          // But strict mapping is safer:
          mode_of_class: (data as any).mode === 'ONLINE' ? 'ON' : (data as any).mode === 'OFFLINE' ? 'OF' : (data as any).mode,
          week_type: (data as any).weekType === 'WEEKDAY' ? 'WD' : (data as any).weekType === 'WEEKEND' ? 'WE' : (data as any).weekType,

          course_id: (data as any).courseId,
          trainer_id: (data as any).trainerId,
          batch_id: (data as any).batchId,
          consultant: (data as any).consultant,
          source_of_joining: (data as any).sourceOfJoining,

          fees_total: (data as any).totalFees,
          fees_paid: (data as any).amountPaid,
          payment_schedule: (data as any).paymentSchedule?.map((p: any) => ({
            amount: p.amount,
            date: p.date
          }))
        };
      } else if (data.role === 'TRN') { // Trainer
        payload.profile = {
          ...payload.profile,
          employment_type: (data as any).employmentType === 'FULL_TIME' ? 'FT' : 'FL', // Mapping FT/FL
          years_of_experience: (data as any).experienceYears,
          timing_slots: (data as any).timingSlots?.map((slot: any) => ({
            start_time: slot.startTime,
            end_time: slot.endTime,
            mode: slot.mode,
            availability: slot.availability
          })),
          commercials: (data as any).commercials
        };
      } else { // Staff/Admin/Other
        payload.profile = {
          ...payload.profile,
          department: (data as any).department,
          designation: (data as any).designation,
          location: (data as any).location
        };
      }

      // Clean up undefined values from profile
      Object.keys(payload.profile).forEach(key =>
        payload.profile[key] === undefined && delete payload.profile[key]
      );

      await createUser(payload);
      toast.success("User created successfully");
      onUserCreated?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error(error);
      const msg = error?.response?.data?.detail || error?.response?.data?.message || "Failed to create user";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md md:max-w-2xl overflow-y-auto p-0">
        <div className="p-6 h-full flex flex-col">
          <SheetHeader className="mb-6 shrink-0">
            <SheetTitle className="text-2xl font-bold text-[#1A1D1F]">Create User</SheetTitle>
            <SheetDescription className="text-[#6E7191]">
              Add a new user to the system. Follow the steps to configure role-based access.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-hidden flex flex-col">
            <AddUserWizard
              roles={roles}
              onSubmit={handleWizardSubmit}
              onCancel={() => onOpenChange(false)}
              isLoading={loading}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
