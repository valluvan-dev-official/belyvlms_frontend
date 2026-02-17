import { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  AlertTriangle,
  Target,
  Award,
  Activity,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { BatchStatusBadge } from '../components/batch-management/BatchStatusBadge';
import { RiskLevelBadge } from '../components/batch-management/RiskLevelBadge';
import { mockBatches, mockBatchAnalytics } from '../data/batch-mock';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function BatchMonitoringDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const statusData = Object.entries(mockBatchAnalytics.batchesByStatus).map(([status, count]) => ({
    name: status.replace('-', ' '),
    value: count,
  }));

  const deliveryModeData = Object.entries(mockBatchAnalytics.batchesByDeliveryMode).map(([mode, count]) => ({
    name: mode,
    value: count,
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Batch Monitoring Dashboard</h1>
        <p className="text-gray-600 mt-1">Real-time batch performance, attendance tracking, and delivery analytics</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Batches</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{mockBatchAnalytics.activeBatches}</p>
                <p className="text-xs text-green-600 mt-1">
                  {((mockBatchAnalytics.activeBatches / mockBatchAnalytics.totalBatches) * 100).toFixed(0)}% of total
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Attendance</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{mockBatchAnalytics.averageAttendanceRate.toFixed(1)}%</p>
                <p className="text-xs text-green-600 mt-1">+2.3% vs last month</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{mockBatchAnalytics.averageCompletionRate.toFixed(1)}%</p>
                <p className="text-xs text-green-600 mt-1">Target: 75%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dropout Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{mockBatchAnalytics.dropoutRate.toFixed(1)}%</p>
                <p className="text-xs text-red-600 mt-1">Monitor closely</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Batch Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Batch Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Delivery Mode Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Mode Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={deliveryModeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Batch Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockBatchAnalytics.monthlyBatchTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="created" stroke="#3b82f6" name="Created" />
                  <Line type="monotone" dataKey="completed" stroke="#10b981" name="Completed" />
                  <Line type="monotone" dataKey="cancelled" stroke="#ef4444" name="Cancelled" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          {/* Top Performing Batches */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Batches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBatchAnalytics.topPerformingBatches.map((batch) => (
                  <div key={batch.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">{batch.name}</h4>
                        <BatchStatusBadge status={batch.status} />
                      </div>
                      <p className="text-sm text-gray-600">{batch.courseName}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div>
                        <p className="text-sm text-gray-600">Attendance</p>
                        <p className="text-lg font-bold text-green-600">{batch.attendanceRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Completion</p>
                        <p className="text-lg font-bold text-blue-600">{batch.completionRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Dropout</p>
                        <p className="text-lg font-bold text-red-600">{batch.dropoutRate}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Capacity Utilization */}
          <Card>
            <CardHeader>
              <CardTitle>Capacity Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Utilization</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {mockBatchAnalytics.averageCapacityUtilization.toFixed(1)}%
                  </span>
                </div>
                <Progress value={mockBatchAnalytics.averageCapacityUtilization} className="h-3" />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">Optimal</p>
                    <p className="text-lg font-bold text-green-900">75-90%</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-700">Current</p>
                    <p className="text-lg font-bold text-yellow-900">
                      {mockBatchAnalytics.averageCapacityUtilization.toFixed(0)}%
                    </p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">Total Students</p>
                    <p className="text-lg font-bold text-blue-900">{mockBatchAnalytics.totalStudents}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockBatchAnalytics.monthlyBatchTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="averageAttendance" 
                    stroke="#10b981" 
                    name="Average Attendance %" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Batch Attendance Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Batch-wise Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockBatches.filter(b => b.status === 'in-progress').map((batch) => (
                  <div key={batch.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{batch.name}</h4>
                        <p className="text-sm text-gray-600">{batch.courseName}</p>
                      </div>
                      <Badge 
                        variant="outline"
                        className={
                          batch.attendanceRate >= 90 ? 'bg-green-50 text-green-700 border-green-300' :
                          batch.attendanceRate >= 75 ? 'bg-yellow-50 text-yellow-700 border-yellow-300' :
                          'bg-red-50 text-red-700 border-red-300'
                        }
                      >
                        {batch.attendanceRate}%
                      </Badge>
                    </div>
                    <Progress value={batch.attendanceRate} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>At-Risk Batches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBatchAnalytics.atRiskBatches.map((batch) => (
                  <div key={batch.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-medium text-gray-900">{batch.name}</h4>
                          <RiskLevelBadge level={batch.riskLevel} />
                        </div>
                        <p className="text-sm text-gray-600">{batch.courseName}</p>
                      </div>
                      <BatchStatusBadge status={batch.status} />
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Attendance</p>
                        <p className={`text-sm font-medium ${
                          batch.attendanceRate >= 85 ? 'text-green-600' : 
                          batch.attendanceRate >= 70 ? 'text-yellow-600' : 
                          'text-red-600'
                        }`}>
                          {batch.attendanceRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Completion</p>
                        <p className={`text-sm font-medium ${
                          batch.completionRate >= 70 ? 'text-green-600' : 
                          batch.completionRate >= 50 ? 'text-yellow-600' : 
                          'text-red-600'
                        }`}>
                          {batch.completionRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Dropout</p>
                        <p className={`text-sm font-medium ${
                          batch.dropoutRate <= 5 ? 'text-green-600' : 
                          batch.dropoutRate <= 10 ? 'text-yellow-600' : 
                          'text-red-600'
                        }`}>
                          {batch.dropoutRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Enrolled</p>
                        <p className="text-sm font-medium text-gray-900">
                          {batch.enrolledCount}/{batch.capacity}
                        </p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <h5 className="text-sm font-medium text-yellow-900 mb-2">Risk Factors:</h5>
                      <ul className="space-y-1 text-sm text-yellow-800">
                        {batch.attendanceRate < 80 && (
                          <li>• Low attendance rate requires intervention</li>
                        )}
                        {batch.dropoutRate > 10 && (
                          <li>• High dropout rate - student engagement issue</li>
                        )}
                        {batch.completionRate < 50 && batch.status === 'in-progress' && (
                          <li>• Behind schedule on completion milestones</li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Mitigation Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Mitigation Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Conduct Mid-Batch Review</h4>
                    <p className="text-sm text-blue-700">
                      Schedule one-on-one sessions with at-risk students to understand challenges
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Users className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">Enhance Trainer Support</h4>
                    <p className="text-sm text-green-700">
                      Assign additional trainers or mentors to high-dropout batches
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-900 mb-1">Adjust Session Timing</h4>
                    <p className="text-sm text-purple-700">
                      Consider rescheduling sessions if attendance patterns show timing conflicts
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Trainer Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>Trainer Utilization Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Overall Trainer Utilization</span>
            <span className="text-2xl font-bold text-purple-600">
              {mockBatchAnalytics.trainerUtilizationRate.toFixed(1)}%
            </span>
          </div>
          <Progress value={mockBatchAnalytics.trainerUtilizationRate} className="h-3" />
          <p className="text-sm text-gray-600 mt-2">
            Target range: 70-85% for optimal workload distribution
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
