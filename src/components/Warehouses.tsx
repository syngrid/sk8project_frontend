import React from 'react';
import MasterPage from './MasterPage';

const Warehouses: React.FC = () => {
  const fields = [
    { name: 'warehouseName', label: 'Warehouse Name', type: 'text', required: true },
    { name: 'warehouseCode', label: 'Warehouse Code', type: 'text', required: true },
    { name: 'warehouseType', label: 'Type', type: 'select', options: ['Main', 'Sub', 'Site'] },
    { name: 'contactPerson', label: 'Contact Person', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'address', label: 'Address', type: 'textarea' },
    { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] }
  ];

  return <MasterPage moduleName="Warehouse Master" endpoint="master/warehouses" fields={fields as any} />;
};

export default Warehouses;
