import React from 'react';
import { AviationRole, ResumeTemplate } from '@/types/atlas-resume';
import { Plane, Package, User, Building2, Briefcase } from 'lucide-react';

interface ResumeTemplateSelectorProps {
  targetRole: AviationRole;
  template: ResumeTemplate;
  onRoleChange: (role: AviationRole) => void;
  onTemplateChange: (template: ResumeTemplate) => void;
}

const ResumeTemplateSelector: React.FC<ResumeTemplateSelectorProps> = ({
  targetRole,
  template,
  onRoleChange,
  onTemplateChange
}) => {
  const roles: { id: AviationRole; label: string; icon: any; description: string }[] = [
    {
      id: 'commercial',
      label: 'Commercial Airline',
      icon: Plane,
      description: 'Major airline passenger operations'
    },
    {
      id: 'cargo',
      label: 'Cargo Operations',
      icon: Package,
      description: 'Freight and logistics aviation'
    },
    {
      id: 'private',
      label: 'Private Aviation',
      icon: User,
      description: 'Personal and business aviation'
    },
    {
      id: 'corporate',
      label: 'Corporate Aviation',
      icon: Building2,
      description: 'Business jet operations'
    },
    {
      id: 'charter',
      label: 'Charter Services',
      icon: Briefcase,
      description: 'On-demand charter operations'
    }
  ];

  const templates: { id: ResumeTemplate; label: string; description: string }[] = [
    {
      id: 'modern',
      label: 'Modern',
      description: 'Clean, contemporary design'
    },
    {
      id: 'classic',
      label: 'Classic',
      description: 'Traditional aviation format'
    },
    {
      id: 'executive',
      label: 'Executive',
      description: 'Professional and polished'
    },
    {
      id: 'technical',
      label: 'Technical',
      description: 'Detailed technical focus'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Aviation Role Selection */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Target Aviation Role</h3>
        <div className="grid grid-cols-2 gap-3">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => onRoleChange(role.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  targetRole === role.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Icon className={`w-6 h-6 mb-2 ${targetRole === role.id ? 'text-blue-600' : 'text-slate-400'}`} />
                <div className="font-medium text-sm">{role.label}</div>
                <div className="text-xs opacity-75 mt-1">{role.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Template Selection */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Resume Template</h3>
        <div className="grid grid-cols-2 gap-3">
          {templates.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => onTemplateChange(tmpl.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                template === tmpl.id
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <div className="font-medium text-sm">{tmpl.label}</div>
              <div className="text-xs opacity-75 mt-1">{tmpl.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplateSelector;
