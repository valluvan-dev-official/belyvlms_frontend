import { useMemo } from "react";
import { SearchableSelect } from "../../components/ui/SearchableSelect";
import type { PublicSchemaField, SchemaChoiceOption } from "../types";

const titleCase = (s: string) =>
  s
    .replaceAll(".", " ")
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

const normalizeChoiceOptions = (options: SchemaChoiceOption[] | undefined) => {
  if (!options) return [];
  return options.map((o) => {
    if (typeof o === "string" || typeof o === "number") return { id: o, name: String(o) };
    const anyO: any = o;
    if (typeof anyO?.id !== "undefined" && typeof anyO?.name === "string") return { id: anyO.id, name: anyO.name };
    if (typeof anyO?.value !== "undefined" && typeof anyO?.label === "string") return { id: anyO.value, name: anyO.label };
    return { id: JSON.stringify(o), name: String(anyO?.label || anyO?.name || anyO?.value || "Option") };
  });
};

type Values = {
  first_name: string;
  last_name: string;
  profile: Record<string, any>;
  rawJson: Record<string, string>;
};

const labelForKey = (key: string) => {
  if (key.startsWith("profile.")) return titleCase(key.slice("profile.".length));
  return titleCase(key);
};

export type SectionId = "personal" | "contact" | "address" | "course" | "education" | "work" | "advanced" | "other";

export const sectionMeta: Record<SectionId, { title: string; desc: string }> = {
  personal: { title: "Personal Details", desc: "Basic details used for your account." },
  contact: { title: "Contact Details", desc: "How we can reach you." },
  address: { title: "Location", desc: "Your current location information." },
  course: { title: "Course Preferences", desc: "Preferences needed for onboarding." },
  education: { title: "Education", desc: "Academic details for your profile." },
  work: { title: "Work", desc: "Work status and experience information." },
  advanced: { title: "Additional Details", desc: "Provide structured information if required." },
  other: { title: "Other Details", desc: "Additional fields requested for onboarding." },
};

export const getSectionId = (f: PublicSchemaField): SectionId => {
  const k = String(f.key || "").toLowerCase();
  if (f.key === "first_name" || f.key === "last_name") return "personal";
  if (f.type === "JSON") return "advanced";
  if (k.includes("phone") || k.includes("country_code") || k.includes("whatsapp")) return "contact";
  if (k.includes("address") || k.includes("location") || k.includes("city") || k.includes("state")) return "address";
  if (
    k.includes("course") ||
    k.includes("batch") ||
    k.includes("trainer") ||
    k.includes("category") ||
    k.includes("mode_of_class") ||
    k.includes("week_type")
  )
    return "course";
  if (k.includes("ug") || k.includes("pg") || k.includes("degree") || k.includes("passout") || k.includes("percentage")) return "education";
  if (k.includes("working") || k.includes("employment") || k.includes("experience") || k.includes("company")) return "work";
  return "other";
};

export const sectionOrder: SectionId[] = ["personal", "contact", "address", "course", "education", "work", "advanced", "other"];

