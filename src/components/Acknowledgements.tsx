import React from 'react';
import MasterPage from './MasterPage';

const Acknowledgements: React.FC = () => {
  const fields = [
    { name: 'acknowledgementNumber', label: 'ACK #', type: 'text', required: true },
    { name: 'dispatch', label: 'Dispatch Ref', type: 'select-api', apiEndpoint: '/logistics/planning', displayKey: 'dispatchNumber', optionValueKey: 'dispatchNumber', required: true },
    { name: 'project', label: 'Project', type: 'select-api', apiEndpoint: '/project/projects', displayKey: 'projectName', optionValueKey: 'projectCode', required: true },
    { name: 'receiverName', label: 'Received By (Site Engineer)', type: 'text', required: true },
    { name: 'receivedDate', label: 'Received Date', type: 'date', required: true },
    { name: 'receivedQuantity', label: 'Quantity Received', type: 'number', required: true },
    { name: 'deliveryCondition', label: 'Condition', type: 'select', options: ['Good', 'Damaged', 'Partial Loss', 'Wrong Item'] },
    { name: 'status', label: 'Final Status', type: 'select', options: ['Completed', 'Verified', 'Discrepancy Logged'], required: true },
    { name: 'remarks', label: 'Site Remarks', type: 'textarea' }
  ];

  return (
    <MasterPage 
      moduleName="Acknowledgement" 
      endpoint="logistics/acknowledgements" 
      fields={fields as any} 
    />
  );
};

export default Acknowledgements;
