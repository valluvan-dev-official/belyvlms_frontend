import { Clock, AlertCircle, CheckCircle2, Users } from "lucide-react";
import type { OnboardRequestListItem } from "../types";

interface StatsOverviewProps {
  requests: OnboardRequestListItem[];
}

export function StatsOverview({ requests }: StatsOverviewProps) {
  // Calculate stats
  const pendingReview = requests.filter((r) => r.status === "PENDING_APPROVAL").length;

  const overdue = requests.filter((r) => {
    if (r.status === "ONBOARDED" || r.status === "DROPPED") return false;
    if (!r.expires_at) return false;
    return new Date(r.expires_at) < new Date();
  }).length;

  // "Today's Approvals" - approximating with ONBOARDED status where submitted_at is today
  const today = new Date().toDateString();
  const todaysApprovals = requests.filter((r) => {
    if (r.status !== "ONBOARDED") return false;
    if (!r.submitted_at) return false;
    return new Date(r.submitted_at).toDateString() === today;
  }).length;

  // Awaiting Submission - Users who have been invited but haven't submitted yet
  const awaitingSubmission = requests.filter((r) => r.status === "INVITED").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Pending Review - Blue */}
      <div className="bg-[#EAF2FF] rounded-2xl p-5 border border-[#D0E1FD] relative overflow-hidden group hover:shadow-sm transition-all">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[#0052CC] text-sm font-semibold mb-3">Pending Review</p>
            <h3 className="text-3xl font-bold text-[#172B4D]">{pendingReview}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#D0E1FD]/50 flex items-center justify-center text-[#0052CC]">
            <Clock size={20} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Overdue - Red */}
      <div className="bg-[#FFF0F0] rounded-2xl p-5 border border-[#FFD5D5] relative overflow-hidden group hover:shadow-sm transition-all">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[#C91A25] text-sm font-semibold mb-3">Overdue</p>
            <h3 className="text-3xl font-bold text-[#172B4D]">{overdue}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FFD5D5]/50 flex items-center justify-center text-[#C91A25]">
            <AlertCircle size={20} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Today's Approvals - Green */}
      <div className="bg-[#E3FCEF] rounded-2xl p-5 border border-[#ABF5D1] relative overflow-hidden group hover:shadow-sm transition-all">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[#006644] text-sm font-semibold mb-3">Today's Approvals</p>
            <h3 className="text-3xl font-bold text-[#172B4D]">{todaysApprovals}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#ABF5D1]/50 flex items-center justify-center text-[#006644]">
            <CheckCircle2 size={20} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Awaiting Submission - Purple */}
      <div className="bg-[#F3F0FF] rounded-2xl p-5 border border-[#D8CCF4] relative overflow-hidden group hover:shadow-sm transition-all">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[#6554C0] text-sm font-semibold mb-3">Awaiting Submission</p>
            <h3 className="text-3xl font-bold text-[#172B4D]">{awaitingSubmission}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#D8CCF4]/50 flex items-center justify-center text-[#6554C0]">
            <Users size={20} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </div>
  );
}