export function DynamicSchemaForm({
  fields,
  values,
  errors,
  touched,
  showErrors,
  disabled,
  onChange,
  onTouch,
  variant = "cards",
}: {
  fields: PublicSchemaField[];
  values: Values;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  showErrors: boolean;
  disabled?: boolean;
  onChange: (next: Values) => void;
  onTouch: (key: string) => void;
  variant?: "cards" | "flat";
}) {
  const choiceOptionsByKey = useMemo(() => {
    const map: Record<string, Array<{ id: string | number; name: string }>> = {};
    for (const f of fields) {
      if (f.type === "CHOICE") {
        map[f.key] = normalizeChoiceOptions(f.options);
      }
    }
    return map;
  }, [fields]);

  const setTop = (key: "first_name" | "last_name", value: string) => {
    onChange({ ...values, [key]: value });
  };

  const setProfile = (key: string, value: any) => {
    onChange({ ...values, profile: { ...values.profile, [key]: value } });
  };

  const setRawJson = (key: string, value: string) => {
    onChange({ ...values, rawJson: { ...values.rawJson, [key]: value } });
  };

  const renderField = (f: PublicSchemaField) => {
    const isTop = f.key === "first_name" || f.key === "last_name";
    const isProfile = f.key.startsWith("profile.");
    const profileKey = isProfile ? f.key.slice("profile.".length) : null;
    const label = labelForKey(f.key);
    const err = (showErrors || touched[f.key]) ? errors[f.key] : "";
    const markTouched = () => onTouch(f.key);
    const keyLower = String(f.key || "").toLowerCase();

    const commonLabel = (
      <label className="block text-sm font-medium text-[#1A1D1F] mb-2">
        {label}
        {f.required ? <span className="text-red-500"> *</span> : null}
      </label>
    );

    const commonError = err ? <div className="text-xs text-[#E63946] mt-2">{err}</div> : null;

    if (f.type === "TEXT") {
      const v = isTop ? (f.key === "first_name" ? values.first_name : values.last_name) : isProfile ? String(values.profile[profileKey!] ?? "") : "";
      return (
        <div key={f.key}>
          {commonLabel}
          <input
            value={v}
            disabled={disabled}
            onBlur={markTouched}
            onChange={(e) => {
              markTouched();
              if (isTop) setTop(f.key as any, e.target.value);
              else if (isProfile) setProfile(profileKey!, e.target.value);
            }}
            type={keyLower.includes("phone") ? "tel" : "text"}
            autoComplete={f.key === "first_name" ? "given-name" : f.key === "last_name" ? "family-name" : "off"}
            placeholder={`Enter ${label}`}
            className="w-full px-4 py-2.5 bg-white border border-[#E0E0E2] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] transition-colors disabled:opacity-50"
          />
          {commonError}
        </div>
      );
    }

    if (f.type === "NUMBER") {
      const v = isProfile ? values.profile[profileKey!] : isTop ? (f.key === "first_name" ? values.first_name : values.last_name) : "";
      return (
        <div key={f.key}>
          {commonLabel}
          <input
            type="number"
            value={typeof v === "number" ? String(v) : String(v ?? "")}
            disabled={disabled}
            onBlur={markTouched}
            onChange={(e) => {
              markTouched();
              const raw = e.target.value;
              const next = raw === "" ? "" : Number(raw);
              if (isProfile) setProfile(profileKey!, next);
            }}
            placeholder={`Enter ${label}`}
            className="w-full px-4 py-2.5 bg-white border border-[#E0E0E2] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] transition-colors disabled:opacity-50"
          />
          {commonError}
        </div>
      );
    }

    if (f.type === "BOOLEAN") {
      const checked = isProfile ? Boolean(values.profile[profileKey!]) : false;
      return (
        <div key={f.key} className="md:col-span-2 border border-[#E0E0E2] rounded-xl bg-white px-4 py-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              disabled={disabled}
              onBlur={markTouched}
              onChange={(e) => {
                markTouched();
                if (isProfile) setProfile(profileKey!, e.target.checked);
              }}
              className="mt-1 w-4 h-4 border border-[#E0E0E2] rounded focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] cursor-pointer disabled:opacity-50"
            />
            <div>
              <div className="text-sm font-semibold text-[#1A1D1F]">
                {label}
                {f.required ? <span className="text-red-500"> *</span> : null}
              </div>
              {commonError}
            </div>
          </label>
        </div>
      );
    }

    if (f.type === "DATE") {
      const v = isProfile ? String(values.profile[profileKey!] ?? "") : "";
      return (
        <div key={f.key}>
          {commonLabel}
          <input
            type="date"
            value={v}
            disabled={disabled}
            onBlur={markTouched}
            onChange={(e) => {
              markTouched();
              if (isProfile) setProfile(profileKey!, e.target.value);
            }}
            className="w-full px-4 py-2.5 bg-white border border-[#E0E0E2] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] transition-colors disabled:opacity-50"
          />
          {commonError}
        </div>
      );
    }

    if (f.type === "CHOICE") {
      const opts = choiceOptionsByKey[f.key] || [];
      const current = isProfile ? values.profile[profileKey!] : "";
      return (
        <div key={f.key}>
          {commonLabel}
          <SearchableSelect
            options={opts}
            value={typeof current === "undefined" || current === null ? "" : current}
            disabled={disabled}
            onChange={(v) => {
              markTouched();
              if (isProfile) setProfile(profileKey!, v);
            }}
            placeholder={`Select ${label}`}
            emptyMessage="No options."
          />
          {commonError}
        </div>
      );
    }

    if (f.type === "JSON") {
      const rawKey = f.key;
      const raw = values.rawJson[rawKey] ?? (isProfile ? JSON.stringify(values.profile[profileKey!] ?? {}, null, 2) : "{}");
      return (
        <div key={f.key} className="md:col-span-2">
          {commonLabel}
          <textarea
            value={raw}
            disabled={disabled}
            onBlur={markTouched}
            onChange={(e) => {
              markTouched();
              setRawJson(rawKey, e.target.value);
            }}
            rows={10}
            className="w-full px-4 py-2.5 bg-white border border-[#E0E0E2] rounded-lg text-xs font-mono focus:outline-none focus:border-[#4ECDC4] transition-colors disabled:opacity-50"
          />
          <div className="text-[11px] text-[#6E7191] mt-2">Paste a valid JSON object.</div>
          {commonError}
        </div>
      );
    }

    return null;
  };

  const grouped = useMemo(() => {
    const by: Record<SectionId, PublicSchemaField[]> = {
      personal: [],
      contact: [],
      address: [],
      course: [],
      education: [],
      work: [],
      advanced: [],
      other: [],
    };
    for (const f of fields) {
      by[getSectionId(f)].push(f);
    }
    return by;
  }, [fields]);

  if (variant === "flat") {
    return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{fields.map(renderField)}</div>;
  }

  return (
    <div className="space-y-5">
      {sectionOrder.map((id) => {
        const list = grouped[id];
        if (!list.length) return null;
        const meta = sectionMeta[id];
        return (
          <div key={id} className="border border-[#E0E0E2] rounded-2xl p-5 bg-[#F7F7F8]">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="text-sm font-semibold text-[#1A1D1F]">{meta.title}</div>
                <div className="text-xs text-[#6E7191] mt-1">{meta.desc}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{list.map(renderField)}</div>
          </div>
        );
      })}
    </div>
  );
}
