import React from 'react';
import MasterPage from './MasterPage';

const Milestones: React.FC = () => {
  const fields = [
    { name: 'milestoneName', label: 'Milestone Name', type: 'text', required: true },
    { name: 'project', label: 'Project', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'targetDate', label: 'Target Date', type: 'date' },
    { name: 'completionDate', label: 'Completion Date', type: 'date' },
    { name: 'responsiblePerson', label: 'Responsible Person', type: 'text' },
    { name: 'priority', label: 'Priority', type: 'select', options: ['low', 'medium', 'high'] },
    { name: 'status', label: 'Status', type: 'select', options: ['pending', 'achieved', 'missed'] },
    { name: 'remarks', label: 'Remarks', type: 'textarea' }
  ];

  return <MasterPage moduleName="Milestones" endpoint="project/milestones" fields={fields as any} />;
};

export default Milestones;
