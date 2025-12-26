import { ChevronUp, ChevronDown } from 'lucide-react';

interface LeaderEntry {
  rank: number;
  name: string;
  avatar: string;
  course: number;
  hours: number;
  points: number;
  trend: 'up' | 'down';
}

const leaderData: LeaderEntry[] = [
  {
    rank: 1,
    name: 'Charlie Rawal',
    avatar: '👨‍💼',
    course: 53,
    hours: 250,
    points: 13680,
    trend: 'up'
  },
  {
    rank: 2,
    name: 'Ariana Agarwal',
    avatar: '👩‍💼',
    course: 88,
    hours: 212,
    points: 10333,
    trend: 'down'
  }
];

export function LeaderBoard() {
  return (
    <div className="bg-white rounded-2xl p-6">
      <h3 className="font-semibold text-[#1A1D1F] mb-6">Leader Board</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#F5F5F7]">
              <th className="text-left pb-4 text-xs font-medium text-[#6E7191] uppercase tracking-wider">Rank</th>
              <th className="text-left pb-4 text-xs font-medium text-[#6E7191] uppercase tracking-wider">Name</th>
              <th className="text-left pb-4 text-xs font-medium text-[#6E7191] uppercase tracking-wider">Course</th>
              <th className="text-left pb-4 text-xs font-medium text-[#6E7191] uppercase tracking-wider">Hour</th>
              <th className="text-left pb-4 text-xs font-medium text-[#6E7191] uppercase tracking-wider">Point</th>
            </tr>
          </thead>
          <tbody>
            {leaderData.map((entry, index) => (
              <tr key={entry.rank} className={index !== leaderData.length - 1 ? 'border-b border-[#F5F5F7]' : ''}>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[#1A1D1F] font-medium">{entry.rank}</span>
                    {entry.trend === 'up' ? (
                      <ChevronUp size={16} className="text-[#4ECDC4]" />
                    ) : (
                      <ChevronDown size={16} className="text-[#FF6B9D]" />
                    )}
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E0E0E2] to-[#F5F5F7] flex items-center justify-center">
                      <span className="text-lg">{entry.avatar}</span>
                    </div>
                    <span className="text-[#1A1D1F]">{entry.name}</span>
                  </div>
                </td>
                <td className="py-4 text-[#6E7191]">{entry.course}</td>
                <td className="py-4 text-[#6E7191]">{entry.hours}</td>
                <td className="py-4 text-[#4ECDC4] font-medium">{entry.points.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
