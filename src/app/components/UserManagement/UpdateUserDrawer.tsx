import { useState, useEffect } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter
} from '../ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import {
    User,
    Shield,
    Clock,
    History,
    Save,
    AlertTriangle,
    RotateCcw,
    CheckCircle2,
    XCircle,
    Mail,
    Smartphone,
    MapPin,
    Calendar,
    Building
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    joinDate: string;
    avatar?: string;
}

interface UpdateUserDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    onUserUpdated?: () => void;
}

export function UpdateUserDrawer({ open, onOpenChange, user, onUserUpdated }: UpdateUserDrawerProps) {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);

    if (!user) return null;

    const handleSave = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success("Profile updated successfully");
            onUserUpdated?.();
            onOpenChange(false);
        }, 1000);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md md:max-w-2xl overflow-y-auto">
                <SheetHeader className="pb-4 border-b border-[#E0E0E2]">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] flex items-center justify-center text-white text-2xl font-bold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <SheetTitle className="text-xl text-[#1A1D1F]">{user.name}</SheetTitle>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-[#6E7191] font-normal border-[#E0E0E2]">ID: {user.id}</Badge>
                                <Badge className={
                                    user.status === 'active' ? 'bg-[#F0FDF4] text-[#4ECDC4] hover:bg-[#F0FDF4] border border-[#4ECDC4]/20' :
                                        user.status === 'inactive' ? 'bg-[#FFF5F7] text-[#FF6B9D] hover:bg-[#FFF5F7] border border-[#FF6B9D]/20' :
                                            'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200'
                                }>
                                    {user.status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </SheetHeader>

                <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="mt-6">
                    <TabsList className="grid w-full grid-cols-4 bg-[#F7F7F8]">
                        <TabsTrigger
                            value="profile"
                            className="data-[state=active]:bg-[#1A1D1F] data-[state=active]:text-white"
                        >
                            Profile
                        </TabsTrigger>
                        <TabsTrigger
                            value="roles"
                            className="data-[state=active]:bg-[#1A1D1F] data-[state=active]:text-white"
                        >
                            Roles
                        </TabsTrigger>
                        <TabsTrigger
                            value="access"
                            className="data-[state=active]:bg-[#1A1D1F] data-[state=active]:text-white"
                        >
                            Access
                        </TabsTrigger>
                        <TabsTrigger
                            value="history"
                            className="data-[state=active]:bg-[#1A1D1F] data-[state=active]:text-white"
                        >
                            History
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="space-y-6 mt-6 animate-in fade-in slide-in-from-right-2 duration-300">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[#1A1D1F]">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-[#6E7191]" size={16} />
                                    <Input defaultValue={user.name} className="pl-9 border-[#E0E0E2] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[#1A1D1F]">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-[#6E7191]" size={16} />
                                    <Input defaultValue={user.email} className="pl-9 bg-[#F7F7F8] border-[#E0E0E2]" disabled />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[#1A1D1F]">Phone</Label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-3 text-[#6E7191]" size={16} />
                                    <Input placeholder="+1 (555) 000-0000" className="pl-9 border-[#E0E0E2] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[#1A1D1F]">Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-[#6E7191]" size={16} />
                                    <Input placeholder="City, Country" className="pl-9 border-[#E0E0E2] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[#1A1D1F]">Department</Label>
                            <div className="relative">
                                <Building className="absolute left-3 top-3 text-[#6E7191]" size={16} />
                                <Input placeholder="Engineering" className="pl-9 border-[#E0E0E2] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20" />
                            </div>
                        </div>

                        <div className="p-4 bg-[#F7F7F8] rounded-xl border border-[#E0E0E2] space-y-3">
                            <h4 className="text-sm font-semibold text-[#1A1D1F]">Metadata</h4>
                            <div className="grid grid-cols-2 gap-4 text-xs text-[#6E7191]">
                                <div>
                                    <span className="block mb-1">Joined Date</span>
                                    <span className="text-[#1A1D1F] font-medium flex items-center gap-1">
                                        <Calendar size={12} />
                                        {user.joinDate}
                                    </span>
                                </div>
                                <div>
                                    <span className="block mb-1">Last Login</span>
                                    <span className="text-[#1A1D1F] font-medium flex items-center gap-1">
                                        <Clock size={12} />
                                        2 hours ago
                                    </span>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Roles Tab */}
                    <TabsContent value="roles" className="space-y-6 mt-6 animate-in fade-in slide-in-from-right-2 duration-300">
                        <div className="space-y-4">
                            <div className="bg-[#F0FDF4] border border-[#4ECDC4]/20 p-4 rounded-xl flex items-start gap-3">
                                <Shield className="text-[#4ECDC4] mt-1" size={20} />
                                <div>
                                    <h4 className="text-[#1A1D1F] font-medium">Current Role: {user.role}</h4>
                                    <p className="text-sm text-[#6E7191] mt-1">
                                        User has elevated privileges. changing roles might affect their access to ongoing courses.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[#1A1D1F]">Change Role</Label>
                                <select className="w-full h-10 px-3 rounded-xl border border-[#E0E0E2] bg-white text-sm focus:outline-none focus:border-[#4ECDC4]">
                                    <option value="Admin">Admin</option>
                                    <option value="Instructor">Instructor</option>
                                    <option value="Student">Student</option>
                                </select>
                            </div>

                            <div className="border border-[#E0E0E2] rounded-xl overflow-hidden">
                                <div className="bg-[#F7F7F8] px-4 py-2 border-b border-[#E0E0E2] text-xs font-semibold text-[#6E7191] uppercase">
                                    Permissions Preview
                                </div>
                                <div className="divide-y divide-[#E0E0E2]">
                                    {['User Management', 'Course Management', 'Financial Reports', 'System Settings'].map((perm, i) => (
                                        <div key={i} className="px-4 py-3 flex items-center justify-between text-sm text-[#1A1D1F]">
                                            <span>{perm}</span>
                                            {i < 3 ? (
                                                <span className="text-green-700 flex items-center gap-1 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">
                                                    <CheckCircle2 size={12} /> Granted
                                                </span>
                                            ) : (
                                                <span className="text-[#6E7191] flex items-center gap-1 text-xs font-medium bg-[#F7F7F8] px-2 py-1 rounded-full">
                                                    <XCircle size={12} /> Denied
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Access Tab (Mock) */}
                    <TabsContent value="access" className="space-y-6 mt-6 animate-in fade-in slide-in-from-right-2 duration-300">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-[#E0E0E2] rounded-xl hover:bg-[#F7F7F8] transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#F7F7F8] rounded-full flex items-center justify-center">
                                        <RotateCcw size={20} className="text-[#6E7191]" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-[#1A1D1F]">Reset Password</p>
                                        <p className="text-xs text-[#6E7191]">Send password reset email</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="border-[#E0E0E2] text-[#6E7191]">Send Email</Button>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-[#E0E0E2] rounded-xl hover:bg-[#F7F7F8] transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#FFF5F7] rounded-full flex items-center justify-center">
                                        <AlertTriangle size={20} className="text-[#FF6B9D]" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-[#1A1D1F]">Force Logout</p>
                                        <p className="text-xs text-[#6E7191]">Revoke all active sessions</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="text-[#FF6B9D] border-[#FF6B9D]/20 hover:bg-[#FFF5F7]">Revoke</Button>
                            </div>
                        </div>
                    </TabsContent>

                    {/* History Tab (Mock) */}
                    <TabsContent value="history" className="space-y-6 mt-6 animate-in fade-in slide-in-from-right-2 duration-300">
                        <div className="relative space-y-6 pl-4 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E0E0E2]">
                            {[
                                { action: 'Role Updated', desc: 'Changed from Student to Instructor', date: '2 days ago', user: 'Admin' },
                                { action: 'Profile Updated', desc: 'Phone number verified', date: '1 week ago', user: 'System' },
                                { action: 'Account Created', desc: 'User registered via email', date: '1 month ago', user: 'Admin' },
                            ].map((log, i) => (
                                <div key={i} className="relative pl-6">
                                    <div className="absolute left-[-5px] top-1 w-[22px] h-[22px] bg-white border-2 border-[#E0E0E2] rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-[#6E7191] rounded-full" />
                                    </div>
                                    <div className="bg-[#F7F7F8] p-3 rounded-xl border border-[#E0E0E2]">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-medium text-[#1A1D1F] text-sm">{log.action}</span>
                                            <span className="text-xs text-[#6E7191]">{log.date}</span>
                                        </div>
                                        <p className="text-xs text-[#6E7191] mb-2">{log.desc}</p>
                                        <div className="flex items-center gap-1 text-[10px] text-[#6E7191] uppercase tracking-wider">
                                            <User size={10} />
                                            By {log.user}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                <SheetFooter className="mt-6 pt-4 border-t border-[#E0E0E2]">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="border-[#E0E0E2] text-[#6E7191] hover:bg-[#F7F7F8]">Cancel</Button>
                    <Button onClick={handleSave} disabled={loading} className="bg-[#1A1D1F] text-white hover:bg-[#1A1D1F]/90">
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
