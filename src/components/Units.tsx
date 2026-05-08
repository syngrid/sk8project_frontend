import React from 'react';
import MasterPage from './MasterPage';

const Units: React.FC = () => {
  const fields = [
    { name: 'unitName', label: 'Unit Name', type: 'text', required: true },
    { name: 'unitCode', label: 'Unit Code (Auto-gen if empty)', type: 'text', required: false },
    { name: 'unitType', label: 'Unit Type', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] }
  ];

  return <MasterPage moduleName="Units" endpoint="master/units" fields={fields as any} />;
};

export default Units;
