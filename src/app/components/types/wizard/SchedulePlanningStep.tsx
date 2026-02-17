import { useState } from 'react';
import { Calendar, Clock, Plus, Trash2, AlertCircle, Globe } from 'lucide-react';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { BatchCreationForm, BatchSchedule } from '../../../types/batch';

interface SchedulePlanningStepProps {
  data: Partial<BatchCreationForm>;
  onComplete: (data: Partial<BatchCreationForm>) => void;
}

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
];

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

export function SchedulePlanningStep({ data, onComplete }: SchedulePlanningStepProps) {
  const [formData, setFormData] = useState({
    timezone: data.timezone || 'America/New_York',
    schedules: data.schedules || [] as BatchSchedule[],
  });

  const [newSession, setNewSession] = useState({
    sessionTitle: '',
    sessionDate: '',
    startTime: '09:00',
    endTime: '12:00',
  });

  const [conflicts, setConflicts] = useState<string[]>([]);

  const addSession = () => {
    if (!newSession.sessionTitle || !newSession.sessionDate) return;

    const session: Partial<BatchSchedule> = {
      id: `session_${Date.now()}`,
      sessionNumber: formData.schedules.length + 1,
      sessionTitle: newSession.sessionTitle,
      sessionDate: newSession.sessionDate,
      startTime: newSession.startTime,
      endTime: newSession.endTime,
      trainerId: data.primaryTrainerId || '',
      trainerName: 'Primary Trainer',
      status: 'scheduled',
      attendanceCount: 0,
      completionStatus: false,
      conflicts: [],
    };

    setFormData({
      ...formData,
      schedules: [...formData.schedules, session as BatchSchedule],
    });

    // Reset form
    setNewSession({
      sessionTitle: '',
      sessionDate: '',
      startTime: '09:00',
      endTime: '12:00',
    });
  };

  const removeSession = (sessionId: string) => {
    setFormData({
      ...formData,
      schedules: formData.schedules.filter(s => s.id !== sessionId),
    });
  };

  const generateRecurringSchedule = () => {
    // Simple implementation - generate 10 weekday sessions
    const sessions: Partial<BatchSchedule>[] = [];
    const startDate = new Date(data.startDate || new Date());
    
    for (let i = 0; i < 10; i++) {
      const sessionDate = new Date(startDate);
      sessionDate.setDate(startDate.getDate() + (i * 2)); // Every 2 days
      
      // Skip weekends
      while (sessionDate.getDay() === 0 || sessionDate.getDay() === 6) {
        sessionDate.setDate(sessionDate.getDate() + 1);
      }

      sessions.push({
        id: `session_${Date.now()}_${i}`,
        sessionNumber: i + 1,
        sessionTitle: `Session ${i + 1}`,
        sessionDate: sessionDate.toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '12:00',
        trainerId: data.primaryTrainerId || '',
        trainerName: 'Primary Trainer',
        status: 'scheduled',
        attendanceCount: 0,
        completionStatus: false,
        conflicts: [],
      });
    }

    setFormData({
      ...formData,
      schedules: sessions as BatchSchedule[],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate schedules
    const newConflicts: string[] = [];
    
    if (formData.schedules.length === 0) {
      newConflicts.push('At least one session is required');
    }

    setConflicts(newConflicts);

    if (newConflicts.length === 0) {
      onComplete(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Timezone Selection */}
      <div className="space-y-2">
        <Label htmlFor="timezone">Timezone *</Label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
          <Select 
            value={formData.timezone} 
            onValueChange={(value) => setFormData({ ...formData, timezone: value })}
          >
            <SelectTrigger className="pl-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-gray-500">All session times will be displayed in this timezone</p>
      </div>

      {/* Quick Generate */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-blue-900">Quick Schedule Generation</h4>
            <p className="text-sm text-blue-700 mt-1">
              Generate recurring schedule based on session frequency
            </p>
          </div>
          <Button type="button" onClick={generateRecurringSchedule} variant="outline">
            Generate Schedule
          </Button>
        </div>
      </Card>

      {/* Add Session Form */}
      <Card className="p-4">
        <h4 className="font-medium text-gray-900 mb-4">Add Session Manually</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="sessionTitle">Session Title</Label>
            <Input
              id="sessionTitle"
              placeholder="e.g., Introduction to React"
              value={newSession.sessionTitle}
              onChange={(e) => setNewSession({ ...newSession, sessionTitle: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sessionDate">Session Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="sessionDate"
                type="date"
                className="pl-10"
                value={newSession.sessionDate}
                onChange={(e) => setNewSession({ ...newSession, sessionDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2 grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Select 
                value={newSession.startTime} 
                onValueChange={(value) => setNewSession({ ...newSession, startTime: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Select 
                value={newSession.endTime} 
                onValueChange={(value) => setNewSession({ ...newSession, endTime: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Button 
          type="button" 
          onClick={addSession} 
          className="w-full mt-4"
          disabled={!newSession.sessionTitle || !newSession.sessionDate}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Session
        </Button>
      </Card>

      {/* Sessions List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Scheduled Sessions ({formData.schedules.length})</Label>
          {formData.schedules.length > 0 && (
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => setFormData({ ...formData, schedules: [] })}
            >
              Clear All
            </Button>
          )}
        </div>

        {formData.schedules.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No sessions scheduled yet</p>
            <p className="text-sm text-gray-500">
              Use quick generation or add sessions manually
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {formData.schedules.map((session, index) => (
              <Card key={session.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline"># {session.sessionNumber}</Badge>
                      <h4 className="font-medium text-gray-900">{session.sessionTitle}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(session.sessionDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{session.startTime} - {session.endTime}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSession(session.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Conflicts Warning */}
      {conflicts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-900 mb-2">Schedule Issues</h4>
              <ul className="space-y-1">
                {conflicts.map((conflict, index) => (
                  <li key={index} className="text-sm text-red-700">• {conflict}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Summary */}
      {formData.schedules.length > 0 && (
        <Card className="p-4 bg-green-50 border-green-200">
          <h4 className="font-medium text-green-900 mb-3">Schedule Summary</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-green-700">Total Sessions</p>
              <p className="text-2xl font-bold text-green-900">{formData.schedules.length}</p>
            </div>
            <div>
              <p className="text-green-700">Start Date</p>
              <p className="text-lg font-medium text-green-900">
                {formData.schedules.length > 0 
                  ? new Date(formData.schedules[0].sessionDate).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-green-700">End Date</p>
              <p className="text-lg font-medium text-green-900">
                {formData.schedules.length > 0 
                  ? new Date(formData.schedules[formData.schedules.length - 1].sessionDate).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="pt-4">
        <Button type="submit" className="w-full">
          Continue to Review & Confirm
        </Button>
      </div>
    </form>
  );
}
