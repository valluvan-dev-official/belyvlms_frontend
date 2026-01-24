import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ChevronLeft, Save, Send, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../components/ui/dialog";
import { getOnboardRequest, onboardRequest, patchOnboardRequest, performOnboardRequestAction } from "../api";
import type { OnboardRequestDetail } from "../types";
import { StatusBadge } from "../components/StatusBadge";

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const pretty = (v: any) => {
  try {
    return JSON.stringify(v ?? null, null, 2);
  } catch {
    return String(v);
  }
};

export function OnboardRequestDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const code = String(params.code || "");

  const [data, setData] = useState<OnboardRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [onboarding, setOnboarding] = useState(false);
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);

  const [adminFirstName, setAdminFirstName] = useState("");
  const [adminLastName, setAdminLastName] = useState("");
  const [adminProfileText, setAdminProfileText] = useState("{}");

  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"send_back" | "drop" | null>(null);
  const [actionReason, setActionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const openActionModal = (type: "send_back" | "drop") => {
    setActionType(type);
    setActionReason("");
    setActionModalOpen(true);
  };

  const submitAction = async () => {
    if (!data || !actionType) return;
    if (!actionReason.trim()) {
      toast.error("Please provide a reason");
      return;
    }

    setActionLoading(true);
    try {
      const res = await performOnboardRequestAction(code, {
        action: actionType,
        reason: actionReason,
      });
      setData(res);
      toast.success(actionType === "send_back" ? "Request sent back" : "Request dropped");
      setActionModalOpen(false);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const reload = async () => {
    setLoading(true);
    try {
      const res = await getOnboardRequest(code);
      setData(res);
      setAdminFirstName(String(res.admin_payload?.first_name ?? ""));
      setAdminLastName(String(res.admin_payload?.last_name ?? ""));
      setAdminProfileText(pretty(res.admin_payload?.profile ?? {}));
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Failed to load request");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!code) return;
    reload();
  }, [code]);

  const canOnboard = useMemo(() => {
    const status = String(data?.status || "").toUpperCase();
    return status === "PENDING_APPROVAL" || status === "ERROR";
  }, [data?.status]);

  const saveAdmin = async () => {
    if (!data) return;
    let parsedProfile: Record<string, any> = {};
    try {
      const parsed = JSON.parse(adminProfileText || "{}");
      parsedProfile = parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      toast.error("Invalid JSON in admin profile");
      return;
    }

    setSaving(true);
    try {
      const res = await patchOnboardRequest(code, {
        first_name: adminFirstName.trim() || undefined,
        last_name: adminLastName.trim() || undefined,
        profile: parsedProfile,
      });
      setData(res);
      toast.success("Saved");
    } catch (err: any) {
      const resp = err?.response;
      if (resp?.status === 400) {
        const detail = resp?.data?.detail;
        toast.error(typeof detail === "string" ? detail : "Validation error");
      } else {
        toast.error("Failed to save");
      }
    } finally {
      setSaving(false);
    }
  };

  const doOnboard = async () => {
    if (!data || !canOnboard) return;
    setOnboarding(true);
    try {
      const res = await onboardRequest(code, { send_welcome_email: !!sendWelcomeEmail });
      toast.success("User onboarded");
      navigate("/management/users");
      return res;
    } catch (err: any) {
      const resp = err?.response;
      const detail = resp?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Onboard failed");
    } finally {
      setOnboarding(false);
    }
  };

  const userSubmitted = data?.user_payload ?? null;
  const adminPayload = data?.admin_payload ?? null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/management/onboard-requests")}
            className="p-2.5 hover:bg-white rounded-xl transition-colors"
          >
            <ChevronLeft size={20} className="text-[#6E7191]" />
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-[#1A1D1F] mb-1">Onboard Request</h2>
            <p className="text-sm text-[#6E7191]">Review details and provision user.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={reload}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E0E0E2] rounded-xl hover:border-[#4ECDC4] transition-colors"
          >
            <RefreshCw size={18} className="text-[#6E7191]" />
            <span className="text-sm font-medium text-[#1A1D1F]">Refresh</span>
          </button>

          <button
            onClick={doOnboard}
            disabled={!canOnboard || onboarding || loading || !data}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            <span className="text-sm font-medium">{onboarding ? "Onboarding..." : data?.status === "ERROR" ? "Retry Onboard" : "Onboard"}</span>
          </button>

          {data?.status === "PENDING_APPROVAL" && (
            <>
              <button
                onClick={() => openActionModal("send_back")}
                disabled={loading || saving}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#F59E0B] text-[#F59E0B] rounded-xl hover:bg-[#FFF3CD] transition-colors disabled:opacity-50"
              >
                <span className="text-sm font-medium">Send Back</span>
              </button>
              <button
                onClick={() => openActionModal("drop")}
                disabled={loading || saving}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E63946] text-[#E63946] rounded-xl hover:bg-[#FFE5E5] transition-colors disabled:opacity-50"
              >
                <span className="text-sm font-medium">Drop</span>
              </button>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-6 border border-[#E0E0E2] text-sm text-[#6E7191]">Loading...</div>
      ) : !data ? (
        <div className="bg-white rounded-2xl p-6 border border-[#E0E0E2] text-sm text-[#6E7191]">Request not found.</div>
      ) : (
        <>
          <div className="bg-white rounded-2xl p-6 border border-[#E0E0E2]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-[#6E7191] mb-1">Code</div>
                <div className="text-sm font-mono text-[#1A1D1F]">{data.code}</div>
              </div>
              <div>
                <div className="text-xs text-[#6E7191] mb-1">Email</div>
                <div className="text-sm text-[#1A1D1F]">{data.email}</div>
              </div>
              <div>
                <div className="text-xs text-[#6E7191] mb-1">Role</div>
                <div className="text-sm text-[#1A1D1F]">{data.role_name || data.role_code}</div>
              </div>
              <div>
                <div className="text-xs text-[#6E7191] mb-1">Status</div>
                <div className="text-sm">
                  <StatusBadge status={data.status} />
                </div>
              </div>
              <div>
                <div className="text-xs text-[#6E7191] mb-1">Created</div>
                <div className="text-sm text-[#1A1D1F]">{formatDate(data.created_at)}</div>
              </div>
              <div>
                <div className="text-xs text-[#6E7191] mb-1">Submitted</div>
                <div className="text-sm text-[#1A1D1F]">{formatDate(data.submitted_at)}</div>
              </div>
              <div>
                <div className="text-xs text-[#6E7191] mb-1">Expires</div>
                <div className="text-sm text-[#1A1D1F]">{formatDate(data.expires_at)}</div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-[#1A1D1F] mt-5 md:mt-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendWelcomeEmail}
                    onChange={(e) => setSendWelcomeEmail(e.target.checked)}
                    className="w-4 h-4 border border-[#E0E0E2] rounded focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] cursor-pointer"
                  />
                  <span className="text-sm text-[#6E7191]">Send welcome email</span>
                </label>
              </div>
            </div>

            {String(data.status || "").toUpperCase() === "ERROR" && data.last_error && (
              <div className="mt-6 p-4 bg-[#FFE5E5] border border-[#E63946] rounded-xl">
                <div className="text-sm font-semibold text-[#E63946] mb-2">Last error</div>
                <pre className="text-xs whitespace-pre-wrap text-[#1A1D1F]">{pretty(data.last_error)}</pre>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-2xl p-6 border border-[#E0E0E2]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#EFEFFD] flex items-center justify-center text-[#5F55EE] font-semibold text-lg">
                    {(userSubmitted?.first_name?.[0] || "U").toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1A1D1F]">Candidate Profile</h3>
                    <p className="text-sm text-[#6E7191]">Details submitted by the user</p>
                  </div>
                </div>

                {(() => {
                  const u = userSubmitted || {};
                  const p = u.profile || {};
                  const pKeys = Object.keys(p);
                  
                  const ReadOnlyField = ({ label, value }: { label: string, value: string | null | undefined }) => (
                    <div className="relative mt-2">
                      <label className="absolute -top-2 left-3 px-1 bg-white text-xs font-medium text-[#6E7191]">
                        {label}
                      </label>
                      <input
                        readOnly
                        value={value || ""}
                        className="w-full px-4 py-3 bg-white border border-[#E0E0E2] rounded-xl text-[15px] font-medium text-[#1A1D1F] focus:outline-none cursor-default"
                      />
                    </div>
                  );

                  return (
                     <div className="space-y-6 pt-2">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
                         <ReadOnlyField label="First Name" value={u.first_name} />
                         <ReadOnlyField label="Last Name" value={u.last_name} />
                         
                         {pKeys.map((key: string) => (
                           <ReadOnlyField 
                             key={key} 
                             label={key.replace(/_/g, " ")} 
                             value={String(p[key] ?? "")} 
                           />
                         ))}
                       </div>
                      
                      {!u.first_name && !u.last_name && pKeys.length === 0 && (
                        <div className="text-center py-8 text-[#6E7191] bg-[#F7F7F8] rounded-xl border border-dashed border-[#E0E0E2]">
                          No details submitted yet
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>


          </div>
        </>
      )}

      <Dialog open={actionModalOpen} onOpenChange={setActionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionType === "send_back" ? "Send Back Request" : "Drop Request"}</DialogTitle>
            <DialogDescription>
              {actionType === "send_back" 
                ? "Please provide a reason for sending this request back to the user." 
                : "Please provide a reason for dropping this request. This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <textarea
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder="Reason..."
              className="w-full px-3 py-2 border border-[#E0E0E2] rounded-lg focus:outline-none focus:border-[#4ECDC4] min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <button
              onClick={() => setActionModalOpen(false)}
              className="px-4 py-2 text-sm text-[#6E7191] hover:text-[#1A1D1F]"
            >
              Cancel
            </button>
            <button
              onClick={submitAction}
              disabled={actionLoading}
              className={`px-4 py-2 text-sm text-white rounded-lg ${
                actionType === "drop" ? "bg-[#E63946] hover:bg-[#D32F2F]" : "bg-[#4ECDC4] hover:bg-[#44A08D]"
              }`}
            >
              {actionLoading ? "Processing..." : "Confirm"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

