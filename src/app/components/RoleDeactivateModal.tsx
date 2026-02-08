import React, { useEffect, useState } from 'react';
import { X, AlertCircle, ArrowRight } from 'lucide-react';
import AccessControlService, { Role } from '../services/AccessControlService/AccessControlService';
import { getRoleImpact, deactivateRole, listRoles } from '../services/RbacService/RbacService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  role: Role;
  onSuccess: () => void;
}

export function RoleDeactivateModal({ isOpen, onClose, role, onSuccess }: Props) {
  const [impact, setImpact] = useState<{ users_affected: number; permissions_affected: number } | null>(null);
  const [strategy, setStrategy] = useState<'fallback' | 'reassign'>('fallback');
  const [targetRoleId, setTargetRoleId] = useState<string | number | undefined>(undefined);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const disabled = submitting || loading;

  useEffect(() => {
    const load = async () => {
      if (!isOpen) return;
      setLoading(true);
      try {
        let usersAffected = typeof role.userCount === 'number' ? role.userCount : 0;
        let permissionsAffected = 0;

        try {
          const impactRes = await getRoleImpact(role.id);
          if (impactRes) {
            usersAffected = impactRes.users_affected ?? usersAffected;
            permissionsAffected = impactRes.permissions_affected ?? permissionsAffected;
          }
        } catch {
          // Fallback below if backend impact endpoint not available
        }

        if (!permissionsAffected) {
          const assigned = await AccessControlService.getRolePermissions(String(role.id));
          permissionsAffected = Array.isArray(assigned) ? assigned.length : 0;
        }

        setImpact({ users_affected: usersAffected, permissions_affected: permissionsAffected });

        const rolesRes = await listRoles();
        setAvailableRoles(rolesRes.filter(r => r.id !== role.id));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isOpen, role.id, role.userCount]);

  const handleSubmit = async () => {
    if (!reason.trim()) return;
    if (strategy === 'reassign' && !targetRoleId) return;
    setSubmitting(true);
    try {
      await deactivateRole(role.id, { strategy, target_role_id: targetRoleId, reason });
      onSuccess();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#E0E0E2] flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#1A1D1F]">Deactivate Role</h3>
            <p className="text-sm text-[#6E7191]">Role: {role.name} ({role.code})</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#F7F7F8] rounded-lg">
            <X size={18} className="text-[#6E7191]" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          <div className="flex items-start gap-3 p-3 sm:p-4 bg-[#FFF7ED] border border-[#FED7AA] rounded-xl">
            <AlertCircle size={18} className="text-[#C2410C] mt-0.5" />
            <div>
              <p className="text-sm text-[#7C2D12]">
                Deactivating a role prevents future assignment and permission checks for this role.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 sm:p-4 bg-[#F9FAFB] rounded-xl border border-[#E0E0E2]">
              <p className="text-xs text-[#6E7191]">Users affected</p>
              <p className="text-2xl font-bold text-[#1A1D1F]">{impact?.users_affected ?? '-'}</p>
            </div>
            <div className="p-3 sm:p-4 bg-[#F9FAFB] rounded-xl border border-[#E0E0E2]">
              <p className="text-xs text-[#6E7191]">Permissions affected</p>
              <p className="text-2xl font-bold text-[#1A1D1F]">{impact?.permissions_affected ?? '-'}</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-[#1A1D1F]">Strategy</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setStrategy('fallback')}
                className={`p-4 rounded-xl border text-left ${strategy === 'fallback' ? 'border-[#4ECDC4] bg-[#F0FBFA]' : 'border-[#E0E0E2] bg-white'}`}
                disabled={disabled}
              >
                <p className="font-semibold text-[#1A1D1F]">Fallback</p>
                <p className="text-xs text-[#6E7191]">Move users to default role</p>
              </button>
              <button
                onClick={() => setStrategy('reassign')}
                className={`p-4 rounded-xl border text-left ${strategy === 'reassign' ? 'border-[#4ECDC4] bg-[#F0FBFA]' : 'border-[#E0E0E2] bg-white'}`}
                disabled={disabled}
              >
                <p className="font-semibold text-[#1A1D1F]">Reassign</p>
                <p className="text-xs text-[#6E7191]">Move users to a selected role</p>
              </button>
            </div>
          </div>

          {strategy === 'reassign' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#1A1D1F]">Target role</label>
              <select
                value={targetRoleId ?? ''}
                onChange={(e) => setTargetRoleId(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#F7F7F8] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#4ECDC4] focus:bg-white transition-all"
                disabled={disabled}
              >
                <option value="" disabled>Select role</option>
                {availableRoles.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.code})</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1A1D1F]">Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for deactivation"
              className="w-full px-3 py-2.5 bg-[#F7F7F8] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#4ECDC4] focus:bg-white transition-all"
              disabled={disabled}
            />
          </div>
        </div>

        <div className="p-5 sm:p-6 border-t border-[#E0E0E2] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-white border border-[#E0E0E2] text-[#6E7191] rounded-xl text-sm font-medium hover:bg-[#F7F7F8]"
            disabled={disabled}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#4ECDC4] text-white rounded-xl text-sm font-medium hover:bg-[#44A08D] shadow-lg shadow-[#4ECDC4]/20"
            disabled={disabled || !reason.trim() || (strategy === 'reassign' && !targetRoleId)}
          >
            Proceed <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
