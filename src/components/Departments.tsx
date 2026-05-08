import React from 'react';
import MasterPage from './MasterPage';

const Departments: React.FC = () => {
  const fields = [
    { name: 'departmentName', label: 'Department Name', type: 'text', required: true },
    { name: 'departmentCode', label: 'Department Code (Auto-gen if empty)', type: 'text', required: false },
    { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] }
  ];

  return <MasterPage moduleName="Departments" endpoint="master/departments" fields={fields as any} />;
};

export default Departments;
