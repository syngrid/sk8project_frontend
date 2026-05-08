import React from 'react';
import MasterPage from './MasterPage';

const Roles: React.FC = () => {
  const fields = [
    { name: 'roleName', label: 'Role Name', type: 'text', required: true },
    { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] }
  ];

  return <MasterPage moduleName="Roles" endpoint="master/roles" fields={fields as any} />;
};

export default Roles;
