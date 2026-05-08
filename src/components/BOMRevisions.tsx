import React from 'react';
import MasterPage from './MasterPage';

const BOMRevisions: React.FC = () => {
  const fields = [
    { name: 'bom', label: 'BOM #', type: 'text', required: true },
    { name: 'revisionNumber', label: 'Rev #', type: 'text', required: true },
    { name: 'revisionDate', label: 'Date', type: 'date' },
    { name: 'revisionStatus', label: 'Status', type: 'select', options: ['active', 'superseded'], required: true },
    { name: 'revisionDescription', label: 'Description', type: 'textarea' }
  ];
  return <MasterPage moduleName="BOM Revisions" endpoint="bom/revisions" fields={fields as any} />;
};

export default BOMRevisions;
