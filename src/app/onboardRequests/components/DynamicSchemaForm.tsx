import { useMemo, useEffect, useState } from "react";
import { SearchableSelect } from "../../components/ui/SearchableSelect";
import type { PublicSchemaField, SchemaChoiceOption } from "../types";
import { getCountries, getStates, getCities, Country, State, City } from "../../services/LocationService/LocationService";

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

const labelForKey = (key: string, label?: string) => {
  if (label) return label;
  if (key.startsWith("profile.")) return titleCase(key.slice("profile.".length));
  return titleCase(key);
};

export type SectionId = "personal" | "academic" | "work" | "admission" | "advanced" | "other";

export const sectionMeta: Record<SectionId, { title: string; desc: string }> = {
  personal: { title: "Personal Details", desc: "Identity and contact information." },
  academic: { title: "Education", desc: "Academic details and background." },
  work: { title: "Professional Experience", desc: "Work status and history." },
  admission: { title: "Course & Admission", desc: "Course preferences and admission details." },
  advanced: { title: "Additional Details", desc: "Structured information." },
  other: { title: "Other Details", desc: "Additional fields." },
};

export const getSectionId = (f: PublicSchemaField): SectionId => {
  // Prioritize explicit section from API
  if (f.section) {
    const s = f.section.toLowerCase();
    if (s.includes("personal") || s.includes("identity") || s.includes("contact")) return "personal";
    if (s.includes("work") || s.includes("experience")) return "work";
    
    // Heuristic to disambiguate "Education" section
    if (s.includes("education") || s.includes("academic")) {
       const k = String(f.key || "").toLowerCase();
       // If the key suggests course/admission details, put it in admission
       if (k.includes("course") || k.includes("batch") || k.includes("trainer") || k.includes("mode") || k.includes("week_type") || k.includes("category")) {
         return "admission";
       }
       return "academic";
    }
    
    if (s.includes("course") || s.includes("admission")) return "admission";
  }

  // Fallback heuristics
  const k = String(f.key || "").toLowerCase();
  if (f.key === "first_name" || f.key === "last_name") return "personal";
  if (f.type === "JSON") return "advanced";
  
  if (k.includes("phone") || k.includes("country_code") || k.includes("whatsapp") || k.includes("email")) return "personal";
  if (k.includes("address") || k.includes("location") || k.includes("city") || k.includes("state") || k.includes("pincode") || k.includes("zip")) return "personal";
  
  if (k.includes("course") || k.includes("batch") || k.includes("trainer") || k.includes("category") || k.includes("mode") || k.includes("week")) return "admission";
  
  if (k.includes("ug") || k.includes("pg") || k.includes("degree") || k.includes("passout") || k.includes("percentage") || k.includes("college") || k.includes("school") || k.includes("university") || k.includes("sslc") || k.includes("hsc")) return "academic";
  
  if (k.includes("working") || k.includes("employment") || k.includes("experience") || k.includes("company") || k.includes("designation") || k.includes("salary") || k.includes("skill")) return "work";
  
  return "other";
};

