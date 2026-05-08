import React from 'react';
import MasterPage from './MasterPage';

const RFQ: React.FC = () => {
  const fields = [
    { name: 'rfqNumber', label: 'RFQ #', type: 'text', required: true },
    { name: 'rfqDate', label: 'Date', type: 'date' },
    { name: 'project', label: 'Project', type: 'text' },
    { name: 'costCenter', label: 'Cost Center', type: 'select-api', apiEndpoint: '/master/cost-centers', displayKey: 'costCenterCode' },
    { name: 'supplier', label: 'Supplier', type: 'text' },
    { name: 'submissionDueDate', label: 'Due Date', type: 'date' },
    { name: 'rfqStatus', label: 'Status', type: 'select', options: ['open', 'closed'], required: true }
  ];
  return <MasterPage moduleName="RFQ" endpoint="procurement/rfq" fields={fields as any} />;
};

export default RFQ;
