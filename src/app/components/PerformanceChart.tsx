import { ChevronDown } from 'lucide-react';

export function PerformanceChart() {
  const progress = 0.72; // 72% progress for 8,966 points
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-[#1A1D1F]">Performance</h3>
        <button className="flex items-center gap-1 text-sm text-[#6E7191] bg-[#F7F7F8] rounded-lg px-3 py-2">
          Monthly
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="flex flex-col items-center">
        {/* Circular Progress */}
        <div className="relative w-48 h-48 mb-4">
          {/* Background circle */}
          <svg className="transform -rotate-90 w-full h-full">
            <circle
              cx="96"
              cy="96"
              r="90"
              stroke="#F5F5F7"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="96"
              cy="96"
              r="90"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4ECDC4" />
                <stop offset="100%" stopColor="#44A08D" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF9066] to-[#FF6B9D] flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="text-center mb-2">
          <div className="text-[#6E7191] text-sm mb-1">Your Point</div>
          <div className="text-[#1A1D1F] font-bold text-2xl">8,966</div>
        </div>

        {/* Leaderboard link */}
        <div className="flex items-center gap-1 text-sm text-[#4ECDC4]">
          <span>5th in Leaderboard</span>
          <span>🎯</span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-[#4ECDC4] to-[#44A08D]"></div>
            <span className="text-sm text-[#6E7191]">Point Progress</span>
          </div>
        </div>
      </div>
    </div>
  );
}
