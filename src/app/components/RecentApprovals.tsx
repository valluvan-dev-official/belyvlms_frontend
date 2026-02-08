import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, MoreHorizontal } from "lucide-react";
import { listOnboardRequests } from "../onboardRequests/api";
import { OnboardRequestListItem } from "../onboardRequests/types";

export function RecentApprovals() {
  const [approvals, setApprovals] = useState<OnboardRequestListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        // Fetch only onboarded users
        const res = await listOnboardRequests({ status: 'ONBOARDED' });
        // Sort by created_at desc
        // and take top 5
        const sorted = (res.results || [])
          .sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 5);
        
        setApprovals(sorted);
      } catch (error) {
        console.error("Failed to fetch recent approvals", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, []);

  const todayCount = approvals.filter(
    a => a.created_at && new Date(a.created_at).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E0E0E2] h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#1A1D1F]">Recent Approvals</h3>
        {todayCount > 0 && (
          <span className="bg-[#ECFDF5] text-[#10B981] text-xs font-semibold px-2.5 py-1 rounded-lg">
            {todayCount} TODAY
          </span>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {approvals.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#6E7191] space-y-2">
            <CheckCircle size={32} className="opacity-20" />
            <p className="text-sm">No recent approvals</p>
          </div>
        ) : (
          approvals.map((user) => (
            <div key={user.code} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F7F7F8] transition-colors border border-transparent hover:border-[#E0E0E2] group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center text-white font-semibold shadow-sm shrink-0">
                {user.email.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1A1D1F] truncate">{user.email}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#6E7191] bg-[#F1F5F9] px-1.5 py-0.5 rounded">
                    {user.role_code}
                  </span>
                  <span className="text-xs text-[#9A9CAE] truncate">
                    {user.created_at ? formatDistanceToNow(new Date(user.created_at), { addSuffix: true }) : '-'}
                  </span>
                </div>
              </div>
              <button className="p-1.5 rounded-lg text-[#9A9CAE] hover:text-[#1A1D1F] hover:bg-white opacity-0 group-hover:opacity-100 transition-all">
                <MoreHorizontal size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
