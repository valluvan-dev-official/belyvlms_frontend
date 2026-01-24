import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { getPublicOnboardSchema, submitPublicOnboard } from "../api";
import { getAccessToken, getCurrentUser, logoutUser } from "../../services/AuthenticationService/AuthenticationService";
import type { PublicOnboardSchemaResponse } from "../types";
import { DynamicSchemaForm, getSectionId, sectionMeta, sectionOrder, type SectionId } from "../components/DynamicSchemaForm";
import type { PublicSchemaField } from "../types";

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const parseToken = (search: string) => {
  const params = new URLSearchParams(search);
  return params.get("token") || "";
};

const buildInitialValues = (schema: PublicOnboardSchemaResponse) => {
  const rawJson: Record<string, string> = {};
  const profile: Record<string, any> = {};
  let first_name = "";
  let last_name = "";

  const initialData = schema.initial_data || {};
  const initialProfile = initialData.profile || {};

  if (initialData.first_name) first_name = String(initialData.first_name);
  if (initialData.last_name) last_name = String(initialData.last_name);

  for (const f of schema.fields || []) {
    if (f.type === "JSON") {
      let val = null;
      if (f.key.startsWith("profile.")) {
        const k = f.key.slice("profile.".length);
        val = initialProfile[k];
      } else {
        val = initialData[f.key];
      }
      rawJson[f.key] = val ? JSON.stringify(val, null, 2) : "{}";
    }
    if (f.key.startsWith("profile.")) {
      const k = f.key.slice("profile.".length);
      if (typeof initialProfile[k] !== "undefined") {
        profile[k] = initialProfile[k];
      } else if (typeof profile[k] === "undefined") {
        profile[k] = f.type === "BOOLEAN" ? false : "";
      }
    }
    // Fallback for first_name/last_name if not set from initialData (though handled above)
    if (f.key === "first_name" && !first_name) first_name = "";
    if (f.key === "last_name" && !last_name) last_name = "";
  }
  return { first_name, last_name, profile, rawJson };
};

