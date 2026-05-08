import React from 'react';
import MasterPage from './MasterPage';

const TeamAllocation: React.FC = () => {
  const fields = [
    { name: 'employee', label: 'Employee', type: 'text', required: true },
    { name: 'project', label: 'Project', type: 'text', required: true },
    { name: 'role', label: 'Role', type: 'text' },
    { name: 'department', label: 'Department', type: 'text' },
    { name: 'allocationStartDate', label: 'Allocation Start Date', type: 'date' },
    { name: 'allocationEndDate', label: 'Allocation End Date', type: 'date' },
    { name: 'workingHours', label: 'Working Hours', type: 'number' },
    { name: 'allocationPercentage', label: 'Allocation %', type: 'number' },
    { name: 'status', label: 'Status', type: 'select', options: ['active', 'released'] },
    { name: 'remarks', label: 'Remarks', type: 'textarea' }
  ];

  return <MasterPage moduleName="Team Allocation" endpoint="project/allocations" fields={fields as any} />;
};

export default TeamAllocation;
