import React from 'react';
import MasterPage from './MasterPage';

const PR: React.FC = () => {
  const fields = [
    { name: 'prNumber', label: 'PR Number', type: 'text', required: true },
    { name: 'project', label: 'Project', type: 'select-api', apiEndpoint: '/project/projects', displayKey: 'projectName', required: true },
    { name: 'costCenter', label: 'Cost Center', type: 'select-api', apiEndpoint: '/master/cost-centers', displayKey: 'costCenterCode' },
    { name: 'requestedBy', label: 'Requested By', type: 'select-api', apiEndpoint: '/master/users', displayKey: 'firstName' },
    { name: 'status', label: 'Approval Status', type: 'select', options: ['pending', 'approved', 'rejected'] }
  ];

  return <MasterPage moduleName="Purchase Request" endpoint="procurement/pr" fields={fields as any} />;
};

export default PR;
