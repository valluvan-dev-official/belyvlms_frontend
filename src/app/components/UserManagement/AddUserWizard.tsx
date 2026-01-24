import { useEffect, useMemo, useState } from 'react';
import { X, Check, ChevronRight, ChevronLeft, Shield, Briefcase, GraduationCap, Plus, Trash2 } from 'lucide-react';
import { 
  createUser, 
  getProfileConfigs, 
  getProfileFields 
} from '../../services/ProfileService/ProfileService';
import { 
  getBatches, 
  getCourses, 
  getConsultants, 
  getSources, 
  getTrainersList,
  DropdownOption 
} from '../../services/CommonService/CommonService';

interface AddUserWizardProps {
  onClose: () => void;
  onSuccess: (userData: any) => void;
}

type RoleLabel = 'Student' | 'Trainer' | 'Admin';

interface FormData {
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  role: RoleLabel | null;
}

interface PaymentSchedule {
  date: string;
  amount: number;
}

export function AddUserWizard({ onClose, onSuccess }: AddUserWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    role: null,
  });

  const availableRoles: { id: RoleLabel; label: string; icon: any; color: string; desc: string }[] = [
    { 
      id: 'Student', 
      label: 'Student', 
      icon: GraduationCap, 
      color: 'text-orange-600 bg-orange-50 border-orange-200 ring-orange-500', 
      desc: 'Access to learning materials and courses' 
    },
    { 
      id: 'Trainer', 
      label: 'Trainer', 
      icon: Briefcase, 
      color: 'text-teal-600 bg-teal-50 border-teal-200 ring-teal-500', 
      desc: 'Manage courses and grade students' 
    },
    { 
      id: 'Admin', 
      label: 'Admin', 
      icon: Shield, 
      color: 'text-blue-900 bg-blue-50 border-blue-200 ring-blue-800', 
      desc: 'Full system access and configuration' 
    },
  ];

  const roleCodeMap: Record<RoleLabel, string> = useMemo(() => ({
    Student: 'BTR',
    Trainer: 'TRN',
    Admin: 'ADM',
  }), []);

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

  // Trainer specific state
  const [timingSlots, setTimingSlots] = useState<string[]>([]);
  const [newTimingSlot, setNewTimingSlot] = useState('');

  const isStep1Valid = () => {
    return formData.firstName && formData.email;
  };

  const isStep2Valid = () => {
    if (!formData.role) return false;
    
    // Role specific validation
    if (formData.role === 'Student') {
      if (!staticValues['course_id']) return false;
      if (!staticValues['mode_of_class']) return false;
      if (!staticValues['week_type']) return false;
      if (!staticValues['fees_total']) return false;
    }
    
    if (formData.role === 'Trainer') {
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
      const role_code = roleCodeMap[formData.role];
      
      let profileData: any = { ...dynamicValues };

      if (formData.role === 'Student') {
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
      } else if (formData.role === 'Trainer') {
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
      
      const res = await createUser(payload);
      onSuccess({ id: res.id, ...payload });
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
      } else {
        setSubmitError('Failed to create user. Please try again.');
      }
    }
  };

  // Fetch configs once
  useEffect(() => {
    (async () => {
      try {
        const cfgs = await getProfileConfigs();
        setConfigs(cfgs);
        
        // Fetch dropdown data
        const [b, c, t, cons, src] = await Promise.all([
          getBatches(),
          getCourses(),
          getTrainersList(),
          getConsultants(),
          getSources()
        ]);
        setBatches(b);
        setCourses(c);
        setTrainers(t);
        setConsultants(cons);
        setSources(src);
      } catch {
        // ignore
      }
    })();
  }, []);

  // When role changes, resolve config and fetch fields
  useEffect(() => {
    const run = async () => {
      if (!formData.role) {
        setSelectedConfigId(null);
        setDefinitions([]);
        setDynamicValues({});
        return;
      }
      const code = roleCodeMap[formData.role];
      const roleLabel = (formData.role || '').toLowerCase();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-xl font-bold text-[#1A1D1F]">Add New User</h3>
            <p className="text-sm text-gray-500 mt-1">Create a new account and assign roles</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-8 py-4 bg-white border-b border-gray-100">
          <div className="flex items-center">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#4ECDC4]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step >= 1 ? 'border-[#4ECDC4] bg-[#E0F2F1]' : 'border-gray-200'}`}>1</div>
              <span className="font-medium text-sm">Account Security</span>
            </div>
            <div className={`flex-1 h-0.5 mx-4 ${step >= 2 ? 'bg-[#4ECDC4]' : 'bg-gray-100'}`}></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#4ECDC4]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step >= 2 ? 'border-[#4ECDC4] bg-[#E0F2F1]' : 'border-gray-200'}`}>2</div>
              <span className="font-medium text-sm">Role & Profile</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1">
          {step === 1 ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">First Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] focus:bg-white transition-all"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Last Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] focus:bg-white transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Username (optional)</label>
                <input
                  type="text"
                  value={formData.username || ''}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] focus:bg-white transition-all"
                  placeholder="john.doe"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] focus:bg-white transition-all"
                  placeholder="john.doe@company.com"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Role Selection (single primary role) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Role <span className="text-red-500">*</span></label>
                <select
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: (e.target.value || null) as RoleLabel | null })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-500"
                >
                  <option value="">Select role</option>
                  {availableRoles.map((r) => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>

              {formData.role === 'Student' && (
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 space-y-4">
                  <h5 className="text-sm font-bold text-orange-800 border-b border-orange-200 pb-2">Student Onboarding Form</h5>
                  
                  {/* Personal & Course Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={staticValues['phone'] || ''}
                        onChange={(e) => setStaticValues({ ...staticValues, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400"
                        placeholder="9876543210"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Course *</label>
                      <select
                        value={staticValues['course_id'] || ''}
                        onChange={(e) => setStaticValues({ ...staticValues, course_id: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400"
                      >
                        <option value="">Select Course</option>
                        {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Mode of class *</label>
                      <select
                        value={staticValues['mode_of_class'] || ''}
                        onChange={(e) => setStaticValues({ ...staticValues, mode_of_class: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400"
                      >
                        <option value="">Select</option>
                        <option value="ON">Online</option>
                        <option value="OFF">Offline</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Week type *</label>
                      <select
                        value={staticValues['week_type'] || ''}
                        onChange={(e) => setStaticValues({ ...staticValues, week_type: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400"
                      >
                        <option value="">Select</option>
                        <option value="WD">Weekday</option>
                        <option value="WE">Weekend</option>
                      </select>
                    </div>
                    <div>
                       <label className="block text-xs font-semibold text-gray-600 mb-1">Trainer</label>
                       <select
                         value={staticValues['trainer_id'] || ''}
                         onChange={(e) => setStaticValues({ ...staticValues, trainer_id: e.target.value })}
                         className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400"
                       >
                         <option value="">Select Trainer</option>
                         {trainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-semibold text-gray-600 mb-1">Consultant</label>
                       <select
                         value={staticValues['consultant'] || ''}
                         onChange={(e) => setStaticValues({ ...staticValues, consultant: e.target.value })}
                         className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400"
                       >
                         <option value="">Select Consultant</option>
                         {consultants.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                       </select>
                    </div>
                     <div>
                       <label className="block text-xs font-semibold text-gray-600 mb-1">Source of Joining</label>
                       <select
                         value={staticValues['source_of_joining'] || ''}
                         onChange={(e) => setStaticValues({ ...staticValues, source_of_joining: e.target.value })}
                         className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400"
                       >
                         <option value="">Select Source</option>
                         {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                       </select>
                    </div>
                    <div className="flex items-center pt-6">
                      <input
                        type="checkbox"
                        checked={staticValues['pl_required'] || false}
                        onChange={(e) => setStaticValues({ ...staticValues, pl_required: e.target.checked })}
                        className="w-4 h-4 mr-2"
                      />
                      <label className="text-sm text-gray-700">Placement Required?</label>
                    </div>
                  </div>

                  {/* Batch Assignment */}
                  <div className="pt-4 border-t border-orange-200">
                    <h6 className="text-xs font-bold text-orange-800 mb-2 uppercase">Batch Assignment</h6>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Select Batch</label>
                      <select
                         value={staticValues['batch_id'] || ''}
                         onChange={(e) => setStaticValues({ ...staticValues, batch_id: e.target.value })}
                         className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400"
                       >
                         <option value="">Select Batch</option>
                         {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                       </select>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="pt-4 border-t border-orange-200">
                    <h6 className="text-xs font-bold text-orange-800 mb-2 uppercase">Payment Details</h6>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                       <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Total Fees *</label>
                        <input
                          type="number"
                          value={staticValues['fees_total'] || ''}
                          onChange={(e) => setStaticValues({ ...staticValues, fees_total: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400"
                        />
                       </div>
                       <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Initial Paid Amount</label>
                        <input
                          type="number"
                          value={staticValues['fees_paid'] || ''}
                          onChange={(e) => setStaticValues({ ...staticValues, fees_paid: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400"
                        />
                       </div>
                    </div>
                    
                    <div className="mb-2">
                       <div className="flex justify-between items-center mb-2">
                         <label className="text-xs font-semibold text-gray-600">Payment Schedule (EMI)</label>
                         <button type="button" onClick={addPaymentSchedule} className="text-xs flex items-center gap-1 text-orange-600 hover:text-orange-800">
                           <Plus size={14}/> Add EMI
                         </button>
                       </div>
                       {paymentSchedule.map((sch, idx) => (
                         <div key={idx} className="flex gap-2 mb-2 items-center">
                           <input
                              type="date"
                              value={sch.date}
                              onChange={(e) => updatePaymentSchedule(idx, 'date', e.target.value)}
                              className="w-1/2 px-2 py-1 bg-white border border-gray-200 rounded text-sm"
                            />
                            <input
                              type="number"
                              placeholder="Amount"
                              value={sch.amount}
                              onChange={(e) => updatePaymentSchedule(idx, 'amount', Number(e.target.value))}
                              className="w-1/2 px-2 py-1 bg-white border border-gray-200 rounded text-sm"
                            />
                            <button type="button" onClick={() => removePaymentSchedule(idx)} className="text-red-500 hover:text-red-700">
                              <Trash2 size={16}/>
                            </button>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              )}

              {formData.role === 'Trainer' && (
                <div className="bg-teal-50 p-4 rounded-xl border border-teal-200 space-y-4">
                  <h5 className="text-sm font-bold text-teal-800 border-b border-teal-200 pb-2">Trainer Onboarding Form</h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={staticValues['phone'] || ''}
                        onChange={(e) => setStaticValues({ ...staticValues, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Employment type *</label>
                      <select
                        value={staticValues['employment_type'] || ''}
                        onChange={(e) => setStaticValues({ ...staticValues, employment_type: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-400"
                      >
                        <option value="">Select</option>
                        <option value="FT">Full-time</option>
                        <option value="CT">Contract</option>
                        <option value="PT">Part-time</option>
                      </select>
                    </div>
                     <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Years of Experience</label>
                      <input
                        type="number"
                        step="0.1"
                        value={staticValues['years_of_experience'] || ''}
                        onChange={(e) => setStaticValues({ ...staticValues, years_of_experience: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-400"
                      />
                    </div>
                     <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Demo Link (URL)</label>
                      <input
                        type="url"
                        value={staticValues['demo_link'] || ''}
                        onChange={(e) => setStaticValues({ ...staticValues, demo_link: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-400"
                        placeholder="https://youtu.be/..."
                      />
                    </div>
                  </div>
                  
                  {/* Commercials */}
                   <div className="pt-4 border-t border-teal-200">
                     <h6 className="text-xs font-bold text-teal-800 mb-2 uppercase">Commercials</h6>
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Hourly Rate</label>
                        <input
                          type="number"
                          value={staticValues['hourly_rate'] || ''}
                          onChange={(e) => setStaticValues({ ...staticValues, hourly_rate: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-400"
                        />
                       </div>
                       <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Currency</label>
                         <select
                            value={staticValues['currency'] || 'INR'}
                            onChange={(e) => setStaticValues({ ...staticValues, currency: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-400"
                          >
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                          </select>
                       </div>
                     </div>
                   </div>

                   {/* Timing Slots */}
                   <div className="pt-4 border-t border-teal-200">
                     <div className="flex justify-between items-center mb-2">
                         <h6 className="text-xs font-bold text-teal-800 uppercase">Timing Slots</h6>
                         <div className="flex gap-2">
                           <input 
                              type="text" 
                              placeholder="10:00 AM - 12:00 PM"
                              value={newTimingSlot}
                              onChange={(e) => setNewTimingSlot(e.target.value)}
                              className="px-2 py-1 bg-white border border-gray-200 rounded text-xs w-40"
                           />
                           <button type="button" onClick={addTimingSlot} className="text-xs flex items-center gap-1 text-teal-600 hover:text-teal-800 bg-white px-2 py-1 rounded border border-teal-200">
                             <Plus size={14}/> Add
                           </button>
                         </div>
                       </div>
                       <div className="flex flex-wrap gap-2">
                         {timingSlots.map((slot, idx) => (
                           <div key={idx} className="bg-white border border-teal-200 px-3 py-1 rounded-full text-xs flex items-center gap-2">
                             {slot}
                             <button type="button" onClick={() => removeTimingSlot(idx)} className="text-red-400 hover:text-red-600">
                               <X size={12}/>
                             </button>
                           </div>
                         ))}
                         {timingSlots.length === 0 && <span className="text-xs text-gray-400">No slots added</span>}
                       </div>
                   </div>

                </div>
              )}

              {/* Dynamic Fields Panel */}
              {formData.role && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h5 className="text-sm font-bold text-gray-800 mb-3">Additional Fields</h5>
                  {!isStep2Valid() && (
                    <div className="mb-3 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-900">
                      <div className="font-semibold mb-1">Please complete required fields:</div>
                      <ul className="list-disc ml-4">
                        {formData.role === 'Student' && !staticValues['course_id'] && <li>Course</li>}
                        {formData.role === 'Student' && !staticValues['mode_of_class'] && <li>Mode of class</li>}
                        {formData.role === 'Student' && !staticValues['week_type'] && <li>Week type</li>}
                        {formData.role === 'Student' && !staticValues['fees_total'] && <li>Total Fees</li>}
                        {formData.role === 'Trainer' && !staticValues['employment_type'] && <li>Employment type</li>}
                        {definitions
                          .filter((d) => d.required)
                          .filter((d) => {
                            const key = d.code || d.name;
                            const val = dynamicValues[key];
                            return val === undefined || val === null || val === '';
                          })
                          .map((d) => (
                            <li key={`${d.id}-missing`}>{d.name}</li>
                          ))}
                      </ul>
                    </div>
                  )}
                  
                  {defsLoading ? (
                     <div className="flex justify-center py-4">
                       <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500"></div>
                     </div>
                  ) : definitions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {definitions.map((def) => (
                        <div key={def.id}>
                          {renderInputForDef(def)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No additional fields configured for this role.</p>
                  )}
                </div>
              )}

              {submitError && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                  <Shield size={16} />
                  {submitError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              <ChevronLeft size={18} />
              Back
            </button>
          ) : (
            <div></div>
          )}

          <button
            onClick={step === 1 ? () => isStep1Valid() && setStep(2) : handleSubmit}
            disabled={step === 1 ? !isStep1Valid() : false} // Step 2 validation is done on click to show errors
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-white font-medium transition-all shadow-lg shadow-teal-500/20 ${
              (step === 1 ? isStep1Valid() : true)
                ? 'bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] hover:shadow-teal-500/30 transform hover:-translate-y-0.5' 
                : 'bg-gray-300 cursor-not-allowed shadow-none'
            }`}
          >
            {step === 1 ? 'Next Step' : 'Create Account'}
            {step === 1 ? <ChevronRight size={18} /> : <Check size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
