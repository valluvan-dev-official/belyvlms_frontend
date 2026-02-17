import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, AlertTriangle, Plus, Trash2, ChevronDown, ChevronUp, Code } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Progress } from '@/app/components/ui/progress';
import { CourseFormData, ModuleFormData, TopicFormData, CourseType } from '@/app/features/course-management/types/course';
import { mockCourses, mockCategories } from '@/app/features/course-management/data/course-mock';
import { toast } from 'sonner';

export function CourseUpdate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const course = mockCourses.find(c => c.id === id);

  const [formData, setFormData] = useState<CourseFormData | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (course) {
      const courseFormData: CourseFormData = {
        name: course.name,
        categoryId: course.categoryId,
        type: course.type,
        totalDuration: course.totalDuration,
        modules: course.modules.map(m => ({
          id: m.id,
          name: m.name,
          duration: m.duration,
          hasTopics: m.hasTopics,
          topics: m.topics.map(t => ({
            id: t.id,
            name: t.name,
            duration: t.duration,
          })),
        })),
      };
      setFormData(courseFormData);
      setExpandedModules(new Set(course.modules.map((_, idx) => idx)));
    }
  }, [course]);

  if (!course || !formData) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">Course not found</p>
          <Button onClick={() => navigate('/courses')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const calculateDurations = () => {
    const modulesTotal = formData.modules.reduce((sum, mod) => sum + (mod.duration || 0), 0);
    const remaining = formData.totalDuration - modulesTotal;
    return { modulesTotal, remaining };
  };

  const calculateModuleDuration = (module: ModuleFormData) => {
    if (!module.hasTopics) return { topicsTotal: 0, remaining: module.duration };
    const topicsTotal = module.topics.reduce((sum, topic) => sum + (topic.duration || 0), 0);
    const remaining = module.duration - topicsTotal;
    return { topicsTotal, remaining };
  };

  const addModule = () => {
    const newModule: ModuleFormData = {
      id: `temp-${Date.now()}`,
      name: '',
      duration: 0,
      hasTopics: false,
      topics: [],
    };
    setFormData({ ...formData, modules: [...formData.modules, newModule] });
    setExpandedModules(new Set([...expandedModules, formData.modules.length]));
  };

  const removeModule = (index: number) => {
    const newModules = formData.modules.filter((_, i) => i !== index);
    setFormData({ ...formData, modules: newModules });
    const newExpanded = new Set(expandedModules);
    newExpanded.delete(index);
    setExpandedModules(newExpanded);
  };

  const updateModule = (index: number, updates: Partial<ModuleFormData>) => {
    const newModules = [...formData.modules];
    newModules[index] = { ...newModules[index], ...updates };
    setFormData({ ...formData, modules: newModules });
  };

  const addTopic = (moduleIndex: number) => {
    const newTopic: TopicFormData = {
      id: `temp-topic-${Date.now()}`,
      name: '',
      duration: 0,
    };
    const newModules = [...formData.modules];
    newModules[moduleIndex].topics.push(newTopic);
    setFormData({ ...formData, modules: newModules });
  };

  const removeTopic = (moduleIndex: number, topicIndex: number) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].topics = newModules[moduleIndex].topics.filter((_, i) => i !== topicIndex);
    setFormData({ ...formData, modules: newModules });
  };

  const updateTopic = (moduleIndex: number, topicIndex: number, updates: Partial<TopicFormData>) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].topics[topicIndex] = {
      ...newModules[moduleIndex].topics[topicIndex],
      ...updates,
    };
    setFormData({ ...formData, modules: newModules });
  };

  const toggleModuleExpand = (index: number) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedModules(newExpanded);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Course name is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (formData.totalDuration <= 0) newErrors.totalDuration = 'Total duration must be greater than 0';
    const { modulesTotal } = calculateDurations();
    if (modulesTotal > formData.totalDuration) {
      newErrors.duration = 'Module durations exceed course duration';
    }
    const moduleNames = formData.modules.map(m => m.name.toLowerCase().trim()).filter(n => n);
    const duplicateModules = moduleNames.filter((name, index) => moduleNames.indexOf(name) !== index);
    if (duplicateModules.length > 0) {
      newErrors.modules = 'Duplicate module names found';
    }
    formData.modules.forEach((module, index) => {
      if (!module.name.trim()) {
        newErrors[`module-${index}-name`] = 'Module name is required';
      }
      if (module.duration <= 0) {
        newErrors[`module-${index}-duration`] = 'Module duration must be greater than 0';
      }
      if (module.hasTopics) {
        const { topicsTotal } = calculateModuleDuration(module);
        if (topicsTotal !== module.duration) {
          newErrors[`module-${index}-topics`] = 'Topic durations must equal module duration';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix all validation errors');
      return;
    }
    console.log('Course updated:', formData);
    toast.success('Course updated successfully!');
    navigate('/courses');
  };

  const { modulesTotal, remaining } = calculateDurations();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
          <p className="text-sm text-gray-600 mt-1">
            Update course structure and configuration
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/courses')}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Course Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Full Stack React Development"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? 'border-red-500' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name} ({cat.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Total Course Duration (hours) *</Label>
                <Input
                  id="duration"
                  type="number"
                  step="0.5"
                  min="0"
                  placeholder="e.g., 80"
                  value={formData.totalDuration || ''}
                  onChange={(e) => setFormData({ ...formData, totalDuration: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Module Builder</CardTitle>
              <Button type="button" onClick={addModule} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Module
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.modules.map((module, moduleIndex) => {
              const { topicsTotal, remaining: moduleRemaining } = calculateModuleDuration(module);
              const isExpanded = expandedModules.has(moduleIndex);
              return (
                <div key={moduleIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Module {moduleIndex + 1}</h4>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleModuleExpand(moduleIndex)}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeModule(moduleIndex)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Module Name *</Label>
                            <Input
                              placeholder="e.g., React Fundamentals"
                              value={module.name}
                              onChange={(e) => updateModule(moduleIndex, { name: e.target.value })}
                              className={errors[`module-${moduleIndex}-name`] ? 'border-red-500' : ''}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Module Duration (hours) *</Label>
                            <Input
                              type="number"
                              step="0.5"
                              min="0"
                              placeholder="e.g., 20"
                              value={module.duration || ''}
                              onChange={(e) => updateModule(moduleIndex, { duration: parseFloat(e.target.value) || 0 })}
                              className={errors[`module-${moduleIndex}-duration`] ? 'border-red-500' : ''}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`has-topics-${moduleIndex}`}
                            checked={module.hasTopics}
                            onCheckedChange={(checked) => updateModule(moduleIndex, { hasTopics: checked as boolean })}
                          />
                          <Label htmlFor={`has-topics-${moduleIndex}`} className="cursor-pointer">
                            This module has topics
                          </Label>
                        </div>
                      </div>
                    )}
                  </div>

                  {isExpanded && module.hasTopics && (
                    <div className="p-4 bg-white border-t border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900">Topics</h5>
                        <Button
                          type="button"
                          onClick={() => addTopic(moduleIndex)}
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Topic
                        </Button>
                      </div>

                      {module.duration > 0 && module.topics.length > 0 && (
                        <div className={`mb-4 p-3 rounded-lg ${moduleRemaining !== 0 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div>
                              <p className="text-gray-600">Module Duration</p>
                              <p className="font-bold">{module.duration}h</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Topics Allocated</p>
                              <p className="font-bold text-blue-600">{topicsTotal}h</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Remaining</p>
                              <p className={`font-bold ${moduleRemaining !== 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {moduleRemaining}h
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        {module.topics.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No topics added yet
                          </p>
                        ) : (
                          module.topics.map((topic, topicIndex) => (
                            <div key={topicIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm font-medium text-gray-600 w-8">
                                {topicIndex + 1}.
                              </span>
                              <Input
                                placeholder="Topic name"
                                value={topic.name}
                                onChange={(e) => updateTopic(moduleIndex, topicIndex, { name: e.target.value })}
                                className="flex-1"
                              />
                              <Input
                                type="number"
                                step="0.5"
                                min="0"
                                placeholder="Hours"
                                value={topic.duration || ''}
                                onChange={(e) => updateTopic(moduleIndex, topicIndex, { duration: parseFloat(e.target.value) || 0 })}
                                className="w-24"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTopic(moduleIndex, topicIndex)}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/courses')}>
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
