import { useState } from 'react';
import { MotivationalQuote } from '../components/admin-dashboard/MotivationalQuote';
import { QuickAccessTabs } from '../components/admin-dashboard/QuickAccessTabs';
import { StudentScheduleSection } from '../components/student-dashboard/StudentScheduleSection';
 
export function StudentSchedulePage() {
  const [activeSection, setActiveSection] = useState<'overview' | 'courses' | 'schedule' | 'progress'>('schedule');
  return (
    <div className="space-y-6">
      <MotivationalQuote />
      <QuickAccessTabs
        activeSection={activeSection}
        onSectionChange={(s: any) => setActiveSection(s)}
        role="student"
      />
      <StudentScheduleSection />
    </div>
  );
}
