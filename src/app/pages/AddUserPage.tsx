import { useEffect, useMemo, useState } from 'react';
import { 
  X, Check, ChevronRight, ChevronLeft, Shield, Briefcase, GraduationCap, 
  Plus, Trash2, ArrowLeft, Save, User 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  createUser, 
  getProfileConfigs, 
  getProfileFields 
} from '../services/ProfileService/ProfileService';
import { 
  getBatches, 
  getCourses, 
  getConsultants, 
  getSources, 
  getTrainersList,
  getCourseCategories,
  fetchCoursesByCategory,
  fetchTrainersByCourse,
  DropdownOption 
} from '../services/CommonService/CommonService';
import { SearchableSelect } from '../components/ui/SearchableSelect';
import { listRoles } from '../services/RbacService/RbacService';

type RoleOption = { code: string; name: string };

interface FormData {
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  role: RoleOption | null;
}

interface PaymentSchedule {
  date: string;
  amount: number;
}

export function AddUserPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    role: null,
  });
  const [allRoles, setAllRoles] = useState<Array<{ code: string; name: string }>>([]);

  const getRoleVisual = (code: string, name: string) => {
    const c = code.toUpperCase();
    if (c === 'ADMIN') return { icon: Shield, color: 'text-blue-900 bg-blue-50 border-blue-200 ring-blue-800', label: name || 'Admin' };
    if (c === 'TRAINER' || c === 'INSTRUCTOR' || name.toLowerCase().includes('trainer')) return { icon: Briefcase, color: 'text-teal-600 bg-teal-50 border-teal-200 ring-teal-500', label: name || 'Trainer' };
    if (c === 'BTR' || c === 'STUDENT' || name.toLowerCase().includes('student')) return { icon: GraduationCap, color: 'text-orange-600 bg-orange-50 border-orange-200 ring-orange-500', label: name || 'Student' };
    return { icon: User, color: 'text-gray-700 bg-gray-50 border-gray-200 ring-gray-400', label: name || code };
  };

  // Dynamic fields state
  const [configs, setConfigs] = useState<Array<{ id: string | number; role_code: string; name: string }>>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<string | number | null>(null);
  const [definitions, setDefinitions] = useState<
    Array<{ id: string | number; name: string; code?: string; type: "TEXT" | "NUMBER" | "DATE" | "BOOLEAN" | "CHOICE"; required: boolean; choices?: string[]; read_only?: boolean }>
  >([]);
  const [dynamicValues, setDynamicValues] = useState<Record<string, any>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [defsLoading, setDefsLoading] = useState(false);
  const [staticValues, setStaticValues] = useState<Record<string, any>>({});
  
  // Student specific state
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentSchedule[]>([]);
  const [batches, setBatches] = useState<DropdownOption[]>([]);
  const [courses, setCourses] = useState<DropdownOption[]>([]);
  const [trainers, setTrainers] = useState<DropdownOption[]>([]);
  const [consultants, setConsultants] = useState<DropdownOption[]>([]);
  const [sources, setSources] = useState<DropdownOption[]>([]);

  // Dependent dropdown state
  const [categories, setCategories] = useState<DropdownOption[]>([]);
  const [categorySelected, setCategorySelected] = useState<string | number | null>(null);
  const [courseOptions, setCourseOptions] = useState<DropdownOption[]>([]);
  const [trainerOptions, setTrainerOptions] = useState<DropdownOption[]>([]);
  const [courseLoading, setCourseLoading] = useState(false);
  const [trainerLoading, setTrainerLoading] = useState(false);
  const coursesByCategory = useMemo(() => new Map<string | number, DropdownOption[]>(), []);
  const trainersByCourse = useMemo(() => new Map<string | number, DropdownOption[]>(), []);

  // Trainer specific state
  const [timingSlots, setTimingSlots] = useState<string[]>([]);
  const [newTimingSlot, setNewTimingSlot] = useState('');

  const isStep1Valid = () => {
    return formData.firstName && formData.email;
  };

  const isStep2Valid = () => {
    if (!formData.role) return false;
    
    // Role specific validation
    const roleName = (formData.role?.name || '').toLowerCase();
    const isStudent = formData.role?.code?.toUpperCase() === 'BTR' || roleName.includes('student');
    const isTrainer = formData.role?.code?.toUpperCase() === 'TRN' || roleName.includes('trainer') || roleName.includes('instructor');
    if (isStudent) {
      if (!staticValues['course_id']) return false;
      if (!staticValues['mode_of_class']) return false;
      if (!staticValues['week_type']) return false;
      if (!staticValues['fees_total']) return false;
    }
    
    if (isTrainer) {
      if (!staticValues['employment_type']) return false;
    }
    
    // Validate required dynamic fields
    for (const def of definitions) {
      if (def.required) {
        const key = def.code || def.name;
        const val = dynamicValues[key];
        if (val === undefined || val === null || val === '') {
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setFieldErrors({});
    if (!isStep2Valid() || !formData.role) return;
    try {
      const role_code = formData.role.code;
      
      let profileData: any = { ...dynamicValues };

      const roleName = (formData.role?.name || '').toLowerCase();
      const isStudent = formData.role?.code?.toUpperCase() === 'BTR' || roleName.includes('student');
      const isTrainer = formData.role?.code?.toUpperCase() === 'TRN' || roleName.includes('trainer') || roleName.includes('instructor');
      if (isStudent) {
        profileData = {
          ...profileData,
          phone: staticValues['phone'],
          course_id: staticValues['course_id'],
          mode_of_class: staticValues['mode_of_class'],
          week_type: staticValues['week_type'],
          trainer_id: staticValues['trainer_id'],
          consultant: staticValues['consultant'],
          source_of_joining: staticValues['source_of_joining'],
          pl_required: staticValues['pl_required'] || false,
          batch_id: staticValues['batch_id'],
          fees_total: Number(staticValues['fees_total']),
          fees_paid: Number(staticValues['fees_paid'] || 0),
          payment_schedule: paymentSchedule
        };
      } else if (isTrainer) {
        profileData = {
          ...profileData,
          phone: staticValues['phone'],
          years_of_experience: Number(staticValues['years_of_experience']),
          employment_type: staticValues['employment_type'],
          demo_link: staticValues['demo_link'],
          timing_slots: timingSlots,
          commercials: {
            hourly_rate: Number(staticValues['hourly_rate']),
            currency: staticValues['currency'] || 'INR'
          }
        };
      }

      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName || undefined,
        username: formData.username || undefined,
        email: formData.email,
        role_code,
        profile: profileData
      };
      
      await createUser(payload);
      toast.success("User created successfully");
      navigate('/management/users');
    } catch (err: any) {
      const data = err?.response?.data;
      if (data && typeof data === 'object') {
        // Map field-level errors
        const newErrors: Record<string, string> = {};
        Object.keys(data).forEach((key) => {
          const msg = Array.isArray(data[key]) ? data[key][0] : data[key];
          if (key === 'profile' && typeof msg === 'object') {
            Object.keys(msg).forEach((pKey) => {
              newErrors[pKey] = Array.isArray(msg[pKey]) ? msg[pKey][0] : String(msg[pKey]);
            });
          } else {
            newErrors[key] = typeof msg === 'string' ? msg : String(msg);
          }
        });
        setFieldErrors(newErrors);
        setSubmitError(newErrors.email || newErrors.role_code || null);
        toast.error("Please fix the errors in the form");
      } else {
        setSubmitError('Failed to create user. Please try again.');
        toast.error("Failed to create user");
      }
    }
  };

  // Fetch configs once
  useEffect(() => {
    (async () => {
      try {
        const cfgs = await getProfileConfigs();
        setConfigs(cfgs);
        const roles = await listRoles();
        setAllRoles((roles || []).map((r: any) => ({ code: r.code, name: r.name })));
        
        // Fetch dropdown data
        const [b, c, t, cons, src, cats] = await Promise.all([
          getBatches(),
          getCourses(),
          getTrainersList(),
          getConsultants(),
          getSources(),
          getCourseCategories()
        ]);
        setBatches(b);
        setCourses(c);
        setTrainers(t);
        setConsultants(cons);
        setSources(src);
        setCategories(cats);
      } catch {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    // Optional persistence hydration
    const persistedCategory = sessionStorage.getItem("onboarding_category");
    const persistedCourse = sessionStorage.getItem("onboarding_course");
    const persistedTrainer = sessionStorage.getItem("onboarding_trainer");
    (async () => {
      if (persistedCategory && categories.length) {
        await onCategoryChange(persistedCategory);
        if (persistedCourse) {
          await onCourseChange(persistedCourse);
          if (persistedTrainer) {
            setStaticValues({ ...staticValues, trainer_id: persistedTrainer });
          }
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  // When role changes, resolve config and fetch fields
  useEffect(() => {
    const run = async () => {
      if (!formData.role) {
        setSelectedConfigId(null);
        setDefinitions([]);
        setDynamicValues({});
        return;
      }
      const code = formData.role.code.toUpperCase();
      const roleLabel = (formData.role.name || '').toLowerCase();
      const config = configs.find((c: any) => {
        const rc = ((c.role_code || c.code || '') as string).toUpperCase();
        const name = ((c.name || '') as string).toLowerCase();
        return rc === code || name.includes(roleLabel) || name.includes('generic');
      });
      if (!config) {
        setSelectedConfigId(null);
        setDefinitions([]);
        setDynamicValues({});
        return;
      }
      setSelectedConfigId(config.id);
      try {
        setDefsLoading(true);
        const defs = await getProfileFields(config.id);
        const requiredDefs = defs.filter((d: any) => !!d.required);
        setDefinitions(requiredDefs);
        // Initialize defaults
        const initVals: Record<string, any> = {};
        requiredDefs.forEach((d: any) => {
          const key = d.code || d.name;
          initVals[key] = d.type === 'BOOLEAN' ? false : '';
        });
        setDynamicValues(initVals);
        setFieldErrors({});
      } catch {
        setDefinitions([]);
        setDynamicValues({});
      } finally {
        setDefsLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.role, configs]);

  const addPaymentSchedule = () => {
    setPaymentSchedule([...paymentSchedule, { date: '', amount: 0 }]);
  };

  const removePaymentSchedule = (index: number) => {
    const newSchedule = [...paymentSchedule];
    newSchedule.splice(index, 1);
    setPaymentSchedule(newSchedule);
  };

  const updatePaymentSchedule = (index: number, field: keyof PaymentSchedule, value: any) => {
    const newSchedule = [...paymentSchedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setPaymentSchedule(newSchedule);
  };

  const addTimingSlot = () => {
    if (newTimingSlot.trim()) {
      setTimingSlots([...timingSlots, newTimingSlot.trim()]);
      setNewTimingSlot('');
    }
  };

  const removeTimingSlot = (index: number) => {
    const newSlots = [...timingSlots];
    newSlots.splice(index, 1);
    setTimingSlots(newSlots);
  };

  const onCategoryChange = async (categoryId: string | number) => {
    setCategorySelected(categoryId);
    setStaticValues({ ...staticValues, course_id: null, trainer_id: null });
    setTrainerOptions([]);
    setCourseOptions([]);
    setCourseLoading(true);
    try {
      if (coursesByCategory.has(categoryId)) {
        const cached = coursesByCategory.get(categoryId)!;
        setCourseOptions(cached);
      } else {
        const list = await fetchCoursesByCategory(categoryId);
        coursesByCategory.set(categoryId, list);
        setCourseOptions(list);
      }
      sessionStorage.setItem("onboarding_category", String(categoryId));
    } catch {
      toast.error("Unable to load courses");
    } finally {
      setCourseLoading(false);
    }
  };

  const onCourseChange = async (courseId: string | number) => {
    setStaticValues({ ...staticValues, course_id: courseId, trainer_id: null });
    setTrainerOptions([]);
    setTrainerLoading(true);
    try {
      if (trainersByCourse.has(courseId)) {
        const cached = trainersByCourse.get(courseId)!;
        setTrainerOptions(cached);
      } else {
        const list = await fetchTrainersByCourse(courseId);
        trainersByCourse.set(courseId, list);
        setTrainerOptions(list);
      }
      sessionStorage.setItem("onboarding_course", String(courseId));
    } catch {
      toast.error("Unable to load trainers");
    } finally {
      setTrainerLoading(false);
    }
  };

  const renderInputForDef = (def: { name: string; code?: string; type: "TEXT" | "NUMBER" | "DATE" | "BOOLEAN" | "CHOICE"; required: boolean; choices?: string[]; read_only?: boolean }) => {
    const key = def.code || def.name;
    const commonLabel = (
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {def.name} {def.required && <span className="text-red-500">*</span>}
      </label>
    );
    const errorMsg = fieldErrors[key];
    switch (def.type) {
      case 'TEXT':
        return (
          <div>
            {commonLabel}
            <input
              type="text"
              value={dynamicValues[key] || ''}
              onChange={(e) => setDynamicValues({ ...dynamicValues, [key]: e.target.value })}
              disabled={def.read_only}
              className={`w-full px-3 py-2 bg-white border ${errorMsg ? 'border-red-400' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:border-teal-400`}
            />
            {errorMsg && <p className="text-xs text-red-500 mt-1">{errorMsg}</p>}
          </div>
        );
      case 'NUMBER':
        return (
          <div>
            {commonLabel}
            <input
              type="number"
              value={dynamicValues[key] ?? ''}
              onChange={(e) => setDynamicValues({ ...dynamicValues, [key]: e.target.value ? Number(e.target.value) : '' })}
              disabled={def.read_only}
              className={`w-full px-3 py-2 bg-white border ${errorMsg ? 'border-red-400' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:border-teal-400`}
            />
            {errorMsg && <p className="text-xs text-red-500 mt-1">{errorMsg}</p>}
          </div>
        );
      case 'DATE':
        return (
          <div>
            {commonLabel}
            <input
              type="date"
              value={dynamicValues[key] || ''}
              onChange={(e) => setDynamicValues({ ...dynamicValues, [key]: e.target.value })}
              disabled={def.read_only}
              className={`w-full px-3 py-2 bg-white border ${errorMsg ? 'border-red-400' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:border-teal-400`}
            />
            {errorMsg && <p className="text-xs text-red-500 mt-1">{errorMsg}</p>}
          </div>
        );
      case 'BOOLEAN':
        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!dynamicValues[key]}
              onChange={(e) => setDynamicValues({ ...dynamicValues, [key]: e.target.checked })}
              disabled={def.read_only}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">{def.name}</span>
            {errorMsg && <p className="text-xs text-red-500 mt-1">{errorMsg}</p>}
          </div>
        );
      case 'CHOICE':
        return (
          <div>
            {commonLabel}
            <select
              value={dynamicValues[key] || ''}
              onChange={(e) => setDynamicValues({ ...dynamicValues, [key]: e.target.value })}
              disabled={def.read_only}
              className={`w-full px-3 py-2 bg-white border ${errorMsg ? 'border-red-400' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:border-teal-400`}
            >
              <option value="">Select</option>
              {(def.choices || []).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errorMsg && <p className="text-xs text-red-500 mt-1">{errorMsg}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex flex-col gap-2">
        <Link 
          to="/management/users" 
          className="flex items-center gap-2 text-sm text-[#6E7191] hover:text-[#1A1D1F] transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          Back to User Management
        </Link>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1D1F]">Onboard New User</h1>
            <p className="text-[#6E7191] text-sm mt-1">Create a new user account and configure role-specific details</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={() => navigate('/management/users')}
               className="px-4 py-2 text-sm font-medium text-[#6E7191] bg-white border border-[#E0E0E2] rounded-xl hover:bg-[#F7F7F8] transition-all"
             >
               Cancel
             </button>
             {step === 2 && (
               <button 
                 onClick={handleSubmit}
                 className="flex items-center gap-2 px-6 py-2 bg-[#1A1D1F] text-white rounded-xl hover:bg-[#2B2F32] transition-all text-sm font-medium"
               >
                 <Save size={16} />
                 Create User
               </button>
             )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side - Stepper */}
        <div className="w-full lg:w-64 flex-shrink-0">
           <div className="bg-white rounded-2xl border border-[#E0E0E2] p-4 sticky top-6">
             <div className="space-y-6 relative">
               {/* Vertical Line */}
               <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-[#F1F1F4] -z-10"></div>
               
               {/* Step 1 */}
               <div className="flex gap-3 relative">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all z-10 ${
                   step >= 1 ? 'bg-[#1A1D1F] border-[#1A1D1F] text-white' : 'bg-white border-[#E0E0E2] text-[#6E7191]'
                 }`}>
                   {step > 1 ? <Check size={16} /> : '1'}
                 </div>
                 <div className="pt-1.5">
                   <p className={`text-sm font-semibold ${step >= 1 ? 'text-[#1A1D1F]' : 'text-[#6E7191]'}`}>Account Security</p>
                   <p className="text-xs text-[#9A9CAE] mt-0.5">Basic info & login details</p>
                 </div>
               </div>

               {/* Step 2 */}
               <div className="flex gap-3 relative">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all z-10 ${
                   step >= 2 ? 'bg-[#1A1D1F] border-[#1A1D1F] text-white' : 'bg-white border-[#E0E0E2] text-[#6E7191]'
                 }`}>
                   2
                 </div>
                 <div className="pt-1.5">
                   <p className={`text-sm font-semibold ${step >= 2 ? 'text-[#1A1D1F]' : 'text-[#6E7191]'}`}>Role & Profile</p>
                   <p className="text-xs text-[#9A9CAE] mt-0.5">Role specific configuration</p>
                 </div>
               </div>
             </div>
           </div>
        </div>

        {/* Right Side - Form Content */}
        <div className="flex-1 w-full">
           <div className="bg-white rounded-2xl border border-[#E0E0E2] p-8 shadow-sm">
             {step === 1 ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#F1F1F4]">
                    <div className="w-10 h-10 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[#1A1D1F]">
                      <User size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#1A1D1F]">Account Information</h2>
                      <p className="text-sm text-[#6E7191]">Enter the user's basic personal details</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#1A1D1F] mb-2">First Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-[#E0E0E2] rounded-xl focus:outline-none focus:border-[#1A1D1F] focus:ring-1 focus:ring-[#1A1D1F] transition-all"
                        placeholder="e.g. John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1A1D1F] mb-2">Last Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-[#E0E0E2] rounded-xl focus:outline-none focus:border-[#1A1D1F] focus:ring-1 focus:ring-[#1A1D1F] transition-all"
                        placeholder="e.g. Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1A1D1F] mb-2">Username (Optional)</label>
                    <input
                      type="text"
                      value={formData.username || ''}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-[#E0E0E2] rounded-xl focus:outline-none focus:border-[#1A1D1F] focus:ring-1 focus:ring-[#1A1D1F] transition-all"
                      placeholder="e.g. john.doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1A1D1F] mb-2">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-[#E0E0E2] rounded-xl focus:outline-none focus:border-[#1A1D1F] focus:ring-1 focus:ring-[#1A1D1F] transition-all"
                      placeholder="e.g. john@company.com"
                    />
                  </div>

                  <div className="pt-6 border-t border-[#F1F1F4] flex justify-end">
                    <button 
                      onClick={() => isStep1Valid() && setStep(2)}
                      disabled={!isStep1Valid()}
                      className="flex items-center gap-2 px-6 py-2.5 bg-[#1A1D1F] text-white rounded-xl hover:bg-[#2B2F32] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                    >
                      Next Step
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
             ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#F1F1F4]">
                    <div className="w-10 h-10 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[#1A1D1F]">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#1A1D1F]">Role Configuration</h2>
                      <p className="text-sm text-[#6E7191]">Assign role and fill specific details</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1A1D1F] mb-3">Select Role <span className="text-red-500">*</span></label>
                    <SearchableSelect
                      options={allRoles.map((r) => ({ id: r.code, name: `${r.code} - ${r.name}` }))}
                      value={formData.role?.code || ''}
                      onChange={(val) => {
                        const sel = allRoles.find((r) => r.code === val) || null;
                        setFormData({ ...formData, role: sel ? { code: sel.code, name: sel.name } : null });
                      }}
                      placeholder="Choose a role"
                    />
                  </div>

                  {(formData.role?.code?.toUpperCase() === 'BTR' || (formData.role?.name || '').toLowerCase().includes('student')) && (
                    <div className="bg-[#FFFBF0] p-6 rounded-2xl border border-[#FBEAC4] space-y-6">
                      <div className="flex items-center gap-2 text-[#92400E] mb-2">
                        <GraduationCap size={20} />
                        <h3 className="font-bold">Student Details</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-[#92400E] uppercase tracking-wider mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={staticValues['phone'] || ''}
                            onChange={(e) => setStaticValues({ ...staticValues, phone: e.target.value })}
                            className="w-full px-3 py-2.5 bg-white border border-[#FBEAC4] rounded-xl text-sm focus:outline-none focus:border-[#F59E0B]"
                            placeholder="9876543210"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#92400E] uppercase tracking-wider mb-2">Category *</label>
                          <SearchableSelect
                            options={categories}
                            value={categorySelected || ''}
                            onChange={(val) => onCategoryChange(val)}
                            placeholder="Select Category"
                            className="border-[#FBEAC4] focus:border-[#F59E0B]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#92400E] uppercase tracking-wider mb-2">Course *</label>
                          <SearchableSelect
                            options={courseOptions}
                            value={staticValues['course_id'] || ''}
                            onChange={(val) => onCourseChange(val)}
                            placeholder={courseLoading ? "Loading..." : "Select Course"}
                            disabled={!categorySelected || courseLoading || courseOptions.length === 0}
                            className="border-[#FBEAC4] focus:border-[#F59E0B]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#92400E] uppercase tracking-wider mb-2">Mode of Class *</label>
                          <SearchableSelect
                            options={[
                              { id: 'ONLINE', name: 'Online' },
                              { id: 'OFFLINE', name: 'Offline' },
                              { id: 'HYBRID', name: 'Hybrid' },
                            ]}
                            value={staticValues['mode_of_class']}
                            onChange={(val) => setStaticValues({ ...staticValues, mode_of_class: val })}
                            placeholder="Select Mode"
                            className="border-[#FBEAC4] focus:border-[#F59E0B]"
                          />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-[#92400E] uppercase tracking-wider mb-2">Week Type *</label>
                           <SearchableSelect
                             options={[
                               { id: 'WEEKDAY', name: 'Weekday' },
                               { id: 'WEEKEND', name: 'Weekend' },
                             ]}
                             value={staticValues['week_type']}
                             onChange={(val) => setStaticValues({ ...staticValues, week_type: val })}
                             placeholder="Select Type"
                             className="border-[#FBEAC4] focus:border-[#F59E0B]"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-[#92400E] uppercase tracking-wider mb-2">Trainer</label>
                          <SearchableSelect
                            options={trainerOptions}
                            value={staticValues['trainer_id'] || ''}
                            onChange={(val) => {
                              setStaticValues({ ...staticValues, trainer_id: val });
                              sessionStorage.setItem("onboarding_trainer", String(val));
                            }}
                            placeholder={trainerLoading ? "Loading..." : "Select Trainer"}
                            disabled={!staticValues['course_id'] || trainerLoading || trainerOptions.length === 0}
                            className="border-[#FBEAC4] focus:border-[#F59E0B]"
                          />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-[#92400E] uppercase tracking-wider mb-2">Consultant</label>
                           <SearchableSelect
                             options={consultants}
                             value={staticValues['consultant']}
                             onChange={(val) => setStaticValues({ ...staticValues, consultant: val })}
                             placeholder="Select Consultant"
                             className="border-[#FBEAC4] focus:border-[#F59E0B]"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-[#92400E] uppercase tracking-wider mb-2">Source</label>
                           <SearchableSelect
                             options={sources}
                             value={staticValues['source_of_joining']}
                             onChange={(val) => setStaticValues({ ...staticValues, source_of_joining: val })}
                             placeholder="Select Source"
                             className="border-[#FBEAC4] focus:border-[#F59E0B]"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-[#92400E] uppercase tracking-wider mb-2">Batch</label>
                           <SearchableSelect
                             options={batches}
                             value={staticValues['batch_id']}
                             onChange={(val) => setStaticValues({ ...staticValues, batch_id: val })}
                             placeholder="Select Batch"
                             className="border-[#FBEAC4] focus:border-[#F59E0B]"
                           />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#FBEAC4]">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={!!staticValues['pl_required']}
                            onChange={(e) => setStaticValues({ ...staticValues, pl_required: e.target.checked })}
                            className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                          />
                          <span className="font-semibold text-[#92400E]">Placement Assistance Required?</span>
                        </label>
                      </div>

                      {/* Payment Section */}
                      <div className="pt-4 border-t border-[#FBEAC4]">
                        <h4 className="font-bold text-[#92400E] mb-4">Fee Structure</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                          <div>
                             <label className="block text-xs font-bold text-[#92400E] uppercase tracking-wider mb-2">Total Fees *</label>
                             <input
                               type="number"
                               value={staticValues['fees_total'] || ''}
                               onChange={(e) => setStaticValues({ ...staticValues, fees_total: e.target.value })}
                               className="w-full px-3 py-2.5 bg-white border border-[#FBEAC4] rounded-xl text-sm focus:outline-none focus:border-[#F59E0B]"
                             />
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-[#92400E] uppercase tracking-wider mb-2">Paid Amount</label>
                             <input
                               type="number"
                               value={staticValues['fees_paid'] || ''}
                               onChange={(e) => setStaticValues({ ...staticValues, fees_paid: e.target.value })}
                               className="w-full px-3 py-2.5 bg-white border border-[#FBEAC4] rounded-xl text-sm focus:outline-none focus:border-[#F59E0B]"
                             />
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                           <div className="flex items-center justify-between">
                             <label className="text-xs font-bold text-[#92400E] uppercase tracking-wider">Payment Schedule</label>
                             <button type="button" onClick={addPaymentSchedule} className="text-xs flex items-center gap-1 text-[#92400E] hover:text-[#B45309]">
                               <Plus size={14} /> Add Installment
                             </button>
                           </div>
                           {paymentSchedule.map((sch, idx) => (
                             <div key={idx} className="flex gap-2 items-center">
                               <input
                                 type="date"
                                 value={sch.date}
                                 onChange={(e) => updatePaymentSchedule(idx, 'date', e.target.value)}
                                 className="flex-1 px-3 py-2 bg-white border border-[#FBEAC4] rounded-lg text-sm"
                               />
                               <input
                                 type="number"
                                 value={sch.amount}
                                 onChange={(e) => updatePaymentSchedule(idx, 'amount', Number(e.target.value))}
                                 placeholder="Amount"
                                 className="flex-1 px-3 py-2 bg-white border border-[#FBEAC4] rounded-lg text-sm"
                               />
                               <button onClick={() => removePaymentSchedule(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                 <Trash2 size={16} />
                               </button>
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {(formData.role?.code?.toUpperCase() === 'TRN' || (formData.role?.name || '').toLowerCase().includes('trainer') || (formData.role?.name || '').toLowerCase().includes('instructor')) && (
                    <div className="bg-[#F0FDFA] p-6 rounded-2xl border border-[#CCFBF1] space-y-6">
                      <div className="flex items-center gap-2 text-[#134E4A] mb-2">
                        <Briefcase size={20} />
                        <h3 className="font-bold">Trainer Details</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-[#134E4A] uppercase tracking-wider mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={staticValues['phone'] || ''}
                            onChange={(e) => setStaticValues({ ...staticValues, phone: e.target.value })}
                            className="w-full px-3 py-2.5 bg-white border border-[#CCFBF1] rounded-xl text-sm focus:outline-none focus:border-[#14B8A6]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#134E4A] uppercase tracking-wider mb-2">Employment Type *</label>
                          <SearchableSelect
                            options={[
                              { id: 'FT', name: 'Full-time' },
                              { id: 'CT', name: 'Contract' },
                              { id: 'PT', name: 'Part-time' },
                            ]}
                            value={staticValues['employment_type']}
                            onChange={(val) => setStaticValues({ ...staticValues, employment_type: val })}
                            placeholder="Select Type"
                            className="border-[#CCFBF1] focus:border-[#14B8A6]"
                          />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-[#134E4A] uppercase tracking-wider mb-2">Experience (Years)</label>
                           <input
                             type="number"
                             value={staticValues['years_of_experience'] || ''}
                             onChange={(e) => setStaticValues({ ...staticValues, years_of_experience: e.target.value })}
                             className="w-full px-3 py-2.5 bg-white border border-[#CCFBF1] rounded-xl text-sm focus:outline-none focus:border-[#14B8A6]"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-[#134E4A] uppercase tracking-wider mb-2">Demo Link</label>
                           <input
                             type="url"
                             value={staticValues['demo_link'] || ''}
                             onChange={(e) => setStaticValues({ ...staticValues, demo_link: e.target.value })}
                             className="w-full px-3 py-2.5 bg-white border border-[#CCFBF1] rounded-xl text-sm focus:outline-none focus:border-[#14B8A6]"
                             placeholder="https://..."
                           />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#CCFBF1]">
                         <h4 className="font-bold text-[#134E4A] mb-4">Commercials</h4>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                               <label className="block text-xs font-bold text-[#134E4A] uppercase tracking-wider mb-2">Hourly Rate</label>
                               <input
                                 type="number"
                                 value={staticValues['hourly_rate'] || ''}
                                 onChange={(e) => setStaticValues({ ...staticValues, hourly_rate: e.target.value })}
                                 className="w-full px-3 py-2.5 bg-white border border-[#CCFBF1] rounded-xl text-sm focus:outline-none focus:border-[#14B8A6]"
                               />
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-[#134E4A] uppercase tracking-wider mb-2">Currency</label>
                               <SearchableSelect
                                 options={[
                                   { id: 'INR', name: 'INR' },
                                   { id: 'USD', name: 'USD' },
                                 ]}
                                 value={staticValues['currency'] || 'INR'}
                                 onChange={(val) => setStaticValues({ ...staticValues, currency: val })}
                                 placeholder="Select Currency"
                                 className="border-[#CCFBF1] focus:border-[#14B8A6]"
                               />
                            </div>
                         </div>
                      </div>

                      <div className="pt-4 border-t border-[#CCFBF1]">
                         <div className="flex items-center justify-between mb-2">
                             <label className="text-xs font-bold text-[#134E4A] uppercase tracking-wider">Preferred Timing Slots</label>
                             <div className="flex gap-2">
                               <input 
                                 type="text" 
                                 placeholder="e.g. 10AM-12PM" 
                                 value={newTimingSlot}
                                 onChange={(e) => setNewTimingSlot(e.target.value)}
                                 className="px-2 py-1 text-sm border border-[#CCFBF1] rounded-lg"
                               />
                               <button type="button" onClick={addTimingSlot} className="text-xs flex items-center gap-1 text-[#134E4A] hover:text-[#0F766E]">
                                 <Plus size={14} /> Add
                               </button>
                             </div>
                         </div>
                         <div className="flex flex-wrap gap-2">
                            {timingSlots.map((slot, idx) => (
                              <span key={idx} className="px-3 py-1 bg-white border border-[#CCFBF1] text-[#134E4A] text-sm rounded-full flex items-center gap-2">
                                {slot}
                                <button onClick={() => removeTimingSlot(idx)} className="hover:text-red-500"><X size={14} /></button>
                              </span>
                            ))}
                            {timingSlots.length === 0 && <p className="text-sm text-gray-400 italic">No slots added</p>}
                         </div>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Fields */}
                  {definitions.length > 0 && (
                    <div className="pt-6 border-t border-[#E0E0E2]">
                       <h3 className="font-bold text-[#1A1D1F] mb-4">Additional Information</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {definitions.map((def) => (
                           <div key={def.id}>
                             {renderInputForDef(def)}
                           </div>
                         ))}
                       </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-[#F1F1F4] flex justify-between items-center">
                    <button 
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 px-6 py-2.5 text-[#6E7191] hover:text-[#1A1D1F] hover:bg-[#F7F7F8] rounded-xl transition-all font-medium"
                    >
                      <ChevronLeft size={18} />
                      Previous
                    </button>
                    {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
                    <button 
                      onClick={handleSubmit}
                      className="flex items-center gap-2 px-6 py-2.5 bg-[#1A1D1F] text-white rounded-xl hover:bg-[#2B2F32] transition-all font-medium"
                    >
                      <Save size={18} />
                      Create User
                    </button>
                  </div>
                </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
