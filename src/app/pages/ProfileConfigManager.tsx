import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listRoles, Role } from "../services/RbacService/RbacService";
import { 
  getProfileConfigs, 
  createProfileConfig, 
  updateProfileConfig, 
  deleteProfileConfig 
} from "../services/ProfileService/ProfileService";
import { Shield, Save, Trash2, AlertCircle, HelpCircle, Search, Home, ChevronRight, X, SlidersHorizontal, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Navigate, Link } from "react-router-dom";
import { toast } from "sonner";

// Constants for Dedicated Profile Paths
const DEDICATED_PATHS: Record<string, string> = {
  "BTR": "profiles.models.StudentProfile", // Student
  "TRN": "profiles.models.TrainerProfile", // Trainer
};

const DEDICATED_LABELS: Record<string, string> = {
  "BTR": "Student DB (Dedicated)",
  "TRN": "Trainer DB (Dedicated)",
};

export function ProfileConfigManager() {
  const { activeRole } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [existingConfig, setExistingConfig] = useState<any | null>(null);
  
  // Form State
  const [profileType, setProfileType] = useState<"GENERIC" | "DEDICATED">("GENERIC");
  const [modelPath, setModelPath] = useState<string>("");
  const [isRequired, setIsRequired] = useState<boolean>(true);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const isSAM = activeRole?.code === "SAM";
  const [allConfigs, setAllConfigs] = useState<any[]>([]);
  
  // New UI State
  const [viewMode, setViewMode] = useState<"LIST" | "EDIT">("LIST");
  const [filterType, setFilterType] = useState<"ALL" | "DEDICATED" | "GENERIC">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [rs, cfgs] = await Promise.all([listRoles(), getProfileConfigs()]);
        setRoles(rs);
        setAllConfigs(cfgs);
      } catch (error) {
        console.error("Failed to load data", error);
        toast.error("Failed to load initial data");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const isDedicatedRole = (code?: string) => {
    return code === "BTR" || code === "TRN";
  };

  useEffect(() => {
    const loadConfig = async () => {
      if (!selectedRole) {
        setExistingConfig(null);
        resetForm();
        return;
      }
      
      const cfg = allConfigs.find((c: any) => {
        const rc = ((c.role_code || c.code || "") as string).toUpperCase();
        return rc === selectedRole.code;
      });

      if (cfg) {
        setExistingConfig(cfg);
        if (cfg.model_path) {
          setProfileType("DEDICATED");
          setModelPath(cfg.model_path);
        } else {
          setProfileType("GENERIC");
          setModelPath("");
        }
        setIsRequired(!!cfg.is_required);
      } else {
        setExistingConfig(null);
        resetForm(selectedRole.code);
      }
    };
    loadConfig();
  }, [selectedRole, allConfigs]);

  const refreshConfigs = async () => {
    try {
        const cfgs = await getProfileConfigs();
        setAllConfigs(cfgs);
    } catch(e) { console.error(e); }
  };
 
  const filteredRoles = roles.filter(role => {
    const cfg = allConfigs.find(c => (c.role_code || c.code) === role.code);

    // 1. Filter by Type
    if (filterType !== "ALL") {
        if (!cfg) return false; // Hide unconfigured if filtering by specific type
        const isDedicated = !!cfg.model_path;
        if (filterType === "DEDICATED" && !isDedicated) return false;
        if (filterType === "GENERIC" && isDedicated) return false;
    }

    // 2. Filter by Search
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
            role.name.toLowerCase().includes(query) || 
            role.code.toLowerCase().includes(query)
        );
    }
    
    return true;
  });

  const resetForm = (roleCode?: string) => {
    if (roleCode && isDedicatedRole(roleCode)) {
        // Enforce Dedicated for Student/Trainer
        setProfileType("DEDICATED"); 
        setModelPath(DEDICATED_PATHS[roleCode]);
    } else {
        // Enforce Generic for others
        setProfileType("GENERIC");
        setModelPath("");
    }
    setIsRequired(true);
  };

  const openEditView = (role: Role) => {
    setSelectedRole(role);
    setViewMode("EDIT");
  };

  const closeEditView = () => {
    setViewMode("LIST");
    setSelectedRole(null);
  };

  const handleProfileTypeChange = (type: "GENERIC" | "DEDICATED") => {
    if (!selectedRole) return;

    // Strict Enforcement
    if (isDedicatedRole(selectedRole.code)) {
        if (type === "GENERIC") return; // Prevent changing to Generic
        setProfileType("DEDICATED");
        setModelPath(DEDICATED_PATHS[selectedRole.code]);
    } else {
        if (type === "DEDICATED") return; // Prevent changing to Dedicated
        setProfileType("GENERIC");
        setModelPath("");
    }
  };

  const handleSave = async () => {
    if (!selectedRole) return;
    setSaving(true);
    try {
      const payload = {
        role: selectedRole.id, 
        role_code: selectedRole.code, 
        is_required: isRequired,
        model_path: profileType === "DEDICATED" ? modelPath : null,
      };

      if (existingConfig) {
        const updated = await updateProfileConfig(existingConfig.id, payload);
        setExistingConfig(updated);
        toast.success("Configuration updated successfully");
      } else {
        const created = await createProfileConfig(payload);
        setExistingConfig(created);
        toast.success("Configuration created successfully");
      }
      refreshConfigs();
      closeEditView();
    } catch (error) {
      console.error("Save failed", error);
      toast.error("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!existingConfig) return;
    if (!window.confirm("Are you sure? This will delete the profile configuration for this role.")) return;
    
    setSaving(true);
    try {
      await deleteProfileConfig(existingConfig.id);
      setExistingConfig(null);
      resetForm(selectedRole?.code);
      toast.success("Configuration deleted");
      refreshConfigs();
      closeEditView();
    } catch (error) {
      toast.error("Failed to delete configuration");
    } finally {
      setSaving(false);
    }
  };

  const canBeDedicated = (code: string) => {
    return code === "BTR" || code === "TRN";
  };

  if (!isSAM) {
    return (
      <div className="p-8">
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-[#E0E0E2] p-6 text-center shadow-sm">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#FFF4E6] flex items-center justify-center text-[#FF8A00]">
            <Shield size={20} />
          </div>
          <h1 className="text-lg font-bold text-[#1A1D1F]">Access Restricted</h1>
          <p className="text-sm text-[#6E7191] mt-2">Only SAM can manage role profile configs.</p>
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
            <span className="font-medium text-gray-900">Role Configs</span>
        </div>
        <h1 className="text-3xl font-bold text-[#1A1D1F] tracking-tight">Role Configurations</h1>
      </div>

      {viewMode === "LIST" ? (
        /* List View */
        <div className="bg-white rounded-xl border border-[#E0E0E2] shadow-sm overflow-hidden">
            
            {/* Card Header with Filters & Search */}
            <div className="p-4 border-b border-[#E0E0E2] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                        {(["ALL", "DEDICATED", "GENERIC"] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                                    filterType === type
                                        ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                {type === "ALL" ? "All" : type.charAt(0) + type.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                    <div className="h-6 w-px bg-gray-300 mx-2 hidden md:block"></div>
                    <div className="text-xs text-gray-500 font-medium hidden md:block">
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
                    <th className="px-6 py-4 w-1/4">Role</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Model Path</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E0E2]">
                {filteredRoles.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="px-6 py-16 text-center text-gray-400">
                            <div className="flex flex-col items-center justify-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                                    <Search size={20} className="text-gray-300" />
                                </div>
                                <p className="text-sm font-medium text-gray-500">No roles found</p>
                                <p className="text-xs text-gray-400">Try adjusting your filters or search query</p>
                            </div>
                        </td>
                    </tr>
                ) : (
                    filteredRoles.map((role) => {
                        const cfg = allConfigs.find(c => (c.role_code || c.code) === role.code);
                        const isConfigured = !!cfg;
                        const isDedicated = cfg ? !!cfg.model_path : false;
                        
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
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${
                                            isDedicated 
                                                ? "bg-purple-50 text-purple-700 border border-purple-100" 
                                                : "bg-teal-50 text-teal-700 border border-teal-100"
                                        }`}>
                                            {isDedicated ? "Dedicated" : "Generic"}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-xs italic">Not Configured</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                    {cfg && cfg.model_path ? (
                                        <span className="text-gray-600">{cfg.model_path}</span>
                                    ) : (
                                        <span className="text-gray-300">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {isConfigured ? (
                                        cfg.is_required ? (
                                            <div className="flex justify-center">
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase border border-green-100">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                    Required
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center">
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold uppercase border border-gray-200">
                                                    Optional
                                                </span>
                                            </div>
                                        )
                                    ) : (
                                        <div className="flex justify-center">
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 text-[10px] font-bold uppercase border border-gray-100">
                                                Pending
                                            </span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => openEditView(role)}
                                        className="text-gray-500 hover:text-blue-600 font-medium text-xs px-3 py-1.5 rounded-md hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all"
                                    >
                                        Configure
                                    </button>
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
        /* Edit View */
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
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
                    <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-gray-100">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#1A1D1F]">{selectedRole.name}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-mono bg-gray-200 px-1.5 py-0.5 rounded text-gray-600">{selectedRole.code}</span>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-xs text-gray-500">Configuration Settings</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="p-8 space-y-8">
                        
                        {/* Profile Strategy */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-bold text-gray-900">Profile Strategy</label>
                                <HelpCircle size={14} className="text-gray-400 cursor-help" />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Generic Option */}
                                <div 
                                    onClick={() => !isDedicatedRole(selectedRole.code) && handleProfileTypeChange("GENERIC")}
                                    className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                        profileType === "GENERIC"
                                            ? "border-blue-500 bg-blue-50/20"
                                            : isDedicatedRole(selectedRole.code)
                                                ? "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                                                : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center ${
                                            profileType === "GENERIC" ? "border-blue-500 bg-blue-500 text-white" : "border-gray-300 bg-white"
                                        }`}>
                                            {profileType === "GENERIC" && <CheckCircle2 size={12} />}
                                        </div>
                                        <div>
                                            <span className={`block text-sm font-bold ${profileType === "GENERIC" ? "text-blue-700" : "text-gray-700"}`}>Generic Profile</span>
                                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                                Uses the standard shared profile structure. Suitable for admins and staff roles.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Dedicated Option */}
                                <div 
                                    onClick={() => !(!isDedicatedRole(selectedRole.code)) && handleProfileTypeChange("DEDICATED")}
                                    className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                        profileType === "DEDICATED"
                                            ? "border-purple-500 bg-purple-50/20"
                                            : !isDedicatedRole(selectedRole.code)
                                                ? "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                                                : "border-gray-200 hover:border-purple-200 hover:bg-gray-50"
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center ${
                                            profileType === "DEDICATED" ? "border-purple-500 bg-purple-500 text-white" : "border-gray-300 bg-white"
                                        }`}>
                                            {profileType === "DEDICATED" && <CheckCircle2 size={12} />}
                                        </div>
                                        <div>
                                            <span className={`block text-sm font-bold ${profileType === "DEDICATED" ? "text-purple-700" : "text-gray-700"}`}>Dedicated Profile</span>
                                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                                Connects to a custom model table specific to this role (e.g., StudentProfile).
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Model Path Input */}
                        {profileType === "DEDICATED" && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <label className="text-sm font-bold text-gray-900">Model Path</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={modelPath}
                                        onChange={(e) => setModelPath(e.target.value)}
                                        placeholder="e.g. profiles.models.StudentProfile"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all text-gray-700"
                                        readOnly={isDedicatedRole(selectedRole.code)}
                                    />
                                    {isDedicatedRole(selectedRole.code) && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-200 text-gray-600 rounded">LOCKED</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500">
                                    Python dotted path to the model class. Pre-defined for core roles.
                                </p>
                            </div>
                        )}

                        {/* Enforcement Toggle */}
                        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex items-center justify-between">
                            <div>
                                <span className="block text-sm font-bold text-gray-900">Mandatory Profile</span>
                                <span className="text-xs text-gray-500">Require users to complete their profile before accessing the platform</span>
                            </div>
                            <div className={`w-12 h-7 rounded-full relative transition-colors cursor-pointer ${isRequired ? "bg-green-500" : "bg-gray-300"}`}>
                                <input 
                                    type="checkbox" 
                                    checked={isRequired}
                                    onChange={(e) => setIsRequired(e.target.checked)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform ${isRequired ? "translate-x-5" : "translate-x-0"}`}></div>
                            </div>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                        {existingConfig ? (
                            <button
                                onClick={handleDelete}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                            >
                                <Trash2 size={16} />
                                Delete Configuration
                            </button>
                        ) : (
                            <div></div>
                        )}
                        
                        <div className="flex items-center gap-3">
                            <button
                                onClick={closeEditView}
                                className="px-5 py-2 text-gray-600 font-medium text-sm hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2 bg-[#1A1D1F] text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                            >
                                {saving ? (
                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                ) : (
                                    <Save size={16} />
                                )}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
}
