import { z } from 'zod';

// --- Shared Schemas ---
export const phoneSchema = z.string().min(10, "Phone number must be at least 10 digits").optional().or(z.literal(''));

// --- Step 1: Identity ---
export const identitySchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: phoneSchema,
    countryCode: z.string().default('+91').optional(),
    // Additional global fields
    sendInvite: z.boolean().default(true),
    requirePasswordChange: z.boolean().default(true),
    reason: z.string().optional(),
});

export type IdentityFormValues = z.infer<typeof identitySchema>;

// --- Step 2: Role ---
export const UserRoleEnum = z.enum([
    'ADM', // Admin
    'SAM', // Super Admin
    'STF', // Staff
    'TRN', // Trainer
    'BTR', // Student (Batch Trainee?)
    'PLO', // Placement Officer
    'BTC', // Batch Coordinator
    'CON'  // Consultant
]);

export type UserRole = z.infer<typeof UserRoleEnum>;

export const roleSelectionSchema = z.object({
    role: UserRoleEnum,
});

export type RoleSelectionFormValues = z.infer<typeof roleSelectionSchema>;

// --- Step 3: Role Specific Schemas ---

// Student Schema (BTR)
export const studentSchema = z.object({
    role: z.literal('BTR'),
    courseId: z.coerce.number().min(1, "Course is required"),
    mode: z.string().min(1, "Mode is required"), // mode_of_class
    weekType: z.string().min(1, "Week type is required"), // week_type
    // re-declare phone & other shared fields if needed, but intersection handles top-level
    alternatePhone: phoneSchema,
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    consultant: z.coerce.number().optional(), // ID
    sourceOfJoining: z.coerce.number().optional(), // ID
    trainerId: z.coerce.number().optional(), // ID
    batchId: z.string().optional(), // ID or string? Prompt says "batches[id, batch_id]" but payload uses "batch_id": "W05AA". Let's assume string code for now or ID. The payload example says "W05AA", which looks like a code, but the valid valid options list has "id". I will use string for validation but we might need to send ID or Code. Defaulting to String for batch_id code.
    // Payment
    totalFees: z.coerce.number().min(0).optional(),
    amountPaid: z.coerce.number().min(0).optional(),
    paymentSchedule: z.array(z.object({
        amount: z.coerce.number(),
        date: z.string(), // YYYY-MM-DD
    })).max(4, "Maximum 4 EMI entries allowed").optional(),
});

// Trainer Schema (TRN)
export const trainerSchema = z.object({
    role: z.literal('TRN'),
    employmentType: z.string().min(1, "Employment type is required"),
    experienceYears: z.coerce.number().min(0),
    startTime: z.string().optional(), // Legacy, keeping for now or removing? The new payload needs timing_slots.
    endTime: z.string().optional(),
    trainingMode: z.string().optional(),

    // New structures
    timingSlots: z.array(z.object({
        startTime: z.string(),
        endTime: z.string(),
        mode: z.string(),
        availability: z.string() // WD/WE
    })).optional(),

    commercials: z.array(z.object({
        type: z.string(),
        rate: z.coerce.number()
    })).optional(),

    // Legacy fields to be mapped or removed if unused
    stack: z.array(z.string()).optional(), // "Don't render Trainer stack_ids for now"
    demoLink: z.string().url().optional().or(z.literal('')),
    location: z.string().optional(),
});

// Staff / Admin / Others Schema
export const staffSchema = z.object({
    role: z.enum(['ADM', 'SAM', 'STF', 'BTC', 'PLO', 'CON']),
    department: z.string().optional(),
    designation: z.string().optional(),
    location: z.string().optional(),
});

// Discriminated Union for Step 3
export const dynamicRoleSchema = z.discriminatedUnion('role', [
    studentSchema,
    trainerSchema,
    staffSchema
]);

export type RoleSpecificValues = z.infer<typeof dynamicRoleSchema>;


// --- Combined Schema for Final Submission ---
export const wizardSchema = z.intersection(
    identitySchema,
    dynamicRoleSchema
);

export type WizardFormValues = z.infer<typeof wizardSchema>;
