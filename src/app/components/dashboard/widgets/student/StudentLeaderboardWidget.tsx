import { LeaderBoard } from '../../../LeaderBoard';

interface StudentLeaderboardWidgetProps {
  isLoading?: boolean;
}

export default function StudentLeaderboardWidget({ isLoading = false }: StudentLeaderboardWidgetProps) {
  if (isLoading) {
    return <div className="h-[400px] bg-gray-100 animate-pulse rounded-2xl" />;
  }

  return (
    <div className="h-full">
      <LeaderBoard />
    </div>
  );
}
