
const sectionMeta = {
  personal: { title: "Personal Details", desc: "Basic details used for your account." },
  contact: { title: "Contact Details", desc: "How we can reach you." },
  address: { title: "Location", desc: "Your current location information." },
  course: { title: "Course Preferences", desc: "Preferences needed for onboarding." },
  education: { title: "Education", desc: "Academic details for your profile." },
  work: { title: "Work", desc: "Work status and experience information." },
  advanced: { title: "Additional Details", desc: "Provide structured information if required." },
  other: { title: "Other Details", desc: "Additional fields requested for onboarding." },
};

const getSectionId = (f) => {
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

const fields = [ 
         { "key": "first_name", "type": "TEXT" }, 
         { "key": "last_name", "type": "TEXT" }, 
         { "key": "profile.phone", "type": "TEXT" }, 
         { "key": "profile.location", "type": "TEXT" }, 
         { "key": "profile.mode_of_class", "type": "CHOICE" }, 
         { "key": "profile.week_type", "type": "CHOICE" }, 
         { "key": "profile.ugdegree", "type": "TEXT" }, 
         { "key": "profile.ugbranch", "type": "TEXT" }, 
         { "key": "profile.ugpassout", "type": "NUMBER" }, 
         { "key": "profile.ugpercentage", "type": "NUMBER" }, 
         { "key": "profile.pgdegree", "type": "TEXT" }, 
         { "key": "profile.pgbranch", "type": "TEXT" }, 
         { "key": "profile.pgpassout", "type": "NUMBER" }, 
         { "key": "profile.pgpercentage", "type": "NUMBER" }, 
         { "key": "profile.working_status", "type": "CHOICE" }, 
         { "key": "profile.it_experience", "type": "CHOICE" } 
     ];

const by = {};
const sectionOrder = ["personal", "contact", "address", "course", "education", "work", "advanced", "other"];
sectionOrder.forEach(id => by[id] = []);

fields.forEach(f => {
    const id = getSectionId(f);
    by[id].push(f.key);
});

console.log(JSON.stringify(by, null, 2));
