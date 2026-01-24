import { useState } from 'react';
import { 
  AlertTriangle, 
  ArrowLeft, 
  Users, 
  Key, 
  CheckCircle2,
  Shield,
  ArrowRight,
  Lock,
  XCircle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Role {
  id: string;
  name: string;
  code: string;
  userCount: number;
  color: string;
}

const allRoles: Role[] = [
  { id: 'admin', name: 'Admin', code: 'ADM', userCount: 5, color: '#6366F1' },
  { id: 'trainer', name: 'Trainer', code: 'TRN', userCount: 28, color: '#F59E0B' },
  { id: 'student', name: 'Student', code: 'STD', userCount: 342, color: '#4ECDC4' },
  { id: 'staff', name: 'Staff', code: 'STF', userCount: 15, color: '#FF6B9D' },
  { id: 'manager', name: 'Manager', code: 'MGR', userCount: 12, color: '#10B981' },
];

export function RoleDeactivationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role as Role;

  const [currentStep, setCurrentStep] = useState(1);
  const [mitigationStrategy, setMitigationStrategy] = useState<'fallback' | 'reassign'>('reassign');
  const [targetRoleId, setTargetRoleId] = useState<string>('');
  const [deactivationReason, setDeactivationReason] = useState<string>('');
  const [confirmText, setConfirmText] = useState<string>('');
  const [notifyUsers, setNotifyUsers] = useState(true);
  const [generateReport, setGenerateReport] = useState(true);

  const permissionCount = role?.id === 'admin' ? 21 : role?.id === 'trainer' ? 12 : 6;

  const handleConfirmDeactivation = () => {
    console.log('Deactivating role:', {
      role,
      mitigationStrategy,
      targetRoleId,
      deactivationReason,
      notifyUsers,
      generateReport
    });
    navigate('/settings/access-control', { state: { tab: 'roles' } });
  };

  if (!role) {
    navigate('/settings/access-control');
    return null;
  }

  const canProceedToStep2 = true;
  const canProceedToStep3 = mitigationStrategy === 'fallback' || (mitigationStrategy === 'reassign' && targetRoleId);
  const canConfirm = deactivationReason.trim() && confirmText === `DEACTIVATE ${role.code}`;

  const steps = [
    { number: 1, title: 'Impact Review', description: 'Understand what will change' },
    { number: 2, title: 'Mitigation Strategy', description: 'Choose how to handle users' },
    { number: 3, title: 'Confirmation', description: 'Review and confirm action' }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <button
            onClick={() => navigate('/settings/access-control', { state: { tab: 'roles' } })}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#4ECDC4] transition-colors mb-4 text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to Access Control
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FEE2E2] to-[#FECACA] flex items-center justify-center">
                <Lock size={24} className="text-[#DC2626]" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-[#111827]">
                  Deactivate Role
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-[#6B7280]">{role.name}</span>
                  <span className="text-[#D1D5DB]">•</span>
                  <div 
                    className="px-2 py-0.5 rounded text-xs font-bold text-white"
                    style={{ backgroundColor: role.color }}
                  >
                    {role.code}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-3">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      currentStep === step.number
                        ? 'bg-[#4ECDC4] text-white shadow-lg shadow-[#4ECDC4]/30'
                        : currentStep > step.number
                        ? 'bg-[#10B981] text-white'
                        : 'bg-[#F3F4F6] text-[#9CA3AF]'
                    }`}>
                      {currentStep > step.number ? <CheckCircle2 size={16} /> : step.number}
                    </div>
                    <div className="hidden xl:block">
                      <div className={`text-xs font-medium ${
                        currentStep >= step.number ? 'text-[#111827]' : 'text-[#9CA3AF]'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 ${
                      currentStep > step.number ? 'bg-[#10B981]' : 'bg-[#E5E7EB]'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Step 1: Impact Review */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Critical Warning Banner */}
            <div className="bg-gradient-to-r from-[#FEF2F2] to-[#FEE2E2] border-l-4 border-[#DC2626] rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#DC2626] rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-[#991B1B] mb-2">
                    Critical Action: Irreversible Role Deactivation
                  </h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    Deactivating the <span className="font-semibold text-[#111827]">{role.name}</span> role will 
                    immediately affect <span className="font-semibold text-[#DC2626]">{role.userCount} active users</span> and 
                    revoke <span className="font-semibold text-[#DC2626]">{permissionCount} permissions</span>. 
                    This action will be permanently logged in the audit trail.
                  </p>
                </div>
              </div>
            </div>

            {/* Impact Cards */}
            <div className="grid grid-cols-2 gap-6">
              {/* Users Impact */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] rounded-2xl flex items-center justify-center">
                    <Users size={28} className="text-[#2563EB]" />
                  </div>
                  <div className="px-3 py-1 bg-[#FEF2F2] text-[#DC2626] rounded-lg text-xs font-semibold">
                    High Impact
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-4xl font-bold text-[#111827] mb-1">{role.userCount}</div>
                  <div className="text-sm font-medium text-[#6B7280]">Users Will Be Affected</div>
                </div>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  All users with this role will need to be reassigned. They will lose access until a new role is assigned.
                </p>
              </div>

              {/* Permissions Impact */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#FEE2E2] to-[#FECACA] rounded-2xl flex items-center justify-center">
                    <Key size={28} className="text-[#DC2626]" />
                  </div>
                  <div className="px-3 py-1 bg-[#FEF2F2] text-[#DC2626] rounded-lg text-xs font-semibold">
                    Critical
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-4xl font-bold text-[#111827] mb-1">{permissionCount}</div>
                  <div className="text-sm font-medium text-[#6B7280]">Permissions Will Be Revoked</div>
                </div>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  All permissions associated with this role will be immediately revoked from all assigned users.
                </p>
              </div>
            </div>

            {/* Role Details */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
              <h3 className="text-sm font-semibold text-[#111827] mb-4">Role Being Deactivated</h3>
              <div className="flex items-center gap-4 p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg"
                  style={{ backgroundColor: role.color }}
                >
                  {role.code}
                </div>
                <div className="flex-1">
                  <div className="text-base font-semibold text-[#111827]">{role.name}</div>
                  <div className="text-sm text-[#6B7280] mt-1">
                    {role.userCount} active users • {permissionCount} permissions
                  </div>
                </div>
                <div className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg">
                  <div className="text-xs text-[#6B7280] mb-1">Status</div>
                  <div className="text-sm font-semibold text-[#DC2626]">Will Be Deactivated</div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-5">
              <div className="flex gap-3">
                <Shield size={20} className="text-[#2563EB] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-[#1E40AF] mb-1">Before You Proceed</h4>
                  <ul className="text-xs text-[#6B7280] space-y-1.5 leading-relaxed">
                    <li>• Ensure you have a backup of current role assignments</li>
                    <li>• Verify that affected users have been notified</li>
                    <li>• Confirm you have the necessary permissions to perform this action</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Mitigation Strategy */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#111827] mb-2">Choose Mitigation Strategy</h2>
                <p className="text-sm text-[#6B7280]">
                  Select how to handle the {role.userCount} users currently assigned to this role
                </p>
              </div>

              <div className="space-y-4">
                {/* Reassign Option */}
                <button
                  onClick={() => setMitigationStrategy('reassign')}
                  className={`w-full p-6 rounded-xl border-2 text-left transition-all group ${
                    mitigationStrategy === 'reassign'
                      ? 'border-[#4ECDC4] bg-[#F0FDFA] shadow-md'
                      : 'border-[#E5E7EB] bg-white hover:border-[#4ECDC4] hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      mitigationStrategy === 'reassign'
                        ? 'border-[#4ECDC4] bg-[#4ECDC4]'
                        : 'border-[#D1D5DB] group-hover:border-[#4ECDC4]'
                    }`}>
                      {mitigationStrategy === 'reassign' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-base font-semibold text-[#111827]">
                          Reassign to Specific Role
                        </h4>
                        <span className="px-2.5 py-1 bg-[#FEF3C7] text-[#92400E] rounded-md text-xs font-medium">
                          Recommended
                        </span>
                      </div>
                      <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
                        Manually select a destination role for all affected users. Best for role consolidation 
                        or when you have a specific replacement role in mind.
                      </p>
                      
                      {mitigationStrategy === 'reassign' && (
                        <div className="mt-4 pt-4 border-t border-[#E5E7EB] animate-in fade-in slide-in-from-top-2 duration-300">
                          <label className="block text-sm font-semibold text-[#111827] mb-3">
                            Select Destination Role
                          </label>
                          <select
                            value={targetRoleId}
                            onChange={(e) => setTargetRoleId(e.target.value)}
                            className="w-full px-4 py-3.5 bg-white border-2 border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#4ECDC4] focus:ring-4 focus:ring-[#4ECDC4]/10 transition-all"
                          >
                            <option value="">Choose a role...</option>
                            {allRoles
                              .filter(r => r.id !== role.id)
                              .map(r => (
                                <option key={r.id} value={r.id}>
                                  {r.name} ({r.code}) — Currently {r.userCount} users
                                </option>
                              ))}
                          </select>
                          
                          {targetRoleId && (
                            <div className="mt-3 p-4 bg-[#DBEAFE] rounded-lg flex items-center gap-3">
                              <CheckCircle2 size={18} className="text-[#2563EB]" />
                              <p className="text-sm text-[#1E40AF]">
                                <span className="font-semibold">{role.userCount} users</span> will be moved to{' '}
                                <span className="font-semibold">
                                  {allRoles.find(r => r.id === targetRoleId)?.name}
                                </span>
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>

                {/* Fallback Option */}
                <button
                  onClick={() => setMitigationStrategy('fallback')}
                  className={`w-full p-6 rounded-xl border-2 text-left transition-all group ${
                    mitigationStrategy === 'fallback'
                      ? 'border-[#4ECDC4] bg-[#F0FDFA] shadow-md'
                      : 'border-[#E5E7EB] bg-white hover:border-[#4ECDC4] hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      mitigationStrategy === 'fallback'
                        ? 'border-[#4ECDC4] bg-[#4ECDC4]'
                        : 'border-[#D1D5DB] group-hover:border-[#4ECDC4]'
                    }`}>
                      {mitigationStrategy === 'fallback' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-base font-semibold text-[#111827]">
                          Fallback to Default Role
                        </h4>
                        <span className="px-2.5 py-1 bg-[#F3F4F6] text-[#6B7280] rounded-md text-xs font-medium">
                          Automated
                        </span>
                      </div>
                      <p className="text-sm text-[#6B7280] leading-relaxed">
                        Automatically reassign all {role.userCount} users to the system default role (Student). 
                        Safe for bulk deactivation and ensures no user loses access completely.
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Audit Trail */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8">
              <h2 className="text-lg font-semibold text-[#111827] mb-2">Document This Action</h2>
              <p className="text-sm text-[#6B7280] mb-6">
                Provide context for compliance and future reference
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-3">
                    Reason for Deactivation <span className="text-[#DC2626]">*</span>
                  </label>
                  <textarea
                    value={deactivationReason}
                    onChange={(e) => setDeactivationReason(e.target.value)}
                    placeholder="e.g., Role is deprecated. Merging all Staff responsibilities into Admin role to simplify access control structure..."
                    className="w-full px-4 py-3.5 bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#4ECDC4] focus:bg-white focus:ring-4 focus:ring-[#4ECDC4]/10 transition-all resize-none"
                    rows={5}
                  />
                  <p className="mt-2 text-xs text-[#6B7280]">
                    This will be logged with timestamp and your administrator details
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={notifyUsers}
                      onChange={(e) => setNotifyUsers(e.target.checked)}
                      className="w-5 h-5 rounded-md border-2 border-[#E5E7EB] text-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4] focus:ring-offset-2 cursor-pointer mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-[#111827] group-hover:text-[#4ECDC4] transition-colors">
                        Notify affected users via email
                      </span>
                      <p className="text-xs text-[#6B7280] mt-1">
                        Send automated notification to all {role.userCount} users about their role change
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={generateReport}
                      onChange={(e) => setGenerateReport(e.target.checked)}
                      className="w-5 h-5 rounded-md border-2 border-[#E5E7EB] text-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4] focus:ring-offset-2 cursor-pointer mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-[#111827] group-hover:text-[#4ECDC4] transition-colors">
                        Generate deactivation report
                      </span>
                      <p className="text-xs text-[#6B7280] mt-1">
                        Create a detailed PDF report with before/after comparison
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Type to Confirm */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8">
              <h2 className="text-lg font-semibold text-[#111827] mb-2">Type to Confirm</h2>
              <p className="text-sm text-[#6B7280] mb-6">
                To prevent accidental deactivation, please type <span className="font-mono font-semibold text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded">DEACTIVATE {role.code}</span> below
              </p>

              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={`Type "DEACTIVATE ${role.code}" to confirm`}
                className="w-full px-4 py-3.5 bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-xl text-sm font-mono text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#DC2626] focus:bg-white focus:ring-4 focus:ring-[#DC2626]/10 transition-all"
              />

              {confirmText && confirmText !== `DEACTIVATE ${role.code}` && (
                <div className="mt-3 flex items-center gap-2 text-sm text-[#DC2626]">
                  <XCircle size={16} />
                  <span>Text doesn't match. Please type exactly: DEACTIVATE {role.code}</span>
                </div>
              )}

              {confirmText === `DEACTIVATE ${role.code}` && (
                <div className="mt-3 flex items-center gap-2 text-sm text-[#10B981]">
                  <CheckCircle2 size={16} />
                  <span>Confirmed! You can now proceed with deactivation.</span>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6] rounded-2xl border border-[#E5E7EB] p-6">
              <h3 className="text-sm font-semibold text-[#111827] mb-4">Deactivation Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[#6B7280]">Role</span>
                  <span className="text-sm font-semibold text-[#111827]">{role.name} ({role.code})</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[#6B7280]">Users Affected</span>
                  <span className="text-sm font-semibold text-[#DC2626]">{role.userCount} users</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[#6B7280]">Mitigation Strategy</span>
                  <span className="text-sm font-semibold text-[#111827]">
                    {mitigationStrategy === 'fallback' 
                      ? 'Fallback to Default Role' 
                      : `Reassign to ${allRoles.find(r => r.id === targetRoleId)?.name}`}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[#6B7280]">Email Notifications</span>
                  <span className="text-sm font-semibold text-[#111827]">{notifyUsers ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Footer - Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] shadow-2xl z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-5 py-2.5 border-2 border-[#E5E7EB] text-[#6B7280] rounded-xl hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all text-sm font-medium flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Previous Step
                </button>
              )}
              <button
                onClick={() => navigate('/settings/access-control', { state: { tab: 'roles' } })}
                className="px-5 py-2.5 text-[#6B7280] hover:text-[#DC2626] transition-all text-sm font-medium"
              >
                Cancel
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-[#6B7280]">
                Step {currentStep} of {steps.length}
              </div>
              
              {currentStep < 3 && (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={currentStep === 1 ? !canProceedToStep2 : !canProceedToStep3}
                  className="px-6 py-2.5 bg-[#4ECDC4] text-white rounded-xl hover:bg-[#44A08D] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#4ECDC4] transition-all text-sm font-medium flex items-center gap-2 shadow-lg shadow-[#4ECDC4]/20"
                >
                  Continue
                  <ArrowRight size={16} />
                </button>
              )}

              {currentStep === 3 && (
                <button
                  onClick={handleConfirmDeactivation}
                  disabled={!canConfirm}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all text-sm font-medium flex items-center gap-2 shadow-lg"
                >
                  <Lock size={16} />
                  Deactivate Role
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Padding for Fixed Footer */}
      <div className="h-24"></div>
    </div>
  );
}
