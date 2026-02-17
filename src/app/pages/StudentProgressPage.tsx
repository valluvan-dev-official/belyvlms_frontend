import { useState } from 'react';
import { MotivationalQuote } from '../components/admin-dashboard/MotivationalQuote';
import { QuickAccessTabs } from '../components/admin-dashboard/QuickAccessTabs';
import { StudentProgressSection } from '../components/student-dashboard/StudentProgressSection';
 
export function StudentProgressPage() {
  const [activeSection, setActiveSection] = useState<'overview' | 'courses' | 'schedule' | 'progress'>('progress');
  return (
    <div className="space-y-6">
      <MotivationalQuote />
      <QuickAccessTabs
        activeSection={activeSection}
        onSectionChange={(s: any) => setActiveSection(s)}
        role="student"
      />
      <StudentProgressSection />
    </div>
  );
}
