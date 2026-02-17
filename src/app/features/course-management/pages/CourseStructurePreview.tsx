import { useParams, useNavigate } from 'react-router-dom';
import { Network, Folder, FileText, BarChart3, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { mockCourses } from '@/app/features/course-management/data/course-mock';

export function CourseStructurePreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const course = mockCourses.find(c => c.id === id);

  if (!course) {
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

  const totalModuleDuration = course.modules.reduce((sum, m) => sum + m.duration, 0);
  const durationUtilization = (totalModuleDuration / course.totalDuration) * 100;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/courses')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
            <p className="text-sm text-gray-600 mt-1">
              Course Structure Visualization
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(`/courses/${course.id}/update`)}>
          Edit Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Course Code</p>
                <p className="text-xl font-mono font-bold text-blue-600 mt-1">{course.code}</p>
              </div>
              <Network className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Duration</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{course.totalDuration}h</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Modules</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{course.moduleCount}</p>
              </div>
              <Folder className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Topics</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{course.topicCount}</p>
              </div>
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Duration Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Course Duration</p>
              <p className="text-2xl font-bold text-gray-900">{course.totalDuration}h</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Allocated to Modules</p>
              <p className="text-2xl font-bold text-blue-600">{totalModuleDuration}h</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Utilization</p>
              <p className="text-2xl font-bold text-green-600">{durationUtilization.toFixed(1)}%</p>
            </div>
          </div>
          <Progress value={durationUtilization} className="h-3" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course Hierarchy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Network className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-blue-900">{course.name}</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      {course.categoryName} • {course.totalDuration} hours
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                    {course.code}
                  </Badge>
                </div>
              </div>
            </div>

            {course.modules.length === 0 ? (
              <div className="ml-8 p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-600">No modules defined yet</p>
              </div>
            ) : (
              <div className="ml-8 space-y-4">
                {course.modules.map((module, index) => (
                  <div key={module.id} className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300" style={{ left: '-16px' }}></div>
                    <div className="absolute left-0 top-6 w-4 h-0.5 bg-gray-300" style={{ left: '-16px' }}></div>
                    <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <Folder className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-green-900">
                              Module {index + 1}: {module.name}
                            </h4>
                            <p className="text-sm text-green-700 mt-1">
                              {module.duration} hours • {module.topics.length} topics
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                            {module.hasTopics ? 'Has Topics' : 'No Topics'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {module.topics.length > 0 && (
                      <div className="ml-8 mt-3 space-y-2">
                        {module.topics.map((topic, topicIndex) => (
                          <div key={topic.id} className="relative">
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300" style={{ left: '-16px' }}></div>
                            <div className="absolute left-0 top-4 w-4 h-0.5 bg-gray-300" style={{ left: '-16px' }}></div>
                            <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                              <FileText className="w-4 h-4 text-orange-600 flex-shrink-0 mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-orange-900">
                                    Topic {topicIndex + 1}: {topic.name}
                                  </p>
                                  <span className="text-xs font-medium text-orange-700">
                                    {topic.duration}h
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
