// Batch Actions Dropdown Component
// Expert UI/UX design for batch management operations

import { useState, useRef, useEffect } from 'react';
import { 
  UserPlus, 
  Users, 
  UserCog, 
  ArrowLeftRight, 
  Eye, 
  Receipt, 
  Download,
  MoreVertical
} from 'lucide-react';
import { BatchAPI } from '../../types/batch-api';

interface BatchActionsDropdownProps {
  batch: BatchAPI;
  onAction: (action: BatchAction, batch: BatchAPI) => void;
}

export type BatchAction = 
  | 'add-student'
  | 'transfer-students'
  | 'trainer-handover'
  | 'view-transfer-requests'
  | 'view-handover-requests'
  | 'view-students'
  | 'view-transactions'
  | 'export-data';

interface ActionItem {
  id: BatchAction;
  label: string;
  icon: React.ReactNode;
  color?: string;
}

export function BatchActionsDropdown({ batch, onAction }: BatchActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const actions: ActionItem[] = [
    {
      id: 'add-student',
      label: 'Add Student',
      icon: <UserPlus size={18} />,
      color: 'text-blue-600'
    },
    {
      id: 'transfer-students',
      label: 'Transfer Students',
      icon: <ArrowLeftRight size={18} />,
      color: 'text-purple-600'
    },
    {
      id: 'trainer-handover',
      label: 'Trainer Handover',
      icon: <UserCog size={18} />,
      color: 'text-orange-600'
    },
    {
      id: 'view-transfer-requests',
      label: 'View Transfer Requests',
      icon: <ArrowLeftRight size={18} />,
      color: 'text-gray-700'
    },
    {
      id: 'view-handover-requests',
      label: 'View Handover Requests',
      icon: <UserCog size={18} />,
      color: 'text-gray-700'
    },
    {
      id: 'view-students',
      label: 'View Students',
      icon: <Users size={18} />,
      color: 'text-green-600'
    },
    {
      id: 'view-transactions',
      label: 'View Transactions',
      icon: <Receipt size={18} />,
      color: 'text-indigo-600'
    },
    {
      id: 'export-data',
      label: 'Export Data',
      icon: <Download size={18} />,
      color: 'text-gray-700'
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleActionClick = (action: BatchAction) => {
    onAction(action, batch);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Batch actions"
      >
        <MoreVertical size={18} className="text-gray-600" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 py-2">
          {actions.map((action, index) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.id)}
              className={`
                w-full px-4 py-2.5 text-left flex items-center gap-3 
                hover:bg-gray-50 transition-colors
                ${index > 0 ? 'border-t border-gray-100' : ''}
              `}
            >
              <span className={action.color || 'text-gray-700'}>
                {action.icon}
              </span>
              <span className="text-sm font-medium text-gray-900">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
