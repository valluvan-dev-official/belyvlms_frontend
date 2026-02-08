import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Mail, Copy, Check, AlertCircle, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { SearchableSelect } from "../../components/ui/SearchableSelect";
import { listRoles, type Role } from "../../services/RbacService/RbacService";
import { createOnboardRequest } from "../api";

export function CreateOnboardRequestDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}) {
  const [email, setEmail] = useState("");
  const [roleCode, setRoleCode] = useState<string | number>("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setResultUrl(null);
    setCopied(false);
    setEmail("");
    setRoleCode("");
    setErrorMessage(null);
    setSuccessMessage(null);
    (async () => {
      try {
        setLoadingRoles(true);
        const r = await listRoles();
        setRoles(r);
      } catch {
        setRoles([]);
      } finally {
        setLoadingRoles(false);
      }
    })();
  }, [open]);

  const roleOptions = useMemo(() => roles.map((r) => ({ id: r.code, name: `${r.code} - ${r.name}` })), [roles]);

  const canSubmit = email.trim().length > 3 && String(roleCode || "").trim().length > 0 && !submitting;

  const copyUrl = async () => {
    if (!resultUrl) return;
    try {
      await navigator.clipboard.writeText(resultUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Copy failed");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errorMessage) setErrorMessage(null);
    if (successMessage) setSuccessMessage(null);
  };

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res = await createOnboardRequest({ email: email.trim(), role_code: String(roleCode) });
      
      // Handle 200 OK business logic errors (e.g., USER_EXISTS)
      if (res && (res as any).status === 'USER_EXISTS') {
         setErrorMessage((res as any).message || "User already exists.");
         return;
      }

      const url = res.registration_url;
      setResultUrl(url);
      setSuccessMessage("Registration link sent successfully.");
      toast.success("Registration link sent");
      onCreated();
    } catch (err: any) {
      console.error("Create request error:", err);
      
      // Strict Error Handling as per User Instruction
      if (err.response && err.response.status === 400) {
         // Log the exact structure to debug
         console.log("Error Response Data:", err.response.data);
         
         const data = err.response.data;
         const detail = data.detail;

         // Priority 1: Detail object with specific fields
         if (detail && typeof detail === 'object') {
            if (Array.isArray(detail.email)) {
                setErrorMessage(detail.email[0]);
            } else if (Array.isArray(detail.non_field_errors)) {
                setErrorMessage(detail.non_field_errors[0]);
            } else {
                // Try to find any first error message
                const firstKey = Object.keys(detail)[0];
                const firstError = detail[firstKey];
                if (Array.isArray(firstError)) {
                    setErrorMessage(firstError[0]);
                } else if (typeof firstError === 'string') {
                    setErrorMessage(firstError);
                } else {
                    setErrorMessage("Validation failed");
                }
            }
         }
         // Priority 2: Direct field errors (e.g. { "email": ["..."] })
         else if (data.email && Array.isArray(data.email)) {
            setErrorMessage(data.email[0]);
         }
         // Priority 3: Simple string detail
         else if (typeof detail === 'string') {
            setErrorMessage(detail);
         }
         // Priority 4: Direct string error?
         else {
            setErrorMessage("Validation Failed. Please check inputs.");
         }
      } else {
         setErrorMessage("Something went wrong! Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Onboard Request</DialogTitle>
          <DialogDescription>Send a public registration link to user email.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1A1D1F] mb-2">Email *</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7191]" />
              <input
                value={email}
                onChange={handleEmailChange}
                type="email"
                placeholder="example@belyv.in"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E0E0E2] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1D1F] mb-2">Role *</label>
            <SearchableSelect
              options={roleOptions}
              value={roleCode}
              onChange={(v) => setRoleCode(v)}
              placeholder={loadingRoles ? "Loading..." : "Select role"}
              disabled={loadingRoles}
              emptyMessage="No roles found."
            />
          </div>

          {resultUrl && (
            <div className="border border-[#E0E0E2] rounded-xl p-4 bg-[#F7F7F8]">
              <div className="text-xs text-[#6E7191] mb-2">Registration URL</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 text-xs break-all text-[#1A1D1F]">{resultUrl}</div>
                <button
                  type="button"
                  onClick={copyUrl}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E0E0E2] rounded-lg hover:bg-[#F7F7F8] transition-colors"
                >
                  {copied ? <Check size={16} className="text-[#2B9A66]" /> : <Copy size={16} className="text-[#6E7191]" />}
                  <span className="text-xs font-medium text-[#1A1D1F]">{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
             <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
             <p className="text-sm text-red-600 font-medium leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-3">
             <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
             <p className="text-sm text-green-600 font-medium leading-relaxed">{successMessage}</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!canSubmit} className="bg-[#1A1D1F] text-white hover:bg-[#2B2F33]">
            {submitting ? "Sending..." : "Send Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

