import React from 'react';
import MasterPage from './MasterPage';

const PO: React.FC = () => {
  const fields = [
    { name: 'poNumber', label: 'PO Number', type: 'text', required: true },
    { name: 'project', label: 'Project', type: 'select-api', apiEndpoint: '/project/projects', displayKey: 'projectName', required: true },
    { name: 'costCenter', label: 'Cost Center', type: 'select-api', apiEndpoint: '/master/cost-centers', displayKey: 'costCenterCode' },
    { name: 'supplier', label: 'Supplier', type: 'select-api', apiEndpoint: '/master/suppliers', displayKey: 'supplierName', required: true },
    { name: 'totalAmount', label: 'PO Total Value', type: 'number' },
    { name: 'status', label: 'PO Status', type: 'select', options: ['issued', 'partiallyReceived', 'completed', 'cancelled'] }
  ];

  return <MasterPage moduleName="Purchase Order" endpoint="procurement/po" fields={fields as any} />;
};

export default PO;
