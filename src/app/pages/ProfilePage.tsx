import {
  ArrowLeft,
  Edit,
  Loader2,
  Camera,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  getMyProfile,
  updateMyProfile,
  UserProfile,
} from "../services/ProfileService/ProfileService";
import { toast } from "sonner";

export function ProfilePage() {
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getMyProfile();
      setProfileData(data);
      setForm({
        name: data.name || "",
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length > 1) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        name: form.name,
      };
      const updated = await updateMyProfile(payload);
      setProfileData(updated);
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
        setSaving(true);
        const formData = new FormData();
        formData.append("profile_picture", file);
        
        const updated = await updateMyProfile(formData);
        setProfileData(updated);
        toast.success("Profile picture updated");
    } catch (error) {
        console.error("Failed to upload image:", error);
        toast.error("Failed to upload profile picture");
    } finally {
        setSaving(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="h-8 w-8 animate-spin text-[#4ECDC4]" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] gap-4">
        <p className="text-[#6E7191]">Failed to load profile data</p>
        <button
          onClick={fetchProfile}
          className="px-4 py-2 bg-[#4ECDC4] text-white rounded-lg hover:bg-[#44A08D] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-[#6E7191] hover:text-[#4ECDC4] transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E0E0E2] mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] flex items-center justify-center text-white text-4xl font-semibold border-4 border-white shadow-md">
                {profileData.profile_picture ? (
                  <img 
                    src={profileData.profile_picture} 
                    alt={profileData.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(profileData.name)
                )}
              </div>
              
              <button 
                onClick={triggerImageUpload}
                disabled={saving}
                className="absolute bottom-0 right-0 p-2.5 bg-white rounded-full shadow-lg border border-[#E0E0E2] hover:border-[#4ECDC4] text-[#6E7191] hover:text-[#4ECDC4] transition-all cursor-pointer z-10"
                title="Change Profile Picture"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Camera size={18} />}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            <div className="flex-1 text-center md:text-left pt-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex-1">
                  {editing ? (
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your Name"
                      className="text-2xl font-semibold text-[#1A1D1F] mb-1 bg-[#F7F7F8] border border-[#E0E0E2] rounded-xl px-3 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]/20 focus:border-[#4ECDC4] transition-all"
                      autoFocus
                    />
                  ) : (
                    <h1 className="text-2xl font-semibold text-[#1A1D1F] mb-1">
                      {profileData.name}
                    </h1>
                  )}
                  <p className="text-[#6E7191] font-medium">{profileData.role}</p>
                  <p className="text-[#A0A3BD] text-sm mt-1">{profileData.email}</p>
                </div>
                
                {editing ? (
                  <div className="flex gap-3 justify-center md:justify-end">
                    <button
                      disabled={saving}
                      onClick={handleSave}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 font-medium"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      disabled={saving}
                      onClick={() => {
                        setEditing(false);
                        setForm({ name: profileData.name });
                      }}
                      className="px-6 py-2.5 bg-white border border-[#E0E0E2] text-[#6E7191] rounded-xl hover:bg-[#F7F7F8] transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-6 py-2.5 bg-white border border-[#E0E0E2] text-[#1A1D1F] rounded-xl hover:border-[#4ECDC4] hover:text-[#4ECDC4] hover:bg-[#F7F7F8] transition-all font-medium flex items-center gap-2 shadow-sm"
                  >
                    <Edit size={18} />
                    Edit Profile
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                {profileData.is_superuser && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                        Superuser
                    </span>
                )}
                {profileData.is_staff && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        Staff
                    </span>
                )}
                {profileData.is_active && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        Active
                    </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards - Only show relevant info since we lost bio/phone/address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* We can add more sections here if API provides more data later */}
        </div>
      </div>
    </div>
  );
}
