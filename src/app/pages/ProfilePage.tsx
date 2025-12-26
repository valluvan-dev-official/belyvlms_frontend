import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getMyProfile,
  updateMyProfile,
  UserProfileResponse,
} from "../services/ProfileService/ProfileService";
import { toast } from "sonner";

export function ProfilePage() {
  const [profileData, setProfileData] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    bio: "",
    phone_number: "",
    address: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getMyProfile();
      setProfileData(data);
      setForm({
        name: data.user?.name || "",
        bio: (data.profile?.data?.bio as string) || "",
        phone_number: (data.profile?.data?.phone_number as string) || "",
        address: (data.profile?.data?.address as string) || "",
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
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

  // Extract user and profile information with fallbacks for different API structures
  // Some APIs return { user: {...}, profile: {...} } while others might return flattened user object
  const userObj = profileData.user || profileData;
  const profileObj = profileData.profile || (profileData as any).profile || {};
  
  // Ensure we have a user object to work with
  if (!userObj) {
     return <div>Error: Invalid user data</div>;
  }

  // Helper to safely get user properties
  const getUserName = () => userObj.name || (userObj as any).username || userObj.email?.split('@')[0] || "User";
  const getUserRole = () => userObj.role_name || (userObj as any).role?.name || (userObj as any).role || "User";

  // Helper to get initials from name
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length > 1) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload: Partial<UserProfileResponse> = {
        user: {
          id: userObj.id,
          email: userObj.email,
          name: form.name || userObj.name,
          role_name: userObj.role_name,
          is_active: userObj.is_active,
          last_login: userObj.last_login,
        },
        profile: {
          id: profileObj.id || 0,
          email: userObj.email,
          data: {
            bio: form.bio,
            phone_number: form.phone_number,
            address: form.address,
          },
          created_at: profileObj.created_at,
        },
        role: profileData.role,
        model_path: profileData.model_path,
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
            <div className="relative">
              {/* Assuming profile image might be in profile.data or a future field, falling back to initials for now */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] flex items-center justify-center text-white text-4xl font-semibold">
                {getInitials(getUserName())}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-[#E0E0E2] hover:border-[#4ECDC4] transition-colors">
                <Edit size={16} className="text-[#6E7191]" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  {editing ? (
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="text-2xl font-semibold text-[#1A1D1F] mb-1 bg-[#F7F7F8] border border-[#E0E0E2] rounded-xl px-3 py-2 w-full"
                    />
                  ) : (
                    <h1 className="text-2xl font-semibold text-[#1A1D1F] mb-1">
                      {getUserName()}
                    </h1>
                  )}
                  <p className="text-[#6E7191]">{getUserRole()}</p>
                </div>
                {editing ? (
                  <div className="flex gap-3">
                    <button
                      disabled={saving}
                      onClick={handleSave}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      disabled={saving}
                      onClick={() => {
                        setEditing(false);
                        setForm({
                          name: userObj.name,
                          bio: profileObj.data?.bio || "",
                          phone_number: profileObj.data?.phone_number || "",
                          address: profileObj.data?.address || "",
                        });
                      }}
                      className="px-6 py-2.5 bg-white border border-[#E0E0E2] text-[#1A1D1F] rounded-xl hover:border-[#4ECDC4] transition-all disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-[#6E7191]">
                  <Mail size={18} />
                  <span className="text-sm">{userObj.email}</span>
                </div>
                {/* Phone and Address are not in the top-level user/profile object based on the screenshot, checking profile.data if they exist, otherwise placeholders */}
                <div className="flex items-center gap-3 text-[#6E7191]">
                  <Phone size={18} />
                  {editing ? (
                    <input
                      value={form.phone_number}
                      onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                      className="text-sm bg-[#F7F7F8] border border-[#E0E0E2] rounded-lg px-2 py-1 w-full"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <span className="text-sm">
                      {profileObj.data?.phone_number || "Not provided"}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[#6E7191]">
                  <MapPin size={18} />
                  {editing ? (
                    <input
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="text-sm bg-[#F7F7F8] border border-[#E0E0E2] rounded-lg px-2 py-1 w-full"
                      placeholder="Enter address"
                    />
                  ) : (
                    <span className="text-sm">
                      {profileObj.data?.address || "Not provided"}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[#6E7191]">
                  <Calendar size={18} />
                  <span className="text-sm">
                    Joined {formatDate(profileObj.created_at || (userObj as any).date_joined)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Keeping static for now */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E2]">
            <p className="text-[#6E7191] text-sm mb-2">Courses Enrolled</p>
            <p className="text-3xl font-semibold text-[#1A1D1F]">12</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E2]">
            <p className="text-[#6E7191] text-sm mb-2">Courses Completed</p>
            <p className="text-3xl font-semibold text-[#1A1D1F]">8</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E2]">
            <p className="text-[#6E7191] text-sm mb-2">Certificates Earned</p>
            <p className="text-3xl font-semibold text-[#1A1D1F]">5</p>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E0E0E2] mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#1A1D1F]">About</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="p-2 hover:bg-[#F7F7F8] rounded-lg transition-colors"
              >
                <Edit size={18} className="text-[#6E7191]" />
              </button>
            ) : null}
          </div>
          {editing ? (
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full bg-[#F7F7F8] border border-[#E0E0E2] rounded-xl p-3 text-[#1A1D1F]"
              rows={4}
              placeholder="Write about yourself..."
            />
          ) : (
            <p className="text-[#6E7191] leading-relaxed">
              {profileObj.data?.bio || "No bio available."}
            </p>
          )}
        </div>

        {/* Skills Section - Static for now */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E0E0E2]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#1A1D1F]">Skills</h2>
            <button className="p-2 hover:bg-[#F7F7F8] rounded-lg transition-colors">
              <Edit size={18} className="text-[#6E7191]" />
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              "HTML",
              "CSS",
              "JavaScript",
              "React",
              "TypeScript",
              "Figma",
              "UI/UX Design",
              "Tailwind CSS",
            ].map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 bg-[#F7F7F8] text-[#1A1D1F] rounded-lg text-sm font-medium hover:bg-[#4ECDC4] hover:text-white transition-colors cursor-pointer"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
