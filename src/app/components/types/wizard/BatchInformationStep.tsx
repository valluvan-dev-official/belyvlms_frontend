import { useState } from 'react';
import { Calendar, MapPin, Monitor } from 'lucide-react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Button } from '../../ui/button';
import { BatchCreationForm, DeliveryMode } from '../../../types/batch';
import { mockCourses } from '../../../data/batch-mock';

interface BatchInformationStepProps {
  data: Partial<BatchCreationForm>;
  onComplete: (data: Partial<BatchCreationForm>) => void;
}

export function BatchInformationStep({ data, onComplete }: BatchInformationStepProps) {
  const [formData, setFormData] = useState({
    name: data.name || '',
    courseId: data.courseId || '',
    deliveryMode: data.deliveryMode || 'online' as DeliveryMode,
    startDate: data.startDate || '',
    endDate: data.endDate || '',
    capacity: data.capacity || 25,
    location: data.location || '',
    virtualPlatform: data.virtualPlatform || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const selectedCourse = mockCourses.find(c => c.id === formData.courseId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Batch Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Batch Name *</Label>
        <Input
          id="name"
          placeholder="e.g., FSW-2024-Q1"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <p className="text-xs text-gray-500">Choose a unique identifier for this batch</p>
      </div>

      {/* Course Selection */}
      <div className="space-y-2">
        <Label htmlFor="course">Course *</Label>
        <Select value={formData.courseId} onValueChange={(value) => setFormData({ ...formData, courseId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {mockCourses.filter(c => c.isActive).map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.name} ({course.duration})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCourse && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
            <p className="text-sm text-blue-900 font-medium">{selectedCourse.name}</p>
            <p className="text-xs text-blue-700 mt-1">{selectedCourse.description}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-blue-700">
              <span>Duration: {selectedCourse.duration}</span>
              <span>Level: {selectedCourse.level}</span>
              <span>Category: {selectedCourse.category}</span>
            </div>
          </div>
        )}
      </div>

      {/* Delivery Mode */}
      <div className="space-y-2">
        <Label htmlFor="deliveryMode">Delivery Mode *</Label>
        <Select 
          value={formData.deliveryMode} 
          onValueChange={(value) => setFormData({ ...formData, deliveryMode: value as DeliveryMode })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Batch Start Date *</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="startDate"
              type="date"
              className="pl-10"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">Estimated End Date *</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="endDate"
              type="date"
              className="pl-10"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      {/* Capacity */}
      <div className="space-y-2">
        <Label htmlFor="capacity">Batch Capacity *</Label>
        <Input
          id="capacity"
          type="number"
          min="1"
          max="100"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
          required
        />
        <p className="text-xs text-gray-500">Maximum number of students for this batch</p>
      </div>

      {/* Location / Virtual Platform */}
      {(formData.deliveryMode === 'offline' || formData.deliveryMode === 'hybrid') && (
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="location"
              placeholder="e.g., Building A, Room 301"
              className="pl-10"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
        </div>
      )}

      {(formData.deliveryMode === 'online' || formData.deliveryMode === 'hybrid') && (
        <div className="space-y-2">
          <Label htmlFor="virtualPlatform">Virtual Platform</Label>
          <div className="relative">
            <Monitor className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Select 
              value={formData.virtualPlatform} 
              onValueChange={(value) => setFormData({ ...formData, virtualPlatform: value })}
            >
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Zoom">Zoom</SelectItem>
                <SelectItem value="Microsoft Teams">Microsoft Teams</SelectItem>
                <SelectItem value="Google Meet">Google Meet</SelectItem>
                <SelectItem value="Webex">Webex</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="pt-4">
        <Button type="submit" className="w-full">
          Continue to Delivery Configuration
        </Button>
      </div>
    </form>
  );
}
