import { useState } from 'react';
import { MotivationalQuote } from '../components/admin-dashboard/MotivationalQuote';
import { QuickAccessTabs } from '../components/admin-dashboard/QuickAccessTabs';
import { MyCoursesTab } from '../components/student-workspace/MyCoursesTab';
 
export function MyCoursesPage() {
  const [activeSection, setActiveSection] = useState<'overview' | 'courses' | 'schedule' | 'progress'>('courses');
 
  return (
    <div className="space-y-6">
      <MotivationalQuote />
      <QuickAccessTabs
        activeSection={activeSection}
        onSectionChange={(s: any) => setActiveSection(s)}
        role="student"
      />
      <MyCoursesTab />
    </div>
  );
}
