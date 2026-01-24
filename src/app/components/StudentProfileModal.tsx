import React, { useRef, useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  BookOpen, 
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Student } from '../services/StudentService/StudentService';

interface StudentProfileModalProps {
  student: Student;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ student, onClose }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!student) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'IP': return 'bg-yellow-100 text-yellow-800';
      case 'C': return 'bg-green-100 text-green-800';
      case 'YTS': return 'bg-blue-100 text-blue-800';
      case 'D': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-5xl bg-[#F4F5FA] rounded-3xl shadow-2xl overflow-hidden my-4 animate-in fade-in zoom-in duration-200 flex flex-col">
        
        {/* Header / Banner Area */}
        <div className="relative min-h-[100px] bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors z-10"
          >
            <X size={24} />
          </button>
        </div>

        {/* Profile Section - Overlapping */}
        <div className="px-8 -mt-12 relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
          {/* Profile Picture */}
          <div className="shrink-0">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center">
              {student.profile_picture ? (
                <img 
                  src={student.profile_picture} 
                  alt={`${student.first_name} ${student.last_name}`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] flex items-center justify-center text-white text-4xl font-bold">
                  {student.first_name?.[0]}{student.last_name?.[0]}
                </div>
              )}
            </div>
          </div>

          {/* Name & Details Box */}
          <div className="flex-1 w-full md:w-auto">
             <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg w-full md:w-auto text-center md:text-left">
                <h2 className="text-xl font-bold text-[#1A1D1F] leading-tight">
                   {student.first_name} {student.last_name}
                </h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2 text-xs font-medium text-[#6E7191]">
                   <span className="bg-[#F4F5FA] px-2 py-1 rounded border border-[#E0E0E2] font-mono text-[#1A1D1F]">
                     {student.student_id}
                   </span>
                   <span className="flex items-center gap-1">
                     <MapPin size={12} className="text-[#4ECDC4]"/> 
                     {student.location || 'Location not set'}
                   </span>
                   <span className={`px-2 py-1 rounded ${getStatusColor(student.course_status)}`}>
                     {student.course_status === 'IP' ? 'In Progress' : student.course_status || 'N/A'}
                   </span>
                </div>
             </div>
          </div>
        </div>

        {/* Content Body - Carousel */}
        <div className="relative px-8 pb-8 group">
          {/* Navigation Buttons */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/80 hover:bg-white shadow-lg rounded-full text-[#1A1D1F] opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/80 hover:bg-white shadow-lg rounded-full text-[#1A1D1F] opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={24} />
          </button>

          {/* Carousel Container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth items-stretch"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            
            {/* Personal Information */}
            <div className="min-w-full md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] max-h-[320px] shrink-0 snap-center bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E2] flex flex-col h-full">
              <h3 className="text-lg font-bold text-[#44A08D] mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-[#E6F5F5] rounded-lg">
                  <Briefcase size={18} className="text-[#4ECDC4]" />
                </div>
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 gap-y-4">
                <div>
                  <p className="text-xs text-[#6E7191] mb-1">Full Name</p>
                  <p className="text-sm font-medium text-[#1A1D1F]">{student.first_name} {student.last_name}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6E7191] mb-1">Email Address</p>
                  <p className="text-sm font-medium text-[#1A1D1F] break-all">{student.email}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6E7191] mb-1">Phone Number</p>
                  <p className="text-sm font-medium text-[#1A1D1F]">
                    {student.country_code ? `${student.country_code.startsWith('+') ? '' : '+'}${student.country_code} ` : ''}{student.phone}
                  </p>
                </div>
                {student.alternative_phone && (
                  <div>
                    <p className="text-xs text-[#6E7191] mb-1">Alternative Phone</p>
                    <p className="text-sm font-medium text-[#1A1D1F]">
                      {student.alternative_country_code ? `${student.alternative_country_code.startsWith('+') ? '' : '+'}${student.alternative_country_code} ` : ''}{student.alternative_phone}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-[#6E7191] mb-1">Address</p>
                  <p className="text-sm font-medium text-[#1A1D1F]">{student.location || '-'}</p>
                </div>
              </div>
            </div>

            {/* Academic Details */}
            <div className="min-w-full md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] max-h-[320px] shrink-0 snap-center bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E2] flex flex-col h-full">
              <h3 className="text-lg font-bold text-[#44A08D] mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-[#E6F5F5] rounded-lg">
                  <GraduationCap size={18} className="text-[#4ECDC4]" />
                </div>
                Academic Details
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start justify-between p-3 bg-[#F9FAFB] rounded-xl">
                  <div>
                    <p className="text-xs text-[#6E7191]">UG Degree</p>
                    <p className="text-sm font-semibold text-[#1A1D1F]">{student.ugdegree || '-'}</p>
                    <p className="text-xs text-[#6E7191] mt-0.5">{student.ugbranch}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#6E7191]">Passout</p>
                    <p className="text-sm font-medium text-[#1A1D1F]">{student.ugpassout || '-'}</p>
                    <p className="text-xs text-[#4ECDC4] font-medium mt-0.5">{student.ugpercentage ? `${student.ugpercentage}%` : '-'}</p>
                  </div>
                </div>

                {student.pgdegree && (
                  <div className="flex items-start justify-between p-3 bg-[#F9FAFB] rounded-xl">
                    <div>
                      <p className="text-xs text-[#6E7191]">PG Degree</p>
                      <p className="text-sm font-semibold text-[#1A1D1F]">{student.pgdegree}</p>
                      <p className="text-xs text-[#6E7191] mt-0.5">{student.pgbranch}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#6E7191]">Passout</p>
                      <p className="text-sm font-medium text-[#1A1D1F]">{student.pgpassout || '-'}</p>
                      <p className="text-xs text-[#4ECDC4] font-medium mt-0.5">{student.pgpercentage ? `${student.pgpercentage}%` : '-'}</p>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-xs text-[#6E7191] mb-1">Working Status</p>
                    <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${student.working_status === 'YES' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {student.working_status === 'YES' ? 'Working' : 'Not Working'}
                    </span>
                  </div>
                  {student.it_experience && (
                    <div>
                      <p className="text-xs text-[#6E7191] mb-1">Experience</p>
                      <p className="text-sm font-medium text-[#1A1D1F]">{student.it_experience}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Course Information */}
            <div className="min-w-full md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] max-h-[320px] shrink-0 snap-center bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E2] flex flex-col h-full">
              <h3 className="text-lg font-bold text-[#44A08D] mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-[#E6F5F5] rounded-lg">
                  <BookOpen size={18} className="text-[#4ECDC4]" />
                </div>
                Course Details
              </h3>
              
              <div className="mb-4">
                <p className="text-xs text-[#6E7191] mb-1">Selected Course</p>
                <p className="text-lg font-bold text-[#1A1D1F]">{student.course_name}</p>
                {student.trainer_name && (
                  <p className="text-sm font-medium text-[#4ECDC4] mt-1 flex items-center gap-1">
                    <span className="text-[#6E7191] font-normal">Trainer:</span> {student.trainer_name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                <div>
                  <p className="text-xs text-[#6E7191] mb-1">Enrollment Date</p>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-[#1A1D1F]">
                    <Calendar size={14} className="text-[#4ECDC4]" />
                    {formatDate(student.enrollment_date)}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#6E7191] mb-1">Mode of Class</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${student.mode_of_class === 'ON' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                    {student.mode_of_class === 'ON' ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-[#6E7191] mb-1">Start Date</p>
                  <p className="text-sm font-medium text-[#1A1D1F]">{formatDate(student.start_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6E7191] mb-1">End Date</p>
                  <p className="text-sm font-medium text-[#1A1D1F]">{formatDate(student.end_date)}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-end mb-1">
                  <p className="text-xs text-[#6E7191]">Course Completion</p>
                  <p className="text-xs font-bold text-[#4ECDC4]">{student.course_percentage || 0}%</p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${student.course_percentage || 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Batch Details */}
            {student.batch_details && (
              <div className="min-w-full md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] max-h-[320px] shrink-0 snap-center bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E2] flex flex-col h-full">
                <h3 className="text-lg font-bold text-[#44A08D] mb-4 flex items-center gap-2">
                  <div className="p-1.5 bg-[#E6F5F5] rounded-lg">
                    <Clock size={18} className="text-[#4ECDC4]" />
                  </div>
                  Batch Details
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {student.batch_details.current_batch && (
                    <>
                      <div>
                        <p className="text-xs text-[#6E7191] mb-1">Batch ID</p>
                        <p className="text-sm font-medium text-[#1A1D1F]">{student.batch_details.current_batch.batch_id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6E7191] mb-1">Slot Time</p>
                        <p className="text-sm font-medium text-[#1A1D1F]">{student.batch_details.current_batch.slot_time}</p>
                      </div>
                    </>
                  )}
                </div>
                {(student.batch_details.batch_history || student.batch_details.transactions) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-[10px] text-[#6E7191]">Batch History</span>
                        <span className="text-xs font-medium text-[#1A1D1F]">{student.batch_details.batch_history?.length || 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-[10px] text-[#6E7191]">Transactions</span>
                        <span className="text-xs font-medium text-[#1A1D1F]">{student.batch_details.transactions?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Payment Details */}
            {student.payment_details && (
              <div className="min-w-full md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] max-h-[320px] shrink-0 snap-center bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E2] flex flex-col h-full">
                <h3 className="text-lg font-bold text-[#44A08D] mb-4 flex items-center gap-2">
                  <div className="p-1.5 bg-[#E6F5F5] rounded-lg">
                    <Briefcase size={18} className="text-[#4ECDC4]" />
                  </div>
                  Payment Details
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <p className="text-[10px] text-[#6E7191]">Total Fees</p>
                    <p className="text-sm font-medium text-[#1A1D1F]">₹{student.payment_details.total_fees}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#6E7191]">Paid</p>
                    <p className="text-sm font-medium text-green-600">₹{student.payment_details.amount_paid}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#6E7191]">Pending</p>
                    <p className="text-sm font-medium text-[#1A1D1F]">₹{student.payment_details.pending_amount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#6E7191]">Status</p>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${student.payment_details.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {student.payment_details.status}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Placement & Status */}
            <div className="min-w-full md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] max-h-[320px] shrink-0 snap-center bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E2] flex flex-col h-full">
              <h3 className="text-lg font-bold text-[#44A08D] mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-[#E6F5F5] rounded-lg">
                  <Award size={18} className="text-[#4ECDC4]" />
                </div>
                Status & Placement
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <StatusItem label="Placement Required" active={student.pl_required} />
                <StatusItem label="Mock Interview" active={student.mock_interview_completed} />
                <StatusItem label="Placement Session" active={student.placement_session_completed} />
                <StatusItem label="Certificate Issued" active={student.certificate_issued} />
                <StatusItem label="Onboarding Call" active={student.onboardingcalldone || student.placement_details?.onboarding_call === 'Completed'} />
                <StatusItem label="Resume Template" active={student.resume_template_shared} />
              </div>

 

              {(student.consultant_name || student.consultant) && (
                 <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-[#6E7191] mb-1">Consultant Name</p>
                    <p className="text-sm font-medium text-[#1A1D1F]">
                      {student.consultant_name || 'Consultant Info Unavailable'}
                    </p>
                 </div>
              )}
            </div>

            {/* Placement Details */}
            {student.placement_details && (
              <div className="min-w-full md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] max-h-[320px] shrink-0 snap-center bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E2] flex flex-col h-full">
                <h3 className="text-lg font-bold text-[#44A08D] mb-4 flex items-center gap-2">
                  <div className="p-1.5 bg-[#E6F5F5] rounded-lg">
                    <Award size={18} className="text-[#4ECDC4]" />
                  </div>
                  Placement Details
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {student.placement_details.placement_session && (
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs text-[#6E7191]">Placement Session</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${student.placement_details.placement_session === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {student.placement_details.placement_session}
                      </span>
                    </div>
                  )}
                  {student.placement_details.interview_questions && (
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs text-[#6E7191]">Interview Questions</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${student.placement_details.interview_questions === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {student.placement_details.interview_questions}
                      </span>
                    </div>
                  )}
                  {student.placement_details.resume_templates && (
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs text-[#6E7191]">Resume Templates</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${student.placement_details.resume_templates === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {student.placement_details.resume_templates}
                      </span>
                    </div>
                  )}
                  {student.placement_details.mock_interview && (
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs text-[#6E7191]">Mock Interview</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${student.placement_details.mock_interview === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {student.placement_details.mock_interview}
                      </span>
                    </div>
                  )}
                  {student.placement_details.placed_status && (
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs text-[#6E7191]">Placed Status</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${student.placement_details.placed_status === 'Placed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {student.placement_details.placed_status}
                      </span>
                    </div>
                  )}
                </div>

                {student.placement_details.resume_link && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-[#6E7191] mb-1">Resume</p>
                    <a href={student.placement_details.resume_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-[#4ECDC4] hover:underline">
                      <Briefcase size={16} />
                      View Resume PDF
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Interview Details */}
            {student.interview_details && student.interview_details.length > 0 && (
              <div className="min-w-full md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] max-h-[320px] shrink-0 snap-center bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E2] flex flex-col h-full">
                <h3 className="text-lg font-bold text-[#44A08D] mb-4 flex items-center gap-2">
                  <div className="p-1.5 bg-[#E6F5F5] rounded-lg">
                    <Briefcase size={18} className="text-[#4ECDC4]" />
                  </div>
                  Interview Details
                </h3>
                <div className="space-y-2 overflow-y-auto pr-1" style={{ maxHeight: '200px' }}>
                  {student.interview_details.map((interview, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-[#1A1D1F]">{interview.company}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${interview.status === 'Selected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {interview.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

const StatusItem = ({ label, active }: { label: string, active?: boolean }) => (
  <div className={`flex items-center gap-2 p-2 rounded-lg border ${active ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
    {active ? (
      <CheckCircle size={16} className="text-green-500 shrink-0" />
    ) : (
      <Clock size={16} className="text-gray-400 shrink-0" />
    )}
    <span className={`text-xs font-medium ${active ? 'text-green-700' : 'text-gray-500'}`}>
      {label}
    </span>
  </div>
);