export const sectionOrder: SectionId[] = ["personal", "academic", "work", "admission", "advanced", "other"];

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
  // Location Data State
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  // Loading States for Enterprise UX
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);

  // Load Countries on Mount
  useEffect(() => {
    setCountriesLoading(true);
    getCountries()
      .then(setCountries)
      .catch(console.error)
      .finally(() => setCountriesLoading(false));
  }, []);

  // Load States when Country Changes
  useEffect(() => {
    const countryCode = values.profile?.country;
    if (countryCode) {
      setStatesLoading(true);
      getStates(countryCode)
        .then(setStates)
        .catch(console.error)
        .finally(() => setStatesLoading(false));
    } else {
      setStates([]);
    }
  }, [values.profile?.country]);

  // Load Cities when State Changes
  useEffect(() => {
    const stateCode = values.profile?.state;
    if (stateCode && states.length > 0) {
        // API requires State NAME (label) for city lookup, but we store State CODE (value)
        const stateObj = states.find(s => s.value === stateCode);
        if (stateObj) {
            setCitiesLoading(true);
            getCities(stateObj.label)
              .then(setCities)
              .catch(console.error)
              .finally(() => setCitiesLoading(false));
        }
    } else {
        setCities([]);
    }
  }, [values.profile?.state, states]);

  const choiceOptionsByKey = useMemo(() => {
    const map: Record<string, Array<{ id: string | number; name: string }>> = {};
    for (const f of fields) {
      if (f.type === "CHOICE" && !["profile.country", "profile.state", "profile.city"].includes(f.key)) {
        map[f.key] = normalizeChoiceOptions(f.options);
      }
    }
    return map;
  }, [fields]);

  useEffect(() => {
    // Set default for country_code if not set
    if (values.profile && !values.profile["country_code"]) {
       // Check if field exists and has +91 option
       const field = fields.find(f => f.key === "profile.country_code");
       if (field && field.options) {
          const opts = normalizeChoiceOptions(field.options);
          if (opts.some(o => o.name === "+91" || o.id === "+91")) {
             setProfile("country_code", "+91");
          }
       }
    }
  }, [fields, values.profile]);

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
    // Conditional Logic for Work Section
    const sectionId = getSectionId(f);
    if (sectionId === "work") {
      const workingStatus = values.profile["working_status"];
      const k = f.key;
      // "Are you currently working?" == YES : Show fields starting with profile.professional_profile.current_employment_details...
      if (k.includes("professional_profile.current_employment_details") && workingStatus !== "YES") return null;
      // "Are you currently working?" == NO : Show fields starting with profile.professional_profile.fresher_readiness_profile...
      if (k.includes("professional_profile.fresher_readiness_profile") && workingStatus !== "NO") return null;
    }

    const isTop = f.key === "first_name" || f.key === "last_name";
    const isProfile = f.key.startsWith("profile.");
    const profileKey = isProfile ? f.key.slice("profile.".length) : null;
    const label = labelForKey(f.key, f.label);
    const err = (showErrors || touched[f.key]) ? errors[f.key] : "";
    const markTouched = () => onTouch(f.key);
    const keyLower = String(f.key || "").toLowerCase();

    // Disable logic for cascading fields
    let isFieldDisabled = disabled;
    if (f.key === "profile.state" && !values.profile["country"]) isFieldDisabled = true;
    if (f.key === "profile.city" && !values.profile["state"]) isFieldDisabled = true;
    if (f.key === "profile.country_code" && !values.profile["country"]) isFieldDisabled = true;

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
            disabled={isFieldDisabled}
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
      
      // Strict numeric validation for phone numbers
      const isPhone = keyLower.includes("phone") || keyLower.includes("mobile");

      return (
        <div key={f.key}>
          {commonLabel}
          <input
            type={isPhone ? "tel" : "number"}
            value={typeof v === "number" ? String(v) : String(v ?? "")}
            disabled={isFieldDisabled}
            onBlur={markTouched}
            onChange={(e) => {
              markTouched();
              let raw = e.target.value;
              
              if (isPhone) {
                // Enforce numeric only for phone
                raw = raw.replace(/[^0-9]/g, "");
              }

              // Update state
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
              disabled={isFieldDisabled}
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
            disabled={isFieldDisabled}
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

    // New API Driven Location Logic (Replaces API_DROPDOWN block)
    if (f.type === "API_DROPDOWN" || ["profile.country", "profile.state", "profile.city"].includes(f.key)) {
      let opts: Array<{ id: string | number; name: string; extra?: any }> = [];
      const current = isProfile ? values.profile[profileKey!] : "";
      let isLoading = false;

      if (f.key === "profile.country") {
          opts = countries.map(c => ({ id: c.value, name: c.label, extra: c }));
          isLoading = countriesLoading;
      } else if (f.key === "profile.state") {
          opts = states.map(s => ({ id: s.value, name: s.label, extra: s }));
          isLoading = statesLoading;
      } else if (f.key === "profile.city") {
          opts = cities.map(c => ({ id: c.value, name: c.label, extra: c }));
          isLoading = citiesLoading;
      }

      return (
        <div key={f.key}>
          {commonLabel}
          <SearchableSelect
            options={opts}
            value={typeof current === "undefined" || current === null ? "" : current}
            disabled={isFieldDisabled}
            isLoading={isLoading}
            onChange={(v) => {
              markTouched();
              if (isProfile) {
                setProfile(profileKey!, v);

                // Find the full option object here since SearchableSelect only passes value
                const selectedOption = opts.find(o => o.id === v);

                // Cascading Logic
                if (f.key === "profile.country") {
                   setProfile("state", "");
                   setProfile("city", "");
                   // Auto-fill phone code from Country data
                   if (selectedOption?.extra) {
                      const c = selectedOption.extra as Country;
                      if (c.phone_code) {
                          // Ensure + prefix if missing
                          const code = c.phone_code.startsWith("+") ? c.phone_code : "+" + c.phone_code;
                          setProfile("country_code", code);
                      }
                   }
                } else if (f.key === "profile.state") {
                   setProfile("city", "");
                }
              }
            }}
            placeholder={`Select ${label}`}
            emptyMessage={f.key === "profile.city" && !values.profile["state"] ? "Please select a state first" : "No options found"}
          />
          {commonError}
        </div>
      );
    }

    if (f.type === "CHOICE" && !["profile.country", "profile.state", "profile.city"].includes(f.key)) {
      const opts = choiceOptionsByKey[f.key] || [];
      const current = isProfile ? values.profile[profileKey!] : "";

      return (
        <div key={f.key}>
          {commonLabel}
          <SearchableSelect
            options={opts}
            value={typeof current === "undefined" || current === null ? "" : current}
            disabled={isFieldDisabled}
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
            disabled={isFieldDisabled}
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
      academic: [],
      work: [],
      admission: [],
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
