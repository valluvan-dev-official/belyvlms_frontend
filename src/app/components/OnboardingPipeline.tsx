import { useEffect, useState, useMemo } from "react";
import { Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { listOnboardRequests } from "../onboardRequests/api";
import { BaseChart } from "./charts/BaseChart";
import { CHART_COLORS } from "./charts/chartConfig";

export function OnboardingPipeline() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await listOnboardRequests({});
        const requests = res.results || [];
        
        const pending = requests.filter(r => r.status === 'PENDING_APPROVAL' || r.status === 'INVITED').length;
        const approved = requests.filter(r => r.status === 'ONBOARDED').length;
        const rejected = requests.filter(r => r.status === 'DROPPED').length;
        
        setStats({
          pending,
          approved,
          rejected,
          total: requests.length
        });
      } catch (error) {
        console.error("Failed to fetch onboarding stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartData = useMemo(() => [
    { value: stats.approved, name: 'Approved', itemStyle: { color: CHART_COLORS.success } },
    { value: stats.pending, name: 'Pending', itemStyle: { color: CHART_COLORS.warning } },
    { value: stats.rejected, name: 'Rejected', itemStyle: { color: CHART_COLORS.danger } },
  ].filter(item => item.value > 0), [stats]);

  // If no data, show a placeholder
  const showPlaceholder = chartData.length === 0;
  const finalData = useMemo(() => showPlaceholder 
    ? [{ value: 1, name: 'No Data', itemStyle: { color: CHART_COLORS.grid } }] 
    : chartData, [chartData, showPlaceholder]);

  const chartOption = useMemo(() => ({
    grid: { show: false, top: 0, bottom: 0, left: 0, right: 0 },
    tooltip: {
      trigger: 'item',
      formatter: showPlaceholder ? 'No Data' : '{b}: {c} ({d}%)'
    },
    series: [
      {
        name: 'Onboarding Status',
        type: 'pie',
        radius: ['65%', '85%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: false },
        emphasis: { scale: false },
        data: finalData
      }
    ]
  }), [finalData, showPlaceholder]);

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E0E0E2] h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#1A1D1F]">Onboarding Pipeline</h3>
          <p className="text-sm text-[#6E7191]">Overview of user request statuses</p>
        </div>
        <button 
          onClick={() => navigate('/onboard-requests')}
          className="p-2 hover:bg-[#F7F7F8] rounded-lg transition-colors group"
          title="View All Requests"
        >
          <ArrowRight size={20} className="text-[#6E7191] group-hover:text-[#1A1D1F]" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 flex-1">
        <div className="w-48 h-48 relative shrink-0 mx-auto md:mx-0">
          <BaseChart 
             options={chartOption} 
             height={192} 
             loading={loading}
          />
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <span className="text-3xl font-bold text-[#1A1D1F]">{stats.total}</span>
            <span className="text-xs text-[#6E7191] font-medium">Total</span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFFBEB] border border-[#FEF3C7]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F59E0B] rounded-lg text-white">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A1D1F]">Pending Review</p>
                <p className="text-xs text-[#6E7191]">Requires action</p>
              </div>
            </div>
            <span className="text-lg font-bold text-[#F59E0B]">{stats.pending}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#10B981] rounded-lg text-white">
                <CheckCircle size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A1D1F]">Approved</p>
                <p className="text-xs text-[#6E7191]">Onboarded users</p>
              </div>
            </div>
            <span className="text-lg font-bold text-[#10B981]">{stats.approved}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#EF4444] rounded-lg text-white">
                <XCircle size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A1D1F]">Rejected</p>
                <p className="text-xs text-[#6E7191]">Dropped requests</p>
              </div>
            </div>
            <span className="text-lg font-bold text-[#EF4444]">{stats.rejected}</span>
          </div>
        </div>
      </div>

      <button 
        onClick={() => navigate('/onboard-requests?status=PENDING_APPROVAL')}
        className="w-full mt-6 py-2.5 bg-[#1A1D1F] text-white text-sm font-medium rounded-xl hover:bg-[#2B2F33] transition-all flex items-center justify-center gap-2"
      >
        Review Pending Requests
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
