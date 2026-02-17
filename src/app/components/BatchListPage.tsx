import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  Users,
  GraduationCap,
  TrendingUp,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { BatchStatusBadge } from '../components/batch-management/BatchStatusBadge';
import { DeliveryModeBadge } from '../components/batch-management/DeliveryModeBadge';
import { RiskLevelBadge } from '../components/batch-management/RiskLevelBadge';
import { CapacityIndicator } from '../components/batch-management/CapacityIndicator';
import { useBatch } from '../context/BatchContext';
import { Batch, BatchStatus, DeliveryMode } from '../types/batch';

export function BatchListPage() {
  const navigate = useNavigate();
  const { batches } = useBatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deliveryModeFilter, setDeliveryModeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = 
      batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.primaryTrainerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
    const matchesDeliveryMode = deliveryModeFilter === 'all' || batch.deliveryMode === deliveryModeFilter;
    
    return matchesSearch && matchesStatus && matchesDeliveryMode;
  });

  // Calculate analytics from actual batches
  const totalBatches = batches.length;
  const activeBatches = batches.filter(b => b.status === 'in-progress').length;
  const totalStudents = batches.reduce((sum, b) => sum + b.enrolledCount, 0);
  const capacityUtilization = batches.length > 0 
    ? Math.round((batches.reduce((sum, b) => sum + (b.enrolledCount / b.capacity), 0) / batches.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Batch Management</h1>
          <p className="text-gray-600 mt-1">Manage learning delivery batches, schedules, and enrollments</p>
        </div>
        <Button onClick={() => navigate('/batches/create')} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Batch
        </Button>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Batches</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalBatches}</p>
                <p className="text-xs text-green-600 mt-1">+12% vs last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Batches</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{activeBatches}</p>
                <p className="text-xs text-green-600 mt-1">Running smoothly</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalStudents}</p>
                <p className="text-xs text-blue-600 mt-1">Across all batches</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Attendance</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{capacityUtilization}%</p>
                <p className="text-xs text-green-600 mt-1">+2.3% improvement</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by batch name, course, or trainer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Delivery Mode Filter */}
            <Select value={deliveryModeFilter} onValueChange={setDeliveryModeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Delivery mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>

            {/* Export Button */}
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Batch Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Batches ({filteredBatches.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant={viewMode === 'table' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Table
              </Button>
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch Details</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBatches.map((batch) => (
                  <TableRow key={batch.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{batch.name}</div>
                        <div className="text-sm text-gray-500">ID: {batch.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{batch.courseName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">{batch.primaryTrainerName}</div>
                        {batch.backupTrainerName && (
                          <div className="text-xs text-gray-500">Backup: {batch.backupTrainerName}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(batch.startDate).toLocaleDateString()}</div>
                        <div className="text-gray-500">{new Date(batch.endDate).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <CapacityIndicator 
                        enrolled={batch.enrolledCount}
                        capacity={batch.capacity}
                        waitlist={batch.waitlistCount}
                        showDetails={false}
                      />
                      <div className="text-xs text-gray-600 mt-1">
                        {batch.enrolledCount}/{batch.capacity}
                        {batch.waitlistCount > 0 && ` (+${batch.waitlistCount})`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DeliveryModeBadge mode={batch.deliveryMode} />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-500">Attend:</span>
                          <span className="font-medium">{batch.attendanceRate}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-500">Complete:</span>
                          <span className="font-medium">{batch.completionRate}%</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <BatchStatusBadge status={batch.status} />
                    </TableCell>
                    <TableCell>
                      <RiskLevelBadge level={batch.riskLevel} showIcon={false} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/batches/${batch.id}`)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/batches/${batch.id}/edit`)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Batch
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/batches/${batch.id}/schedule`)}>
                            <Calendar className="w-4 h-4 mr-2" />
                            Manage Schedule
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/batches/${batch.id}/enrollments`)}>
                            <Users className="w-4 h-4 mr-2" />
                            Manage Enrollments
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate Batch
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Cancel Batch
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredBatches.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No batches found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
              <Button onClick={() => navigate('/batches/create')}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Batch
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
