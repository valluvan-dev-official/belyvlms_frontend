import { createContext, useContext, useState, ReactNode } from 'react';
import { Batch, BatchCreationForm } from '../components/types/batch';
import { mockBatches } from '../components/data/batch-mock';

interface BatchContextType {
  batches: Batch[];
  addBatch: (formData: Partial<BatchCreationForm>) => Batch;
  updateBatch: (id: string, data: Partial<Batch>) => void;
  deleteBatch: (id: string) => void;
  getBatchById: (id: string) => Batch | undefined;
  saveDraft: (formData: Partial<BatchCreationForm>) => Batch;
}

const BatchContext = createContext<BatchContextType | undefined>(undefined);

export function BatchProvider({ children }: { children: ReactNode }) {
  const [batches, setBatches] = useState<Batch[]>(mockBatches);

  const addBatch = (formData: Partial<BatchCreationForm>): Batch => {
    const newBatch: Batch = {
      id: `BATCH-${Date.now()}`,
      name: formData.name || '',
      courseId: formData.courseId || '',
      courseName: getCourseNameById(formData.courseId || ''),
      deliveryMode: formData.deliveryMode || 'online',
      status: 'scheduled',
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      capacity: formData.capacity || 0,
      enrolledCount: 0,
      waitlistCount: 0,
      location: formData.location,
      virtualPlatform: formData.virtualPlatform,
      trainingFormat: formData.trainingFormat || 'instructor-led',
      sessionFrequency: formData.sessionFrequency || 'weekdays',
      timezone: formData.timezone || 'America/New_York',
      primaryTrainerId: formData.primaryTrainerId || '',
      primaryTrainerName: getTrainerNameById(formData.primaryTrainerId || ''),
      backupTrainerId: formData.backupTrainerId,
      backupTrainerName: formData.backupTrainerId ? getTrainerNameById(formData.backupTrainerId) : undefined,
      completionRate: 0,
      attendanceRate: 0,
      dropoutRate: 0,
      riskLevel: 'low',
      createdAt: new Date().toISOString(),
      createdBy: 'Current User',
      modifiedAt: new Date().toISOString(),
      modifiedBy: 'Current User',
    };

    setBatches(prev => [newBatch, ...prev]);
    return newBatch;
  };

  const saveDraft = (formData: Partial<BatchCreationForm>): Batch => {
    const draftBatch: Batch = {
      id: `DRAFT-${Date.now()}`,
      name: formData.name || 'Untitled Draft',
      courseId: formData.courseId || '',
      courseName: formData.courseId ? getCourseNameById(formData.courseId) : 'Not Selected',
      deliveryMode: formData.deliveryMode || 'online',
      status: 'draft',
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      capacity: formData.capacity || 0,
      enrolledCount: 0,
      waitlistCount: 0,
      location: formData.location,
      virtualPlatform: formData.virtualPlatform,
      trainingFormat: formData.trainingFormat || 'instructor-led',
      sessionFrequency: formData.sessionFrequency || 'weekdays',
      timezone: formData.timezone || 'America/New_York',
      primaryTrainerId: formData.primaryTrainerId || '',
      primaryTrainerName: formData.primaryTrainerId ? getTrainerNameById(formData.primaryTrainerId) : 'Not Assigned',
      backupTrainerId: formData.backupTrainerId,
      backupTrainerName: formData.backupTrainerId ? getTrainerNameById(formData.backupTrainerId) : undefined,
      completionRate: 0,
      attendanceRate: 0,
      dropoutRate: 0,
      riskLevel: 'low',
      createdAt: new Date().toISOString(),
      createdBy: 'Current User',
      modifiedAt: new Date().toISOString(),
      modifiedBy: 'Current User',
    };

    setBatches(prev => [draftBatch, ...prev]);
    return draftBatch;
  };

  const updateBatch = (id: string, data: Partial<Batch>) => {
    setBatches(prev => 
      prev.map(batch => 
        batch.id === id 
          ? { ...batch, ...data, modifiedAt: new Date().toISOString(), modifiedBy: 'Current User' }
          : batch
      )
    );
  };

  const deleteBatch = (id: string) => {
    setBatches(prev => prev.filter(batch => batch.id !== id));
  };

  const getBatchById = (id: string): Batch | undefined => {
    return batches.find(batch => batch.id === id);
  };

  return (
    <BatchContext.Provider value={{ 
      batches, 
      addBatch, 
      updateBatch, 
      deleteBatch, 
      getBatchById,
      saveDraft
    }}>
      {children}
    </BatchContext.Provider>
  );
}

export function useBatch() {
  const context = useContext(BatchContext);
  if (!context) {
    throw new Error('useBatch must be used within a BatchProvider');
  }
  return context;
}

// Helper functions
function getCourseNameById(courseId: string): string {
  const courses: Record<string, string> = {
    'CRS-001': 'Full Stack Web Development',
    'CRS-002': 'Data Science & Machine Learning',
    'CRS-003': 'Cloud Architecture (AWS)',
    'CRS-004': 'DevOps Engineering',
    'CRS-005': 'Cybersecurity Fundamentals',
  };
  return courses[courseId] || 'Unknown Course';
}

function getTrainerNameById(trainerId: string): string {
  const trainers: Record<string, string> = {
    'T001': 'Sarah Johnson',
    'T002': 'Michael Chen',
    'T003': 'Emily Rodriguez',
    'T004': 'David Kumar',
    'T005': 'Jessica Martinez',
  };
  return trainers[trainerId] || 'Unknown Trainer';
}
