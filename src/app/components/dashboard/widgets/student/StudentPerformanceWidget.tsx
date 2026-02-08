import { PerformanceChart } from '../../../PerformanceChart';

interface StudentPerformanceWidgetProps {
  isLoading?: boolean;
}

export default function StudentPerformanceWidget({ isLoading = false }: StudentPerformanceWidgetProps) {
  if (isLoading) {
    return <div className="h-[300px] bg-gray-100 animate-pulse rounded-2xl" />;
  }

  return (
    <div className="h-full">
      <PerformanceChart />
    </div>
  );
}
