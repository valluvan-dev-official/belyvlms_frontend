import { HoursSpentChart } from '../../../HoursSpentChart';

interface StudentHoursWidgetProps {
  isLoading?: boolean;
}

export default function StudentHoursWidget({ isLoading = false }: StudentHoursWidgetProps) {
  if (isLoading) {
    return <div className="h-[300px] bg-gray-100 animate-pulse rounded-2xl" />;
  }

  return (
    <div className="h-full">
      <HoursSpentChart />
    </div>
  );
}
