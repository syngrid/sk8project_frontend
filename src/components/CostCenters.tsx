import React from 'react';
import MasterPage from './MasterPage';

const CostCenters: React.FC = () => {
  const fields = [
    { name: 'costCenterName', label: 'Cost Center Name', type: 'text', required: true },
    { name: 'costCenterCode', label: 'Cost Center Code', type: 'text', required: true },
    { name: 'budgetAmount', label: 'Budget Amount', type: 'number' },
    { name: 'currency', label: 'Currency', type: 'text' },
    { name: 'startDate', label: 'Start Date', type: 'date' },
    { name: 'endDate', label: 'End Date', type: 'date' },
    { name: 'department', label: 'Department', type: 'select-api', apiEndpoint: '/master/departments', displayKey: 'departmentName' },
    { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'], required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
  ];

  return <MasterPage moduleName="Cost Center" endpoint="master/cost-centers" fields={fields as any} />;
};

export default CostCenters;
