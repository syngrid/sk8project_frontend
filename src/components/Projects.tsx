import React from 'react';
import MasterPage from './MasterPage';

const Projects: React.FC = () => {
  const fields = [
    { name: 'projectName', label: 'Project Name', type: 'text', required: true },
    { name: 'clientName', label: 'Client Name', type: 'text' },
    { name: 'costCenter', label: 'Cost Center', type: 'select-api', apiEndpoint: '/master/cost-centers', displayKey: 'costCenterCode' },
    { name: 'projectManager', label: 'Project Manager', type: 'select-api', apiEndpoint: '/master/users', displayKey: 'firstName' },
    { name: 'startDate', label: 'Start Date', type: 'date' },
    { name: 'budget', label: 'Budget', type: 'number' },
    { name: 'attachments', label: 'Project Attachment', type: 'file' },
    { name: 'projectStatus', label: 'Status', type: 'select', options: ['created', 'drawing_ready', 'active', 'completed'] },
    { name: 'engineeringDrawingStatus', label: 'Drawing Status', type: 'select', options: ['pending', 'ready'] }
  ];

  return <MasterPage moduleName="Projects" endpoint="project/projects" fields={fields as any} />;
};

export default Projects;
