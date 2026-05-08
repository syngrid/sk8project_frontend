import React from 'react';
import MasterPage from './MasterPage';

const Docs: React.FC = () => {
  const fields = [
    { name: 'documentNumber', label: 'Doc #', type: 'text', required: true },
    { name: 'project', label: 'Project', type: 'select-api', apiEndpoint: '/project/projects', displayKey: 'projectName', required: true },
    { name: 'costCenter', label: 'Cost Center', type: 'select-api', apiEndpoint: '/master/cost-centers', displayKey: 'costCenterCode' },
    { name: 'documentName', label: 'Doc Name', type: 'text', required: true },
    { name: 'uploadFile', label: 'Upload Document', type: 'file' },
    { name: 'documentType', label: 'Type', type: 'text' },
    { name: 'revisionNumber', label: 'Rev #', type: 'text' },
    { name: 'documentStatus', label: 'Status', type: 'select', options: ['active', 'archived'], required: true }
  ];
  return <MasterPage moduleName="Documents" endpoint="docs/docs" fields={fields as any} />;
};

export default Docs;
