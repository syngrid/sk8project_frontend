import React from 'react';
import MasterPage from './MasterPage';

const Suppliers: React.FC = () => {
  const fields = [
    { name: 'supplierName', label: 'Supplier Name', type: 'text', required: true },
    { name: 'supplierType', label: 'Type', type: 'select', options: ['Manufacturer', 'Distributor', 'Service Provider'] },
    { name: 'contactPerson', label: 'Contact Person', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] }
  ];

  return <MasterPage moduleName="Suppliers" endpoint="master/suppliers" fields={fields as any} />;
};

export default Suppliers;