export function PublicRegisterPage() {
  const location = useLocation();
  const token = useMemo(() => parseToken(location.search), [location.search]);

  const [schema, setSchema] = useState<PublicOnboardSchemaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<{ first_name: string; last_name: string; profile: Record<string, any>; rawJson: Record<string, string> }>({
    first_name: "",
    last_name: "",
    profile: {},
    rawJson: {},
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = async () => {
    // Enable preview mode if no token provided or for testing
    if (!token) {
      console.warn("No token, using mock schema for preview");
      const res: PublicOnboardSchemaResponse = {
        request_code: "PREVIEW-MODE",
        email: "preview@example.com",
        role_code: "STUDENT",
        fields: [
          { key: "first_name", type: "TEXT", required: true },
          { key: "last_name", type: "TEXT", required: true },
          { key: "profile.phone", type: "TEXT", required: true },
          { key: "profile.dob", type: "DATE", required: true },
        ],
      };
      setSchema(res);
      setValues(buildInitialValues(res));
      setLoading(false);
      setLoadError(null);
      toast.info("Preview Mode: No token provided");
      return;
    }

    setLoading(true);
    setLoadError(null);
    try {
      let res = await getPublicOnboardSchema(token);
      
      // Safety: If backend returns string/invalid data despite 200 OK
      if (!res || typeof res !== "object") {
         res = { fields: [] } as any;
      }

      // Ensure fields is an array
      if (!Array.isArray(res.fields)) {
        res.fields = [];
      }

      setSchema(res);
      setValues(buildInitialValues(res));
      setErrors({});
      setTouched({});
      setShowErrors(false);
      setStepIndex(0);
    } catch (err: any) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;
      const msg = typeof detail === "string" ? detail : "Unable to load registration form";
      
      // Fallback to mock schema if backend is unreachable or returns generic error
      if (!status || status >= 500) {
         console.warn("Backend error, using mock schema for preview");
         const res: PublicOnboardSchemaResponse = {
          request_code: "PREVIEW-MODE",
          email: "preview@example.com",
          role_code: "STUDENT",
          fields: [
            { key: "first_name", type: "TEXT", required: true },
            { key: "last_name", type: "TEXT", required: true },
            { key: "profile.phone", type: "TEXT", required: true },
          ],
        };
        setSchema(res);
        setValues(buildInitialValues(res));
        setErrors({});
        setTouched({});
        setShowErrors(false);
        setStepIndex(0);
        setLoadError(null);
        toast.error("Backend unavailable. Showing preview mode.");
        return;
      }

      if (status === 401 || status === 403) {
        setLoadError("Link expired or invalid. Please contact admin.");
      } else if (status === 404) {
        setLoadError("Invalid link");
      } else {
        setLoadError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const wizard = useMemo(() => {
    if (!schema) return { steps: [] as Array<{ id: SectionId; fields: typeof schema.fields }>, activeId: null as SectionId | null, lastIndex: 0 };
    const by: Record<SectionId, any[]> = {
      personal: [],
      contact: [],
      address: [],
      course: [],
      education: [],
      work: [],
      advanced: [],
      other: [],
    };
    for (const f of schema.fields || []) {
      by[getSectionId(f)].push(f);
    }
    const steps = sectionOrder
      .map((id) => ({ id, fields: by[id] }))
      .filter((s) => (s.fields || []).length > 0);
    const safeIndex = Math.min(Math.max(stepIndex, 0), Math.max(steps.length - 1, 0));
    const active = steps[safeIndex]?.id ?? null;
    return { steps, activeId: active, lastIndex: Math.max(steps.length - 1, 0), safeIndex };
  }, [schema, stepIndex]);

  const validateForFields = (fields: Array<{ key: string; type: string; required: boolean }>) => {
    if (!schema) return { ok: false };
    const nextErrors: Record<string, string> = {};
    for (const f of fields || []) {
      const required = !!f.required;
      if (!required) continue;
      if (f.key === "first_name") {
        if (!values.first_name.trim()) nextErrors[f.key] = "Required";
        continue;
      }
      if (f.key === "last_name") {
        if (!values.last_name.trim()) nextErrors[f.key] = "Required";
        continue;
      }
      if (f.key.startsWith("profile.")) {
        const k = f.key.slice("profile.".length);
        const v = values.profile[k];
        if (f.type === "BOOLEAN") {
          if (v !== true && v !== false) nextErrors[f.key] = "Required";
        } else if (f.type === "NUMBER") {
          if (v === "" || v === null || typeof v === "undefined" || Number.isNaN(Number(v))) nextErrors[f.key] = "Required";
        } else if (f.type === "JSON") {
          const raw = values.rawJson[f.key] ?? "";
          if (!raw.trim()) {
            nextErrors[f.key] = "Required";
          } else {
            try {
              JSON.parse(raw);
            } catch {
              nextErrors[f.key] = "Invalid JSON";
            }
          }
        } else {
          if (v === "" || v === null || typeof v === "undefined") nextErrors[f.key] = "Required";
        }
      }
    }

    setErrors((prev) => ({ ...prev, ...nextErrors }));
    return { ok: Object.keys(nextErrors).length === 0 };
  };

  const touchFields = (fields: Array<{ key: string }>) => {
    setTouched((prev) => {
      const next = { ...prev };
      for (const f of fields || []) {
        next[f.key] = true;
      }
      return next;
    });
  };

  const onCancelWizard = () => {
    if (!schema) return;
    setValues(buildInitialValues(schema));
    setErrors({});
    setTouched({});
    setShowErrors(false);
    setStepIndex(0);
  };

  const onBack = () => {
    setShowErrors(false);
    setStepIndex((p) => Math.max(p - 1, 0));
  };

  const onContinue = () => {
    if (!schema) return;
    const step = wizard.steps[wizard.safeIndex];
    const fields = step?.fields || [];
    setShowErrors(true);
    touchFields(fields);
    const v = validateForFields(fields);
    if (!v.ok) {
      toast.error("Please fix the errors");
      return;
    }
    setShowErrors(false);
    setStepIndex((p) => Math.min(p + 1, wizard.lastIndex));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!schema) return { ok: false, errors: { token: "Invalid link" } };
    for (const f of schema.fields || []) {
      const required = !!f.required;
      if (!required) continue;
      if (f.key === "first_name") {
        if (!values.first_name.trim()) nextErrors[f.key] = "Required";
        continue;
      }
      if (f.key === "last_name") {
        if (!values.last_name.trim()) nextErrors[f.key] = "Required";
        continue;
      }
      if (f.key.startsWith("profile.")) {
        const k = f.key.slice("profile.".length);
        const v = values.profile[k];
        if (f.type === "BOOLEAN") {
          if (v !== true && v !== false) nextErrors[f.key] = "Required";
        } else if (f.type === "NUMBER") {
          if (v === "" || v === null || typeof v === "undefined" || Number.isNaN(Number(v))) nextErrors[f.key] = "Required";
        } else if (f.type === "JSON") {
          const raw = values.rawJson[f.key] ?? "";
          if (!raw.trim()) {
            nextErrors[f.key] = "Required";
          } else {
            try {
              JSON.parse(raw);
            } catch {
              nextErrors[f.key] = "Invalid JSON";
            }
          }
        } else {
          if (v === "" || v === null || typeof v === "undefined") nextErrors[f.key] = "Required";
        }
      }
    }
    setErrors(nextErrors);
    return { ok: Object.keys(nextErrors).length === 0, errors: nextErrors };
  };

  const submit = async () => {
    if (!schema || !token) return;
    setShowErrors(true);
    touchFields(schema.fields || []);
    const v = validate();
    if (!v.ok) {
      toast.error("Please fix the errors");
      return;
    }

    const profile: Record<string, any> = { ...values.profile };
    for (const f of schema.fields || []) {
      if (f.key.startsWith("profile.") && f.type === "JSON") {
        const raw = values.rawJson[f.key] ?? "{}";
        try {
          const parsed = JSON.parse(raw || "{}");
          profile[f.key.slice("profile.".length)] = parsed;
        } catch {
          setErrors((p) => ({ ...p, [f.key]: "Invalid JSON" }));
          toast.error("Invalid JSON");
          return;
        }
      }
    }

    setSubmitLoading(true);
    try {
      const res = await submitPublicOnboard(token, {
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        profile,
      });
      const requestCode = res?.request_code || schema.request_code;
      setSubmittedCode(String(requestCode));
    } catch (err: any) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;
      const codeVal = err?.response?.data?.code;
      const msg = typeof detail === "string" ? detail : "Submission failed";
      if (String(codeVal || "").toUpperCase().includes("EXPIRED") || msg.toLowerCase().includes("expired")) {
        toast.error("Link expired. Please contact admin.");
      } else if (msg.toLowerCase().includes("already") || String(codeVal || "").toUpperCase().includes("USED")) {
        toast.error("Already submitted");
      } else if (status === 400 && err?.response?.data && typeof err.response.data === "object") {
        const obj = err.response.data;
        const next: Record<string, string> = {};
        Object.keys(obj).forEach((k) => {
          const m = Array.isArray(obj[k]) ? obj[k][0] : obj[k];
          next[k] = typeof m === "string" ? m : JSON.stringify(m);
        });
        setErrors((p) => ({ ...p, ...next }));
        toast.error("Validation error");
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  if (submittedCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F8] px-6">
        <div className="w-full max-w-xl bg-white border border-[#E0E0E2] rounded-2xl p-8">
          <div className="text-xs font-semibold text-[#6E7191] tracking-wide uppercase">BeLyv LMS</div>
          <h1 className="text-2xl font-bold text-[#1A1D1F] mt-2">Submitted for Approval</h1>
          <p className="text-sm text-[#6E7191] mt-2">Your details have been submitted. Admin will onboard you soon.</p>
          <div className="mt-6 bg-[#F7F7F8] border border-[#E0E0E2] rounded-xl p-4">
            <div className="text-xs text-[#6E7191] mb-1">Request code</div>
            <div className="text-sm font-mono text-[#1A1D1F]">{submittedCode}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && (loadError || !schema)) {
    const message = loadError || "Invalid link";
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F8] px-6">
        <div className="w-full max-w-xl bg-white border border-[#E0E0E2] rounded-2xl p-8">
          <div className="text-xs font-semibold text-[#6E7191] tracking-wide uppercase">BeLyv LMS</div>
          <h1 className="text-2xl font-bold text-[#1A1D1F] mt-2">Registration link issue</h1>
          <p className="text-sm text-[#6E7191] mt-2">{message}</p>
          <div className="mt-6 bg-[#F7F7F8] border border-[#E0E0E2] rounded-xl p-4">
            <div className="text-sm font-semibold text-[#1A1D1F]">Need help?</div>
            <div className="text-sm text-[#6E7191] mt-1">Please contact admin to resend a fresh registration link.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="text-xs font-semibold text-[#6E7191] tracking-wide uppercase">BeLyv LMS</div>
          <h1 className="text-3xl font-bold text-[#1A1D1F] mt-2">Public Registration</h1>
          <p className="text-sm text-[#6E7191] mt-1">Fill your details and submit for admin approval.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-[#E0E0E2] rounded-2xl p-6">
              <div className="h-5 w-48 bg-[#F0F0F2] rounded mb-4" />
              <div className="h-4 w-72 bg-[#F0F0F2] rounded mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-10 bg-[#F0F0F2] rounded" />
                <div className="h-10 bg-[#F0F0F2] rounded" />
                <div className="h-10 bg-[#F0F0F2] rounded" />
                <div className="h-10 bg-[#F0F0F2] rounded" />
              </div>
            </div>
            <div className="bg-white border border-[#E0E0E2] rounded-2xl p-6">
              <div className="h-5 w-32 bg-[#F0F0F2] rounded mb-4" />
              <div className="space-y-3">
                <div className="h-4 w-40 bg-[#F0F0F2] rounded" />
                <div className="h-4 w-28 bg-[#F0F0F2] rounded" />
                <div className="h-4 w-44 bg-[#F0F0F2] rounded" />
              </div>
            </div>
          </div>
        ) : schema ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-[#E0E0E2] rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="text-sm font-semibold text-[#1A1D1F]">Registration details</div>
                  <div className="text-xs text-[#6E7191] mt-1">Enter accurate details to avoid delays.</div>
                </div>
              </div>

              {wizard.steps.length > 1 ? (
                <div className="mb-6 border border-[#E0E0E2] rounded-xl bg-white overflow-hidden">
                  <div className="flex items-center overflow-x-auto">
                    {wizard.steps.map((s, idx) => {
                      const active = idx === wizard.safeIndex;
                      const done = idx < wizard.safeIndex;
                      const title = sectionMeta[s.id]?.title || s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          disabled={submitLoading}
                          onClick={() => {
                            setShowErrors(false);
                            setStepIndex(idx);
                          }}
                          className={[
                            "flex-1 min-w-[180px] px-4 py-3 text-left border-b-2 transition-colors",
                            active ? "border-b-[#4ECDC4] bg-[#F7F7F8]" : "border-b-transparent hover:bg-[#F7F7F8]",
                          ].join(" ")}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={[
                                "w-5 h-5 rounded-full border flex items-center justify-center",
                                done ? "bg-[#4ECDC4] border-[#4ECDC4]" : active ? "border-[#4ECDC4]" : "border-[#E0E0E2]",
                              ].join(" ")}
                            >
                              {done ? <div className="w-2 h-2 bg-white rounded-full" /> : active ? <div className="w-2 h-2 bg-[#4ECDC4] rounded-full" /> : null}
                            </div>
                            <div className={active ? "text-sm font-semibold text-[#1A1D1F]" : "text-sm font-medium text-[#6E7191]"}>{title}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <DynamicSchemaForm
                fields={(wizard.steps.length ? wizard.steps[wizard.safeIndex]?.fields : schema.fields) || []}
                values={values}
                errors={errors}
                touched={touched}
                showErrors={showErrors}
                disabled={submitLoading}
                variant="flat"
                onChange={(next) => {
                  setValues(next);
                }}
                onTouch={(key) => {
                  setTouched((p) => (p[key] ? p : { ...p, [key]: true }));
                }}
              />

              <div className="mt-10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onCancelWizard}
                  disabled={submitLoading}
                  className="px-5 py-2.5 bg-white border border-[#E0E0E2] text-[#1A1D1F] rounded-lg font-semibold hover:border-[#4ECDC4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                {wizard.steps.length > 1 && wizard.safeIndex > 0 ? (
                  <button
                    type="button"
                    onClick={onBack}
                    disabled={submitLoading}
                    className="px-5 py-2.5 bg-white border border-[#E0E0E2] text-[#1A1D1F] rounded-lg font-semibold hover:border-[#4ECDC4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>
                ) : null}
                {wizard.steps.length > 1 && wizard.safeIndex < wizard.lastIndex ? (
                  <button
                    type="button"
                    onClick={onContinue}
                    disabled={submitLoading}
                    className="px-5 py-2.5 bg-[#35C46A] text-white rounded-lg font-semibold hover:bg-[#2EAF5E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submit}
                    disabled={submitLoading}
                    className="px-5 py-2.5 bg-[#35C46A] text-white rounded-lg font-semibold hover:bg-[#2EAF5E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitLoading ? "Submitting..." : "Submit"}
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white border border-[#E0E0E2] rounded-2xl p-6 h-fit">
              <div className="text-sm font-semibold text-[#1A1D1F]">Invitation</div>
              <div className="text-xs text-[#6E7191] mt-1">This link is tied to your email and role.</div>
              <div className="mt-5 space-y-4">
                <div>
                  <div className="text-xs text-[#6E7191] mb-1">Email</div>
                  <div className="text-sm text-[#1A1D1F] break-all">{schema.email}</div>
                </div>
                <div>
                  <div className="text-xs text-[#6E7191] mb-1">Role</div>
                  <div className="text-sm text-[#1A1D1F]">{schema.role_name || schema.role_code}</div>
                </div>
                <div>
                  <div className="text-xs text-[#6E7191] mb-1">Expires</div>
                  <div className="text-sm text-[#1A1D1F]">{formatDate(schema.expires_at)}</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
