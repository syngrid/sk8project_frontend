import React from 'react';
import MasterPage from './MasterPage';

const QC: React.FC = () => {
  const fields = [
    { name: 'qcNumber', label: 'QC Number', type: 'text', required: true },
    { name: 'grn', label: 'Reference GRN', type: 'select-api', apiEndpoint: '/warehouse-ops/grn', displayKey: 'grnNumber', required: true },
    { name: 'item', label: 'Item Inspected', type: 'select-api', apiEndpoint: '/inventory/items', displayKey: 'itemName', required: true },
    { name: 'inspectionResult', label: 'Inspection Result', type: 'select', options: ['Passed', 'Failed'] },
    { name: 'remarks', label: 'Inspection Remarks', type: 'textarea' }
  ];

  return <MasterPage moduleName="Quality Check (QC)" endpoint="warehouse-ops/qc" fields={fields as any} />;
};

export default QC;
