import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Search, Plus } from "lucide-react";
import { toast } from "sonner";
import { listRoles, type Role } from "../../services/RbacService/RbacService";
import { SearchableSelect } from "../../components/ui/SearchableSelect";
import { listOnboardRequests } from "../api";
import type { OnboardRequestListItem } from "../types";
import { StatusBadge } from "../components/StatusBadge";
import { CreateOnboardRequestDialog } from "../components/CreateOnboardRequestDialog";
import { StatsOverview } from "../components/StatsOverview";

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

export function OnboardRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<OnboardRequestListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [filters, setFilters] = useState<{ status: string; role_code: string; search: string }>({
    status: "",
    role_code: "",
    search: "",
  });
  const [createOpen, setCreateOpen] = useState(false);

  const roleOptions = useMemo(() => [{ id: "", name: "All Roles" }, ...roles.map((r) => ({ id: r.code, name: `${r.code} - ${r.name}` }))], [roles]);

  const statusOptions = useMemo(
    () => [
      { id: "", name: "All Status" },
      { id: "INVITED", name: "INVITED" },
      { id: "PENDING_APPROVAL", name: "PENDING_APPROVAL" },
      { id: "ONBOARDED", name: "ONBOARDED" },
      { id: "DROPPED", name: "DROPPED" },
    ],
    [],
  );

  const fetchRoles = async () => {
    try {
      const r = await listRoles();
      setRoles(r);
    } catch {
      setRoles([]);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await listOnboardRequests({
        status: filters.status || undefined,
        role_code: filters.role_code || undefined,
        search: filters.search || undefined,
      });
      setRequests(res.results || []);
    } catch (err: any) {
      setRequests([]);
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchRequests();
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [filters.status, filters.role_code, filters.search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#1A1D1F] mb-1">Onboard Requests</h2>
          <p className="text-sm text-[#6E7191]">Create requests, review submissions, and onboard users.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRequests}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E0E0E2] rounded-xl hover:border-[#4ECDC4] transition-colors"
          >
            <RefreshCw size={18} className="text-[#6E7191]" />
            <span className="text-sm font-medium text-[#1A1D1F]">Refresh</span>
          </button>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white rounded-xl hover:shadow-lg transition-all"
          >
            <Plus size={18} />
            <span className="text-sm font-medium">Create Request</span>
          </button>
        </div>
      </div>

      <StatsOverview requests={requests} />

      <div className="bg-white rounded-2xl p-6 border border-[#E0E0E2]">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6E7191]" />
            <input
              type="text"
              placeholder="Search by code or email..."
              value={filters.search}
              onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F7F7F8] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#4ECDC4] focus:bg-white transition-all"
            />
          </div>

          <div className="min-w-[220px]">
            <SearchableSelect
              options={statusOptions}
              value={filters.status}
              onChange={(v) => setFilters((p) => ({ ...p, status: String(v) }))}
              placeholder="Status"
            />
          </div>

          <div className="min-w-[260px]">
            <SearchableSelect
              options={roleOptions}
              value={filters.role_code}
              onChange={(v) => setFilters((p) => ({ ...p, role_code: String(v) }))}
              placeholder="Role"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E0E0E2] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F7F7F8]">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#6E7191] uppercase tracking-wider">Code</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#6E7191] uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#6E7191] uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#6E7191] uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#6E7191] uppercase tracking-wider">Created</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#6E7191] uppercase tracking-wider">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E0E2]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-[#6E7191]">
                    Loading...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-[#6E7191]">
                    No onboard requests found.
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr
                    key={r.code}
                    onClick={() => navigate(`/management/onboard-requests/${encodeURIComponent(r.code)}`)}
                    className="hover:bg-[#F7F7F8] cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm font-mono text-[#1A1D1F]">{r.code}</td>
                    <td className="px-6 py-4 text-sm text-[#1A1D1F]">{r.email}</td>
                    <td className="px-6 py-4 text-sm text-[#1A1D1F]">{r.role_name || r.role_code}</td>
                    <td className="px-6 py-4 text-sm">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6E7191]">{formatDate(r.created_at)}</td>
                    <td className="px-6 py-4 text-sm text-[#6E7191]">{formatDate(r.submitted_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateOnboardRequestDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={fetchRequests} />
    </div>
  );
}

