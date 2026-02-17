import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Input } from '../ui/input';
import {
    AlertTriangle,
    Archive,
    Users,
    BookOpen,
    ArrowRight,
    ShieldAlert,
    Calendar
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface DeactivateUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    onUserDeactivated?: () => void;
}

export function DeactivateUserModal({ open, onOpenChange, user, onUserDeactivated }: DeactivateUserModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [actionType, setActionType] = useState('suspend');
    const [reason, setReason] = useState('');
    const [confirmText, setConfirmText] = useState('');

    if (!user) return null;

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleDeactivate = async () => {
        if (actionType === 'delete' && confirmText !== 'DELETE') return;

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success(actionType === 'delete' ? "User permanently deleted" : "User deactivated successfully");
            onUserDeactivated?.();
            onOpenChange(false);
            setStep(1);
            setReason('');
            setConfirmText('');
        }, 1500);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <DialogTitle>Deactivate User Account</DialogTitle>
                            <DialogDescription>
                                Review impact and choose deactivation method for <strong>{user.name}</strong>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {step === 1 ? (
                    <div className="py-4 space-y-6">
                        {/* Impact Analysis */}
                        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-red-900 mb-3">
                                <ShieldAlert size={16} />
                                Impact Analysis
                            </h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white p-3 rounded-lg border border-red-100 text-center">
                                    <div className="text-2xl font-bold text-red-700">12</div>
                                    <div className="text-xs text-red-600 font-medium mt-1">Active Sessions</div>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-red-100 text-center">
                                    <div className="text-2xl font-bold text-red-700">5</div>
                                    <div className="text-xs text-red-600 font-medium mt-1">Assigned Courses</div>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-red-100 text-center">
                                    <div className="text-2xl font-bold text-red-700">3</div>
                                    <div className="text-xs text-red-600 font-medium mt-1">Pending Tasks</div>
                                </div>
                            </div>
                            <p className="text-xs text-red-700 mt-3">
                                Deactivating this user will revoke access immediately. Active sessions will be terminated.
                            </p>
                        </div>

                        {/* Ownership Transfer (Mock) */}
                        <div className="space-y-3">
                            <Label>Transfer Assets To (Optional)</Label>
                            <div className="relative">
                                <Users size={16} className="absolute left-3 top-3 text-gray-400" />
                                <Input placeholder="Select a user to transfer courses/files..." className="pl-9" />
                            </div>
                            <p className="text-xs text-gray-500">Unassigned assets will be moved to system admin.</p>
                        </div>

                        <RadioGroup value={actionType} onValueChange={setActionType} className="grid grid-cols-2 gap-4">
                            <div>
                                <RadioGroupItem value="suspend" id="suspend" className="peer sr-only" />
                                <Label
                                    htmlFor="suspend"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#1A1D1F] [&:has([data-state=checked])]:border-[#1A1D1F] cursor-pointer"
                                >
                                    <Archive className="mb-2 h-6 w-6 text-gray-500" />
                                    <span className="font-semibold text-sm">Suspend User</span>
                                    <span className="text-xs text-center text-gray-500 mt-1">Temporary lock account. Data retained.</span>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="delete" id="delete" className="peer sr-only" />
                                <Label
                                    htmlFor="delete"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-red-500 [&:has([data-state=checked])]:border-red-500 cursor-pointer"
                                >
                                    <AlertTriangle className="mb-2 h-6 w-6 text-red-500" />
                                    <span className="font-semibold text-sm text-red-600">Delete Permanently</span>
                                    <span className="text-xs text-center text-gray-500 mt-1">Irreversible action. Data wiped.</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                ) : (
                    <div className="py-4 space-y-6">
                        <div className={`p-4 rounded-xl border ${actionType === 'delete' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                            <h4 className={`font-semibold ${actionType === 'delete' ? 'text-red-900' : 'text-gray-900'} mb-1`}>
                                Confirm {actionType === 'delete' ? 'Deletion' : 'Suspension'}
                            </h4>
                            <p className="text-sm text-gray-600">
                                Please provide a reason for this action. This will be logged in the audit trail.
                                {actionType === 'delete' && " This action cannot be undone."}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Reason for Action <span className="text-red-500">*</span></Label>
                                <Input
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="e.g. Employee left organization"
                                />
                            </div>

                            {actionType === 'suspend' && (
                                <div className="space-y-2">
                                    <Label>Scheduled Reactivation (Optional)</Label>
                                    <div className="relative">
                                        <Calendar size={16} className="absolute left-3 top-3 text-gray-400" />
                                        <Input type="date" className="pl-9" />
                                    </div>
                                </div>
                            )}

                            {actionType === 'delete' && (
                                <div className="space-y-2">
                                    <Label>Type <span className="font-mono font-bold">DELETE</span> to confirm</Label>
                                    <Input
                                        value={confirmText}
                                        onChange={(e) => setConfirmText(e.target.value)}
                                        placeholder="DELETE"
                                        className="border-red-300 focus:border-red-500"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <DialogFooter>
                    {step === 1 ? (
                        <>
                            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button onClick={handleNext}>
                                Next Step
                                <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={handleBack}>Back</Button>
                            <Button
                                variant={actionType === 'delete' ? "destructive" : "default"}
                                onClick={handleDeactivate}
                                disabled={!reason || loading || (actionType === 'delete' && confirmText !== 'DELETE')}
                            >
                                {loading ? 'Processing...' : (actionType === 'delete' ? 'Delete User' : 'Suspend User')}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
