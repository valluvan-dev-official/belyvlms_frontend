import { useNavigate } from 'react-router-dom';
import { ArrowRight, UserCheck, Clock, CheckCircle, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export function OnboardingPipeline() {
  const navigate = useNavigate();

  const pipelineData = [
    { name: 'Pending', value: 12, color: '#f59e0b', icon: Clock },
    { name: 'Approved', value: 45, color: '#10b981', icon: CheckCircle },
    { name: 'Rejected', value: 8, color: '#ef4444', icon: XCircle }
  ];

  const total = pipelineData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#1A1D1F] flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] rounded-lg flex items-center justify-center">
              <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            Onboarding Pipeline
          </h3>
          <p className="text-xs sm:text-sm text-[#6E7191] mt-1">Application status overview</p>
        </div>
        <button
          onClick={() => navigate('/onboard-requests')}
          className="text-xs sm:text-sm font-semibold text-[#4ECDC4] hover:text-[#44A08D] flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-[#4ECDC4]/10 transition-all self-start sm:self-auto"
        >
          View All
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Chart and Stats */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* Pie Chart */}
        <div className="relative flex-shrink-0">
          <ResponsiveContainer width={160} height={160} className="sm:w-[180px] sm:h-[180px]">
            <PieChart>
              <Pie
                data={pipelineData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {pipelineData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Label */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-[#1A1D1F]">{total}</div>
            <div className="text-xs text-[#6E7191] font-medium">Total</div>
          </div>
        </div>

        {/* Stats List */}
        <div className="flex-1 w-full space-y-2 sm:space-y-3">
          {pipelineData.map((item) => {
            const Icon = item.icon;
            const percentage = ((item.value / total) * 100).toFixed(0);
            
            return (
              <div key={item.name} className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div 
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: item.color }} />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-[#1A1D1F]">{item.name}</div>
                    <div className="text-xs text-[#6E7191]">{percentage}% of total</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-bold text-[#1A1D1F]">{item.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
        <button
          onClick={() => navigate('/onboard-requests/approvals')}
          className="w-full bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          Review Pending Requests
        </button>
      </div>
    </div>
  );
}