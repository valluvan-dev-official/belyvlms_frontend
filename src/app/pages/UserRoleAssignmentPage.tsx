import { useState, useEffect } from "react";
import { User, Shield, Search, CheckCircle, AlertCircle, X } from "lucide-react";
import { listRoles, assignRole, Role } from "../services/RbacService/RbacService";
import { api } from "../services/AuthenticationService/AuthenticationService";

// Interface for User search result
interface SearchUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  roles: string[]; // List of role codes
}

export const UserRoleAssignmentPage = () => {
  const [email, setEmail] = useState("");
  const [foundUser, setFoundUser] = useState<SearchUser | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const data = await listRoles();
      setRoles(data.filter(r => r.is_active)); // Only active roles
    } catch (error) {
      console.error("Failed to load roles");
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSearching(true);
    setFoundUser(null);
    setMessage(null);

    try {
      // Assuming we have an endpoint to search users by email
      // If not, we might need to list users and filter (not ideal for enterprise)
      // For now, using a hypothetical endpoint based on prompt requirements
      const response = await api.get(`/users/search/?email=${email}`);
      if (response.data && response.data.length > 0) {
        setFoundUser(response.data[0]);
      } else {
        setMessage({ type: "error", text: "User not found" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error searching for user" });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAssign = async () => {
    if (!foundUser || !selectedRole) return;

    setIsLoading(true);
    setMessage(null);

    try {
      await assignRole({
        user: foundUser.id,
        role: roles.find(r => r.code === selectedRole)?.id || ""
      });
      
      setMessage({ type: "success", text: "Role assigned successfully!" });
      // Refresh user data to show new role
      const updatedUser = { ...foundUser, roles: [...foundUser.roles, selectedRole] };
      setFoundUser(updatedUser);
      setSelectedRole("");
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to assign role";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-[#E0F2FE] flex items-center justify-center text-[#0284C7]">
          <User size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1A1D1F]">Assign User Role</h1>
          <p className="text-sm text-[#6E7191]">Grant additional roles to existing users</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Search Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E0E0E2]">
            <h2 className="text-lg font-bold text-[#1A1D1F] mb-4">1. Find User</h2>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter user email address"
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-[#E0E0E2] rounded-xl focus:outline-none focus:border-[#0284C7] transition-colors"
                required
              />
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2.5 bg-[#0284C7] text-white rounded-xl hover:bg-[#0369A1] transition-colors disabled:opacity-50"
              >
                {isSearching ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <Search size={20} />}
              </button>
            </form>
          </div>

          {foundUser && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E0E0E2] animate-in fade-in slide-in-from-top-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xl">
                  {foundUser.first_name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1D1F]">{foundUser.first_name} {foundUser.last_name}</h3>
                  <p className="text-sm text-[#6E7191]">{foundUser.email}</p>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {foundUser.roles.map(roleCode => (
                      <span key={roleCode} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium border border-gray-200">
                        {roleCode}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Assignment Section */}
        <div className={`space-y-6 transition-opacity duration-300 ${foundUser ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E0E0E2]">
            <h2 className="text-lg font-bold text-[#1A1D1F] mb-4">2. Select Role</h2>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {roles.map(role => {
                const isAssigned = foundUser?.roles.includes(role.code);
                return (
                  <button
                    key={role.id}
                    onClick={() => !isAssigned && setSelectedRole(role.code)}
                    disabled={isAssigned}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                      selectedRole === role.code
                        ? "border-[#0284C7] bg-[#F0F9FF] ring-1 ring-[#0284C7]"
                        : isAssigned
                        ? "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                        : "border-gray-200 hover:border-[#0284C7] hover:bg-gray-50"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-[#1A1D1F]">{role.name}</p>
                      <p className="text-xs text-[#6E7191] font-mono">{role.code}</p>
                    </div>
                    {isAssigned ? (
                      <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                        <CheckCircle size={12} /> Assigned
                      </span>
                    ) : (
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedRole === role.code ? "border-[#0284C7]" : "border-gray-300"
                      }`}>
                        {selectedRole === role.code && <div className="w-2 h-2 rounded-full bg-[#0284C7]" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={handleAssign}
                disabled={!selectedRole || isLoading}
                className="w-full py-3 bg-[#0284C7] text-white rounded-xl hover:bg-[#0369A1] transition-all shadow-lg shadow-[#0284C7]/20 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? "Assigning..." : "Confirm Assignment"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Message Toast */}
      {message && (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 ${
          message.type === "success" ? "bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]" : "bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]"
        }`}>
          {message.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <p className="font-medium">{message.text}</p>
          <button onClick={() => setMessage(null)} className="ml-2 hover:opacity-70"><X size={16} /></button>
        </div>
      )}
    </div>
  );
};
