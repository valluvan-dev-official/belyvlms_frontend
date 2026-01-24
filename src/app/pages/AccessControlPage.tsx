import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Shield, 
  Save, 
  X, 
  Edit, 
  Trash2, 
  Users, 
  Info, 
  Plus, 
  Search, 
  ListFilter, 
  Check, 
  AlertCircle
} from 'lucide-react';
import AccessControlService, { Role, Permission, PermissionMatrix } from '../services/AccessControlService/AccessControlService';

export function AccessControlPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'matrix' | 'roles' | 'permissions'>('matrix');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab && ['matrix', 'roles', 'permissions'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [location.search]);

  const handleTabChange = (tab: 'matrix' | 'roles' | 'permissions') => {
    setActiveTab(tab);
    navigate(`?tab=${tab}`, { replace: true });
  };
  
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionMatrix, setPermissionMatrix] = useState<PermissionMatrix>({});
  const [originalMatrix, setOriginalMatrix] = useState<PermissionMatrix>({});
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hoveredPermission, setHoveredPermission] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Refs for scrolling synchronization
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const topScrollRef = useRef<HTMLDivElement>(null);
  const isSyncingRef = useRef(false);
  const [tableWidth, setTableWidth] = useState(0);

  // Role Management State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleForm, setRoleForm] = useState({ name: '', code: '', color: '#4ECDC4' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  // Load Data on Mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [fetchedRoles, fetchedPermissions] = await Promise.all([
          AccessControlService.getRoles(),
          AccessControlService.getPermissions()
        ]);

        setRoles(fetchedRoles.sort((a, b) => {
          // Custom sort: Super Admin first, then Admin, then others
          const getPriority = (roleName: string) => {
            const name = roleName.toLowerCase();
            if (name.includes('super admin')) return 0;
            if (name === 'admin' || name === 'administrator') return 1;
            return 2;
          };
          return getPriority(a.name) - getPriority(b.name);
        }));
        setPermissions(fetchedPermissions);

        // Build Matrix
        const matrix: PermissionMatrix = {};
        fetchedRoles.forEach(role => {
          matrix[role.id] = {};
          fetchedPermissions.forEach(perm => {
            // Super Admin always has all permissions
            if (role.name.toLowerCase().includes('super admin')) {
              matrix[role.id][perm.id] = true;
            } else {
              matrix[role.id][perm.id] = false;
            }
          });
        });

        // Fetch existing assignments for each role
        await Promise.all(fetchedRoles.map(async (role) => {
          // Skip fetching for Super Admin as we assume full access
          if (role.name.toLowerCase().includes('super admin')) return;
          
          const assignedCodes = await AccessControlService.getRolePermissions(role.id);
          assignedCodes.forEach(code => {
            if (matrix[role.id][code] !== undefined) {
              matrix[role.id][code] = true;
            }
          });
        }));

        setPermissionMatrix(matrix);
        setOriginalMatrix(JSON.parse(JSON.stringify(matrix)));
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load access control data", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Measure table width for top scrollbar
  useEffect(() => {
    if (tableContainerRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          setTableWidth(entry.target.scrollWidth);
        }
      });
      resizeObserver.observe(tableContainerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [activeTab, roles, isLoading]);

  // Synchronize scrolling
  useEffect(() => {
    const tableContainer = tableContainerRef.current;
    const topScroll = topScrollRef.current;

    if (!tableContainer || !topScroll) return;

    const handleTableScroll = () => {
      if (!isSyncingRef.current) {
        isSyncingRef.current = true;
        topScroll.scrollLeft = tableContainer.scrollLeft;
        isSyncingRef.current = false;
      }
    };

    const handleTopScroll = () => {
      if (!isSyncingRef.current) {
        isSyncingRef.current = true;
        tableContainer.scrollLeft = topScroll.scrollLeft;
        isSyncingRef.current = false;
      }
    };

    tableContainer.addEventListener('scroll', handleTableScroll);
    topScroll.addEventListener('scroll', handleTopScroll);

    return () => {
      tableContainer.removeEventListener('scroll', handleTableScroll);
      topScroll.removeEventListener('scroll', handleTopScroll);
    };
  }, [activeTab, isLoading]);

  const togglePermission = (roleId: string, permissionId: string) => {
    setPermissionMatrix(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [permissionId]: !prev[roleId][permissionId]
      }
    }));
    setHasUnsavedChanges(true);
  };

  const saveChanges = async () => {
    try {
      // Find roles that have changes
      const updatePromises = roles.map(async (role) => {
        const currentRolePerms = permissionMatrix[role.id];
        const originalRolePerms = originalMatrix[role.id];
        
        // Check if any permission changed for this role
        const hasChanged = permissions.some(perm => 
          currentRolePerms[perm.id] !== originalRolePerms[perm.id]
        );

        if (hasChanged) {
          // Get list of active permission codes
          const activePermissionCodes = permissions
            .filter(perm => currentRolePerms[perm.id])
            .map(perm => perm.id); // id maps to code
            
          await AccessControlService.assignPermissions(role.id, activePermissionCodes);
        }
      });

      await Promise.all(updatePromises);

      setOriginalMatrix(JSON.parse(JSON.stringify(permissionMatrix)));
      setHasUnsavedChanges(false);
      alert('Permissions saved successfully!');
    } catch (error) {
      console.error('Failed to save permissions:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  const cancelChanges = () => {
    setPermissionMatrix(JSON.parse(JSON.stringify(originalMatrix)));
    setHasUnsavedChanges(false);
  };

  // Role Management Handlers
  const openCreateRoleModal = () => {
    setEditingRole(null);
    setRoleForm({ name: '', code: '', color: '#4ECDC4' });
    setIsRoleModalOpen(true);
  };

  const openEditRoleModal = (role: Role) => {
    setEditingRole(role);
    setRoleForm({ name: role.name, code: role.code, color: role.color || '#4ECDC4' });
    setIsRoleModalOpen(true);
  };

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let updatedRole: Role;
      if (editingRole) {
        updatedRole = await AccessControlService.updateRole(editingRole.id, roleForm);
        setRoles(prevRoles => prevRoles.map(r => r.id === updatedRole.id ? updatedRole : r));
      } else {
        updatedRole = await AccessControlService.createRole(roleForm);
        setRoles(prevRoles => [...prevRoles, updatedRole]);
        
        // Initialize matrix for new role
        setPermissionMatrix(prev => ({
          ...prev,
          [updatedRole.id]: {}
        }));
        setOriginalMatrix(prev => ({
          ...prev,
          [updatedRole.id]: {}
        }));
      }
      setIsRoleModalOpen(false);
      setEditingRole(null);
    } catch (error) {
      console.error('Error saving role:', error);
      alert('Failed to save role. Please try again.');
    }
  };

  const confirmDeactivateRole = (role: Role) => {
    navigate(`/management/access-control/deactivate/${role.id}`);
  };


  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4ECDC4]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-[#E0E0E2] flex items-center justify-center shadow-sm">
            <Shield size={20} className="text-[#4ECDC4]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1A1D1F]">Access Control</h1>
            <p className="text-sm text-[#6E7191]">Manage roles and permissions across the system</p>
          </div>
        </div>
        
        {hasUnsavedChanges && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
            <span className="text-sm text-[#F59E0B] font-medium flex items-center gap-1.5">
              <AlertCircle size={16} />
              Unsaved changes
            </span>
            <button 
              onClick={cancelChanges}
              className="px-4 py-2 text-sm font-medium text-[#6E7191] bg-white border border-[#E0E0E2] rounded-xl hover:bg-[#F7F7F8] transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={saveChanges}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#4ECDC4] rounded-xl hover:bg-[#44A08D] shadow-lg shadow-[#4ECDC4]/20 transition-all"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-6 mb-8">
        <button
          onClick={() => handleTabChange('matrix')}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'matrix' 
              ? 'bg-white text-[#1A1D1F] shadow-sm border border-[#E0E0E2]' 
              : 'text-[#6E7191] hover:text-[#1A1D1F] hover:bg-[#F7F7F8]'
          }`}
        >
          Matrix View
        </button>
        <button
          onClick={() => handleTabChange('roles')}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'roles' 
              ? 'bg-white text-[#1A1D1F] shadow-sm border border-[#E0E0E2]' 
              : 'text-[#6E7191] hover:text-[#1A1D1F] hover:bg-[#F7F7F8]'
          }`}
        >
          Role Management
        </button>
        <button
          onClick={() => handleTabChange('permissions')}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'permissions' 
              ? 'bg-white text-[#1A1D1F] shadow-sm border border-[#E0E0E2]' 
              : 'text-[#6E7191] hover:text-[#1A1D1F] hover:bg-[#F7F7F8]'
          }`}
        >
          Permission Library
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl border border-[#E0E0E2] shadow-sm overflow-hidden">
        {activeTab === 'matrix' && (
        <div className="flex flex-col">
          {/* Top Scrollbar Helper - Visible by default */}
          <div 
            ref={topScrollRef} 
            className="overflow-x-auto w-full border-b border-[#E0E0E2]"
            style={{ 
              scrollbarWidth: 'auto', // Ensure visible
              scrollbarGutter: 'stable',
            }}
          >
            <div style={{ width: tableWidth }} className="h-1"></div>
          </div>

          {/* Main Table Container */}
          <div 
            ref={tableContainerRef}
            className="overflow-x-auto w-full"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F7F8] border-b border-[#E0E0E2]">
                  <th className="p-6 min-w-[250px] text-xs font-bold text-[#6E7191] uppercase tracking-wider md:sticky md:left-0 bg-[#F7F7F8] z-30 border-r border-[#E0E0E2]">
                    PERMISSIONS
                  </th>
                  {roles.map(role => (
                    <th key={role.id} className="p-6 text-center min-w-[140px] align-top">
                      <div className="flex flex-col items-center gap-2">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-sm"
                          style={{ backgroundColor: role.color }}
                        >
                          {role.code}
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-bold text-[#1A1D1F]">{role.name}</span>
                          <span className="text-xs text-[#6E7191] flex items-center gap-1">
                            <Users size={12} />
                            {role.userCount}
                          </span>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E2]">
                {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                  <React.Fragment key={module}>
                    <tr className="bg-white">
                      <td className="p-4 px-6 border-b border-[#E0E0E2] md:sticky md:left-0 bg-white z-20 border-r border-[#E0E0E2]">
                        <span className="text-sm font-bold text-[#4ECDC4]">
                          {module}
                        </span>
                      </td>
                      <td className="p-0 border-b border-[#E0E0E2]" colSpan={roles.length}></td>
                    </tr>
                    {modulePermissions.map(permission => (
                      <tr 
                        key={permission.id} 
                        className="hover:bg-[#F9FAFB] transition-colors group border-b border-[#F5F5F7] last:border-none"
                        onMouseEnter={() => setHoveredPermission(permission.id)}
                        onMouseLeave={() => setHoveredPermission(null)}
                      >
                        <td className="p-6 py-4 md:sticky md:left-0 bg-white group-hover:bg-[#F9FAFB] z-20 border-r border-[#E0E0E2] border-opacity-50">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-[#1A1D1F]">{permission.name}</p>
                            {permission.description && (
                              <div className="group/tooltip relative flex items-center">
                                <Info size={14} className="text-[#9A9EA6] cursor-help" />
                                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-max max-w-[250px] bg-[#1A1D1F] text-white text-xs rounded-lg py-2 px-3 shadow-xl z-50 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all pointer-events-none">
                                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-[#1A1D1F]"></div>
                                  {permission.description}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        {roles.map(role => {
                          const isSuperAdmin = role.name.toLowerCase().includes('super admin');
                          return (
                            <td key={`${role.id}-${permission.id}`} className="p-4 text-center min-w-[140px]">
                              <button
                                onClick={() => !isSuperAdmin && togglePermission(role.id, permission.id)}
                                disabled={isSuperAdmin}
                                className={`w-6 h-6 rounded flex items-center justify-center transition-all duration-200 mx-auto ${
                                  permissionMatrix[role.id][permission.id]
                                    ? 'bg-[#E11D48] text-white shadow-sm'
                                    : 'bg-white border-2 border-[#E0E0E2] text-transparent hover:border-[#E11D48]'
                                } ${isSuperAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                <Check size={14} strokeWidth={4} className={`transition-transform duration-200 ${permissionMatrix[role.id][permission.id] ? 'scale-100' : 'scale-0'}`} />
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )} 
 
       {/* Role Management Tab */} 
      {activeTab === 'roles' && ( 
        <div className="p-6"> 
          {/* Action Bar */} 
          <div className="flex items-center justify-between mb-6"> 
            <div className="flex items-center gap-3"> 
              <div className="relative flex-1"> 
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6E7191]" /> 
                <input 
                  type="text" 
                  placeholder="Search roles..." 
                  className="pl-10 pr-4 py-2.5 bg-[#F7F7F8] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#4ECDC4] focus:bg-white transition-all w-80" 
                /> 
              </div> 
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#F7F7F8] rounded-xl hover:bg-[#4ECDC4] hover:text-white transition-all text-[#6E7191]"> 
                <ListFilter size={18} /> 
                <span className="text-sm font-medium">Filters</span> 
              </button> 
            </div> 
            <button 
              onClick={openCreateRoleModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#4ECDC4] text-white rounded-xl hover:shadow-lg transition-all hover:bg-[#44A08D]"
            >
              <Plus size={18} />
              <span className="text-sm font-medium">Create Role</span> 
            </button> 
          </div> 

          {/* Role Cards Grid */} 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> 
            {roles.map(role => ( 
              <div 
                key={role.id} 
                className="bg-white rounded-2xl border border-[#E0E0E2] p-6 hover:shadow-lg transition-all" 
              > 
                <div className="flex items-start justify-between mb-4"> 
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" 
                    style={{ backgroundColor: role.color }} 
                  > 
                    {role.code} 
                  </div> 
                  <div className="flex items-center gap-1"> 
                    <button 
                      onClick={() => openEditRoleModal(role)}
                      className="p-2 hover:bg-[#F7F7F8] rounded-lg transition-colors"
                    > 
                      <Edit size={16} className="text-[#6E7191]" /> 
                    </button> 
                    <button 
                      onClick={() => confirmDeactivateRole(role)}
                      className="p-2 text-[#6E7191] hover:text-[#FF3B3B] hover:bg-[#FFF5F5] rounded-lg transition-colors"
                      title="Deactivate Role"
                    >
                      <Trash2 size={16} />
                    </button> 
                  </div> 
                </div> 

                <h3 className="font-semibold text-[#1A1D1F] mb-1 text-lg">{role.name}</h3> 
                <p className="text-xs text-[#6E7191] mb-6">Role Code: {role.code}</p> 

                <div className="flex items-center gap-2 pt-4 border-t border-[#E0E0E2]"> 
                  <Users size={16} className="text-[#6E7191]" /> 
                  <span className="text-sm text-[#6E7191]"> 
                    <span className="font-bold text-[#1A1D1F]">{role.userCount}</span> users assigned 
                  </span> 
                </div> 

                <div className="mt-6"> 
                  <button 
                    onClick={() => handleTabChange('matrix')}
                    className="w-full px-4 py-2.5 bg-[#F7F7F8] text-[#1A1D1F] rounded-xl text-sm font-medium hover:bg-[#4ECDC4] hover:text-white transition-all"
                  > 
                    View Permissions 
                  </button> 
                </div> 
              </div> 
            ))} 
          </div> 
        </div> 
      )} 

      {/* Permission Library Tab */} 
      {activeTab === 'permissions' && ( 
        <div className="p-6"> 
          {/* Action Bar */} 
          <div className="flex items-center justify-between mb-8"> 
            <div className="flex items-center gap-3"> 
              <div className="relative flex-1"> 
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6E7191]" /> 
                <input 
                  type="text" 
                  placeholder="Search permissions..." 
                  className="pl-10 pr-4 py-2.5 bg-[#F7F7F8] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#4ECDC4] focus:bg-white transition-all w-80" 
                /> 
              </div> 
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#F7F7F8] rounded-xl hover:bg-[#4ECDC4] hover:text-white transition-all text-[#6E7191]"> 
                <ListFilter size={18} /> 
                <span className="text-sm font-medium">Filters</span> 
              </button> 
            </div> 
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#4ECDC4] text-white rounded-xl hover:shadow-lg transition-all hover:bg-[#44A08D]"> 
              <Plus size={18} /> 
              <span className="text-sm font-medium">Add Permission</span> 
            </button> 
          </div> 

          {/* Permission List */} 
          <div className="space-y-8"> 
            {Object.entries(groupedPermissions).map(([module, perms]) => ( 
              <div key={module}> 
                <h3 className="font-bold text-[#4ECDC4] text-lg mb-4 pl-1">{module}</h3> 
                <div className="space-y-3"> 
                  {perms.map(permission => ( 
                    <div 
                      key={permission.id} 
                      className="flex items-center justify-between p-6 bg-[#FAFAFB] rounded-2xl hover:bg-white hover:shadow-md border border-transparent hover:border-[#E0E0E2] transition-all group"
                    >
                      <div>
                        <h4 className="font-bold text-[#1A1D1F] text-base mb-1">{permission.name}</h4>
                        <p className="text-sm text-[#6E7191] mb-2">{permission.description}</p>
                        <p className="text-xs text-[#9A9EA6]">ID: {permission.id}</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-[#E0E0E2] rounded-lg text-[#6E7191] transition-colors">
                          <Edit size={18} />
                        </button>
                        <button className="p-2 hover:bg-[#FFF5F7] rounded-lg text-[#FF6B9D] transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
      
      {/* Role Management Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1A1D1F]">
                {editingRole ? 'Edit Role' : 'Create Role'}
              </h2>
              <button 
                onClick={() => setIsRoleModalOpen(false)}
                className="p-2 hover:bg-[#F7F7F8] rounded-lg transition-colors"
              >
                <X size={20} className="text-[#6E7191]" />
              </button>
            </div>
            
            <form onSubmit={handleRoleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#6E7191] mb-1.5">Role Name</label>
                <input
                  type="text"
                  required
                  value={roleForm.name}
                  onChange={(e) => setRoleForm({...roleForm, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-[#F7F7F8] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#4ECDC4] focus:bg-white transition-all"
                  placeholder="e.g. Administrator"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6E7191] mb-1.5">Role Code</label>
                <input
                  type="text"
                  required
                  value={roleForm.code}
                  onChange={(e) => setRoleForm({...roleForm, code: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-2.5 bg-[#F7F7F8] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#4ECDC4] focus:bg-white transition-all"
                  placeholder="e.g. ADM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6E7191] mb-1.5">Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={roleForm.color}
                    onChange={(e) => setRoleForm({...roleForm, color: e.target.value})}
                    className="h-10 w-10 rounded cursor-pointer border border-[#E0E0E2] p-1 bg-white"
                  />
                  <input
                    type="text"
                    value={roleForm.color}
                    onChange={(e) => setRoleForm({...roleForm, color: e.target.value})}
                    className="px-3 py-2 bg-[#F7F7F8] border border-transparent rounded-xl text-sm font-medium text-[#1A1D1F] focus:outline-none focus:border-[#4ECDC4] focus:bg-white transition-all w-32 uppercase"
                    placeholder="#000000"
                    maxLength={7}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-white border border-[#E0E0E2] text-[#6E7191] rounded-xl text-sm font-medium hover:bg-[#F7F7F8] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#4ECDC4] text-white rounded-xl text-sm font-medium hover:bg-[#44A08D] shadow-lg shadow-[#4ECDC4]/20 transition-all"
                >
                  {editingRole ? 'Save Changes' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}
