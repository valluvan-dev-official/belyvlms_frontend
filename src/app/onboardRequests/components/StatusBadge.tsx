import type { OnboardRequestStatus } from "../types";

const classForStatus = (status: OnboardRequestStatus) => {
  const s = String(status || "").toUpperCase();
  if (s === "INVITED") return "bg-[#E6F5F5] text-[#4ECDC4]"; // Blue/Info
  if (s === "PENDING_APPROVAL") return "bg-[#FFF3CD] text-[#F59E0B]"; // Orange/Warning
  if (s === "ONBOARDED") return "bg-[#D4F4DD] text-[#2B9A66]"; // Green/Success
  if (s === "DROPPED") return "bg-[#FFE5E5] text-[#E63946]"; // Red/Error
  if (s === "ERROR") return "bg-[#FFE5E5] text-[#E63946]";
  return "bg-gray-100 text-gray-600";
};

export function StatusBadge({ status }: { status: OnboardRequestStatus }) {
  return (
    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${classForStatus(status)}`}>
      {String(status || "").replaceAll("_", " ")}
    </span>
  );
}

