import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, AlertCircle, CheckCircle, ChevronDown, ChevronUp, Code } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Progress } from '@/app/components/ui/progress';
import { CourseFormData, ModuleFormData, TopicFormData, CourseType } from '@/app/features/course-management/types/course';
import { mockCategories, mockCourses, generateCourseCode } from '@/app/features/course-management/data/course-mock';
import { toast } from 'sonner';

export function CourseCreation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CourseFormData>({
    name: '',
    categoryId: '',
    type: 'course',
    totalDuration: 0,
    modules: [],
  });

  const [generatedCode, setGeneratedCode] = useState('');
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formData.categoryId) {
      const category = mockCategories.find(c => c.id === formData.categoryId);
      if (category) {
        const code = generateCourseCode(category.code, mockCourses);
        setGeneratedCode(code);
      }
    } else {
      setGeneratedCode('');
    }
  }, [formData.categoryId]);

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
    const { modulesTotal, remaining } = calculateDurations();
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
        const topicNames = module.topics.map(t => t.name.toLowerCase().trim()).filter(n => n);
        const duplicateTopics = topicNames.filter((name, i) => topicNames.indexOf(name) !== i);
        if (duplicateTopics.length > 0) {
          newErrors[`module-${index}-topic-duplicate`] = 'Duplicate topic names found';
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
    console.log('Course created:', { ...formData, code: generatedCode });
    toast.success('Course created successfully!');
    navigate('/courses');
  };

  const { modulesTotal, remaining } = calculateDurations();
  const selectedCategory = mockCategories.find(c => c.id === formData.categoryId);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-sm text-gray-600 mt-1">
            Build course structure with modules and topics
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
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                  <SelectTrigger className={errors.categoryId ? 'border-red-500' : ''}>
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
                {errors.categoryId && <p className="text-sm text-red-600">{errors.categoryId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={generatedCode}
                  placeholder="Auto-generated"
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Course Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as CourseType })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="module">Module</SelectItem>
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
                  className={errors.totalDuration ? 'border-red-500' : ''}
                />
                {errors.totalDuration && <p className="text-sm text-red-600">{errors.totalDuration}</p>}
              </div>
            </div>

            {generatedCode && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Auto-Generated Course Code</p>
                    <p className="text-lg font-mono font-bold text-blue-600 mt-1">{generatedCode}</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Based on category: {selectedCategory?.name} ({selectedCategory?.code})
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {formData.totalDuration > 0 && (
          <Card className={remaining < 0 ? 'border-red-300 bg-red-50' : remaining === 0 ? 'border-green-300 bg-green-50' : 'border-yellow-300 bg-yellow-50'}>
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-900 mb-3">Course Duration Validation</h3>
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-sm text-gray-600">Course Duration</p>
                  <p className="text-xl font-bold text-gray-900">{formData.totalDuration}h</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Modules Allocated</p>
                  <p className="text-xl font-bold text-blue-600">{modulesTotal}h</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p className={`text-xl font-bold ${remaining < 0 ? 'text-red-600' : remaining === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {remaining}h
                  </p>
                </div>
              </div>
              <Progress value={(modulesTotal / formData.totalDuration) * 100} className="h-2" />
              {remaining < 0 && (
                <div className="flex items-center gap-2 mt-3 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span>Module durations exceed course duration by {Math.abs(remaining)}h</span>
                </div>
              )}
              {remaining === 0 && (
                <div className="flex items-center gap-2 mt-3 text-sm text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span>All course duration allocated correctly</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
            {formData.modules.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No modules added yet. Click \"Add Module\" to start building course structure.</p>
              </div>
            ) : (
              formData.modules.map((module, moduleIndex) => {
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
                              {errors[`module-${moduleIndex}-name`] && (
                                <p className="text-sm text-red-600">{errors[`module-${moduleIndex}-name`]}</p>
                              )}
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
                              {errors[`module-${moduleIndex}-duration`] && (
                                <p className="text-sm text-red-600">{errors[`module-${moduleIndex}-duration`]}</p>
                              )}
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
                            {errors[`module-${moduleIndex}-topics`] && (
                              <p className="text-sm text-red-600 mt-2">{errors[`module-${moduleIndex}-topics`]}</p>
                            )}
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
                        {errors[`module-${moduleIndex}-topic-duplicate`] && (
                          <p className="text-sm text-red-600 mt-2">{errors[`module-${moduleIndex}-topic-duplicate`]}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
            {errors.modules && (
              <p className="text-sm text-red-600">{errors.modules}</p>
            )}
            {errors.duration && (
              <p className="text-sm text-red-600">{errors.duration}</p>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/courses')}>
            Cancel
          </Button>
          <Button type="submit">
            Create Course
          </Button>
        </div>
      </form>
    </div>
  );
}
