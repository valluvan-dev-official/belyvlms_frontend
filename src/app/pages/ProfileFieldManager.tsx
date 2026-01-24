import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listRoles, Role } from "../services/RbacService/RbacService";
import { 
  getProfileConfigs, 
  getProfileFields, 
  createProfileField, 
  updateProfileField, 
  deleteProfileField 
} from "../services/ProfileService/ProfileService";
import { Shield, Plus, Save, Trash2, Edit, AlertTriangle, Search, Home, ChevronRight, ArrowLeft, X, CheckCircle2, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type FieldType = "TEXT" | "NUMBER" | "DATE" | "BOOLEAN" | "CHOICE";

export function ProfileFieldManager() {
  const { activeRole } = useAuth();
  const isSAM = activeRole?.code === "SAM";
  
  // Data State
  const [roles, setRoles] = useState<Role[]>([]);
  const [allConfigs, setAllConfigs] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [config, setConfig] = useState<any | null>(null);
  const [fields, setFields] = useState<any[]>([]);
  
  // UI State
  const [viewMode, setViewMode] = useState<"LIST" | "EDIT">("LIST");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingFields, setLoadingFields] = useState(false);

  // Form State
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [editingField, setEditingField] = useState<any | null>(null);
  const [name, setName] = useState<string>("");
  const [label, setLabel] = useState<string>("");
  const [fieldType, setFieldType] = useState<FieldType>("TEXT");
  const [isRequired, setIsRequired] = useState<boolean>(false);
  const [optionsText, setOptionsText] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [rs, cfgs] = await Promise.all([listRoles(), getProfileConfigs()]);
        setRoles(rs);
        setAllConfigs(Array.isArray(cfgs) ? cfgs : []);
      } catch (error) {
        console.error("Failed to load data", error);
        toast.error("Failed to load initial data");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const loadConfig = async () => {
      if (!selectedRole) {
        setConfig(null);
        setFields([]);
        return;
      }
      
      const cfg = allConfigs.find((c: any) => {
        const rc = ((c.role_code || c.code || "") as string).toUpperCase();
        return rc === selectedRole.code?.toUpperCase();
      });
      
      setConfig(cfg || null);
      
      if (cfg) {
        setLoadingFields(true);
        try {
          const defs = await getProfileFields(cfg.id);
          // Ensure defs is an array
          setFields(Array.isArray(defs) ? defs : []);
        } catch (error) {
          console.error("Failed to load fields", error);
          toast.error("Failed to load fields");
          setFields([]);
        } finally {
            setLoadingFields(false);
        }
      } else {
        setFields([]);
      }
    };
    loadConfig();
  }, [selectedRole, allConfigs]);

  const resetForm = () => {
    setEditingField(null);
    setName("");
    setLabel("");
    setFieldType("TEXT");
    setIsRequired(false);
    setOptionsText("");
  };

  const openCreate = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEdit = (f: any) => {
    setEditingField(f);
    setName(f.name || "");
    setLabel(f.label || f.name || "");
    setFieldType((f.field_type || f.type || "TEXT") as FieldType);
    setIsRequired(!!(f.is_required ?? f.required));
    setOptionsText((f.options || f.choices || []).join(","));
    setFormOpen(true);
  };

  const saveField = async () => {
    if (!config) return;
    const options = optionsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
      
    try {
      if (editingField) {
        const updated = await updateProfileField(editingField.id, {
          name,
          label,
          field_type: fieldType,
          is_required: isRequired,
          options,
        });
        setFields((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
        toast.success("Field updated successfully");
      } else {
        const created = await createProfileField({
          config: config.id,
          name,
          label,
          field_type: fieldType,
          is_required: isRequired,
          options,
        });
        setFields((prev) => [created, ...prev]);
        toast.success("Field created successfully");
      }
      setFormOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save field", error);
      toast.error("Failed to save field");
    }
  };

  const removeField = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this field?")) return;
    try {
      await deleteProfileField(id);
      setFields((prev) => prev.filter((f) => f.id !== id));
      toast.success("Field deleted successfully");
    } catch (error) {
      console.error("Failed to delete field", error);
      toast.error("Failed to delete field");
    }
  };

  const openEditView = (role: Role) => {
    setSelectedRole(role);
    setViewMode("EDIT");
  };

  const closeEditView = () => {
    setViewMode("LIST");
    setSelectedRole(null);
  };

  const filteredRoles = roles.filter(role => {
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
            role.name.toLowerCase().includes(query) || 
            role.code.toLowerCase().includes(query)
        );
    }
    return true;
  });

  if (!isSAM) {
    return (
      <div className="p-8">
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-[#E0E0E2] p-6 text-center shadow-sm">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#DC2626]">
            <AlertTriangle size={20} />
          </div>
          <h1 className="text-lg font-bold text-[#1A1D1F]">Access Restricted</h1>
          <p className="text-sm text-[#6E7191] mt-2">Only SAM can manage field definitions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto font-sans text-[#1A1D1F]">
        {/* Header with Breadcrumbs */}
        <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Link to="/" className="flex items-center gap-1 hover:text-gray-900 cursor-pointer transition-colors">
                    <Home size={14} />
                    <span>Home</span>
                </Link>
                <ChevronRight size={14} />
                <span className="hover:text-gray-900 cursor-pointer transition-colors">Settings</span>
                <ChevronRight size={14} />
                <span className="font-medium text-gray-900">Profile Fields</span>
            </div>
            <h1 className="text-3xl font-bold text-[#1A1D1F] tracking-tight">Profile Field Definitions</h1>
            <p className="text-gray-500 mt-1">Manage custom fields for role profiles</p>
        </div>

      {viewMode === "LIST" ? (
        /* List View */
        <div className="bg-white rounded-xl border border-[#E0E0E2] shadow-sm overflow-hidden">
            {/* Card Header with Search */}
            <div className="p-4 border-b border-[#E0E0E2] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                <div className="flex items-center gap-2">
                     <div className="text-xs text-gray-500 font-medium">
                        {filteredRoles.length} roles found
                    </div>
                </div>
                
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search roles..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-64 pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                <thead className="bg-white text-gray-500 font-medium border-b border-[#E0E0E2]">
                    <tr>
                        <th className="px-6 py-4 w-1/3">Role</th>
                        <th className="px-6 py-4">Config Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#E0E0E2]">
                    {filteredRoles.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="px-6 py-16 text-center text-gray-400">
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                                        <Search size={20} className="text-gray-300" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">No roles found</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        filteredRoles.map((role) => {
                            const cfg = allConfigs.find(c => (c.role_code || c.code) === role.code);
                            const isConfigured = !!cfg;
                            
                            return (
                                <tr key={role.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-[#1A1D1F] text-sm">{role.name}</span>
                                            <span className="text-[10px] text-gray-400 font-mono mt-0.5 bg-gray-100 w-fit px-1.5 py-0.5 rounded">{role.code}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {isConfigured ? (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-100">
                                                <CheckCircle2 size={12} />
                                                Configured
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">Not Configured</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {isConfigured ? (
                                            <button 
                                                onClick={() => openEditView(role)}
                                                className="text-blue-600 hover:text-blue-700 font-medium text-xs px-3 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all"
                                            >
                                                Manage Fields
                                            </button>
                                        ) : (
                                            <span className="text-gray-300 text-xs cursor-not-allowed">
                                                Requires Config
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
                </table>
            </div>
        </div>
      ) : (
        /* Edit View (Fields List) */
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button 
                onClick={closeEditView} 
                className="group mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
                <div className="p-1.5 rounded-lg bg-white border border-gray-200 group-hover:border-gray-300 shadow-sm transition-all">
                    <ArrowLeft size={16} />
                </div>
                Back to Role List
            </button>

            {selectedRole && (
                <div className="bg-white rounded-xl border border-[#E0E0E2] shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-gray-100">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#1A1D1F]">{selectedRole.name}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-mono bg-gray-200 px-1.5 py-0.5 rounded text-gray-600">{selectedRole.code}</span>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-xs text-gray-500">Field Definitions</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={openCreate}
                            className="flex items-center gap-2 px-4 py-2 bg-[#1A1D1F] text-white text-sm font-semibold rounded-xl hover:bg-black transition-all shadow-sm"
                        >
                            <Plus size={16} />
                            Add Field
                        </button>
                    </div>

                    {/* Fields List */}
                    <div className="p-0">
                        {loadingFields ? (
                             <div className="flex flex-col items-center justify-center py-16">
                                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                                <p className="text-sm text-gray-500">Loading fields...</p>
                             </div>
                        ) : Array.isArray(fields) && fields.length > 0 ? (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-3">Name / Label</th>
                                        <th className="px-6 py-3">Type</th>
                                        <th className="px-6 py-3">Required</th>
                                        <th className="px-6 py-3">Options</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {fields.map((f) => (
                                        <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900">{f.label || f.name}</span>
                                                    <span className="text-xs text-gray-400 font-mono">{f.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                                                    {f.field_type || f.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {(f.is_required ?? f.required) ? (
                                                    <span className="text-red-600 text-xs font-medium bg-red-50 px-2 py-1 rounded-full">Required</span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">Optional</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {Array.isArray(f.options || f.choices) && (f.options || f.choices).length > 0 ? (
                                                    <div className="text-xs text-gray-600 max-w-[200px] truncate">
                                                        {(f.options || f.choices).join(", ")}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-300">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => openEdit(f)}
                                                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => removeField(f.id)}
                                                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <SlidersHorizontal size={24} className="text-gray-300" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">No fields defined</h3>
                                <p className="text-sm text-gray-500 mt-1 max-w-sm">
                                    Create custom fields for this role profile to collect additional information.
                                </p>
                                <button
                                    onClick={openCreate}
                                    className="mt-6 flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    <Plus size={16} />
                                    Add First Field
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
      )}

      {/* Modal Form */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-gray-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-[#1A1D1F]">
                    {editingField ? "Edit Field" : "New Field"}
                </h3>
                <button 
                    onClick={() => setFormOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1A1D1F] mb-1.5">Internal Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                  placeholder="e.g. phone_number"
                />
                <p className="text-xs text-gray-400 mt-1">Used in code (snake_case recommended)</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#1A1D1F] mb-1.5">Display Label</label>
                <input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                  placeholder="e.g. Phone Number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1D1F] mb-1.5">Type</label>
                    <select
                      value={fieldType}
                      onChange={(e) => setFieldType(e.target.value as FieldType)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                    >
                      <option value="TEXT">Text</option>
                      <option value="NUMBER">Number</option>
                      <option value="DATE">Date</option>
                      <option value="BOOLEAN">Boolean</option>
                      <option value="CHOICE">Choice</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center h-full pt-6">
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isRequired}
                          onChange={(e) => setIsRequired(e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">Required Field</span>
                     </label>
                  </div>
              </div>

              {fieldType === "CHOICE" && (
                <div>
                  <label className="block text-sm font-semibold text-[#1A1D1F] mb-1.5">Options</label>
                  <input
                    value={optionsText}
                    onChange={(e) => setOptionsText(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                    placeholder="Option 1, Option 2, Option 3"
                  />
                  <p className="text-xs text-gray-400 mt-1">Comma separated values</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
                <button
                    onClick={() => setFormOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
                >
                    Cancel
                </button>
                <button
                    onClick={saveField}
                    className="px-6 py-2 bg-[#1A1D1F] text-white text-sm font-semibold rounded-xl hover:bg-black transition-all shadow-sm flex items-center gap-2"
                >
                    <Save size={16} />
                    Save Field
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
