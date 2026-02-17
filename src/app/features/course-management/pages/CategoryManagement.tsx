import { useState } from 'react';
import { Plus, Edit, Trash2, Book, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Category } from '@/app/features/course-management/types/course';
import { mockCategories, isCategoryCodeUnique } from '@/app/features/course-management/data/course-mock';
import { toast } from 'sonner';

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ code: '', name: '' });
  const [errors, setErrors] = useState<{ code?: string; name?: string }>({});

  const validateForm = (isEdit = false) => {
    const newErrors: { code?: string; name?: string } = {};
    if (!formData.code.trim()) {
      newErrors.code = 'Category code is required';
    } else if (!isCategoryCodeUnique(formData.code, categories, isEdit ? selectedCategory?.id : undefined)) {
      newErrors.code = 'Category code must be unique';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validateForm()) return;
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      code: formData.code.toUpperCase(),
      name: formData.name,
      courseCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCategories([...categories, newCategory]);
    setIsCreateDialogOpen(false);
    setFormData({ code: '', name: '' });
    setErrors({});
    toast.success('Category created successfully');
  };

  const handleEdit = () => {
    if (!selectedCategory || !validateForm(true)) return;
    setCategories(categories.map(cat =>
      cat.id === selectedCategory.id
        ? { ...cat, code: formData.code.toUpperCase(), name: formData.name, updatedAt: new Date().toISOString() }
        : cat
    ));
    setIsEditDialogOpen(false);
    setSelectedCategory(null);
    setFormData({ code: '', name: '' });
    setErrors({});
    toast.success('Category updated successfully');
  };

  const handleDelete = () => {
    if (!selectedCategory) return;
    if (selectedCategory.courseCount > 0) {
      toast.error('Cannot delete category with associated courses');
      return;
    }
    setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
    setIsDeleteDialogOpen(false);
    setSelectedCategory(null);
    toast.success('Category deleted successfully');
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setFormData({ code: category.code, name: category.name });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const openCreateDialog = () => {
    setFormData({ code: '', name: '' });
    setErrors({});
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Define course classification and code generation base
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Create Category
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Book className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-900">Category System</h4>
          <p className="text-sm text-blue-700 mt-1">
            Categories must be created before courses. Category codes are used to auto-generate course codes.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Code</TableHead>
                <TableHead>Category Name</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <span className="font-mono font-medium text-blue-600">{category.code}</span>
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                      {category.courseCount} courses
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(category.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(category)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(category)}
                        disabled={category.courseCount > 0}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Category Code *</Label>
              <Input
                id="code"
                placeholder="e.g., C2, TECH, BUS"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className={errors.code ? 'border-red-500' : ''}
              />
              {errors.code && (
                <p className="text-sm text-red-600">{errors.code}</p>
              )}
              <p className="text-xs text-gray-500">
                This code will be used to generate course codes (e.g., C2007)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Technical Training"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code">Category Code *</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className={errors.code ? 'border-red-500' : ''}
              />
              {errors.code && (
                <p className="text-sm text-red-600">{errors.code}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Category Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Update Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedCategory && selectedCategory.courseCount > 0 ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">Cannot Delete Category</h4>
                  <p className="text-sm text-red-700 mt-1">
                    This category has {selectedCategory.courseCount} associated courses. 
                    Please remove or reassign all courses before deleting.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-700">
                  Are you sure you want to delete <strong>{selectedCategory?.name}</strong>?
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  This action cannot be undone.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            {selectedCategory && selectedCategory.courseCount === 0 && (
              <Button variant="destructive" onClick={handleDelete}>
                Delete Category
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
