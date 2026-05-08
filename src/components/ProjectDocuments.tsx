import React from 'react';
import MasterPage from './MasterPage';

const ProjectDocuments: React.FC = () => {
  const fields = [
    { name: 'documentName', label: 'Document Name', type: 'text', required: true },
    { name: 'project', label: 'Project', type: 'text', required: true },
    { name: 'documentType', label: 'Document Type', type: 'text' },
    { name: 'documentCategory', label: 'Document Category', type: 'text' },
    { name: 'revisionNumber', label: 'Revision Number', type: 'text' },
    { name: 'uploadedBy', label: 'Uploaded By', type: 'text' },
    { name: 'uploadFile', label: 'Upload File', type: 'text' },
    { name: 'documentStatus', label: 'Status', type: 'select', options: ['draft', 'released', 'superseded'] },
    { name: 'remarks', label: 'Remarks', type: 'textarea' }
  ];

  return <MasterPage moduleName="Documents" endpoint="project/documents" fields={fields as any} />;
};

export default ProjectDocuments;
