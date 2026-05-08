import React from 'react';
import MasterPage from './MasterPage';

const Quotations: React.FC = () => {
  const fields = [
    { name: 'quotationNumber', label: 'Quotation #', type: 'text', required: true },
    { name: 'rfq', label: 'RFQ #', type: 'text' },
    { name: 'supplier', label: 'Supplier', type: 'text', required: true },
    { name: 'costCenter', label: 'Cost Center', type: 'select-api', apiEndpoint: '/master/cost-centers', displayKey: 'costCenterCode' },
    { name: 'totalAmount', label: 'Total Amount', type: 'number' },
    { name: 'validityDate', label: 'Valid Till', type: 'date' },
    { name: 'quotationStatus', label: 'Status', type: 'select', options: ['pending', 'accepted', 'rejected'], required: true }
  ];
  return <MasterPage moduleName="Supplier Quotations" endpoint="procurement/quotations" fields={fields as any} />;
};

export default Quotations;
