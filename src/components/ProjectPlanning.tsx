import React from 'react';
import MasterPage from './MasterPage';

const ProjectPlanning: React.FC = () => {
  const fields = [
    { name: 'project', label: 'Project', type: 'select-api', apiEndpoint: '/project/projects', displayKey: 'projectName', required: true },
    { name: 'costCenter', label: 'Cost Center', type: 'select-api', apiEndpoint: '/master/cost-centers', displayKey: 'costCenterCode' },
    { name: 'planningTitle', label: 'Stage Name (e.g. Design, Testing)', type: 'text', required: true },
    { name: 'startDate', label: 'Start Date', type: 'date' },
    { name: 'endDate', label: 'End Date', type: 'date' },
    { name: 'status', label: 'Status', type: 'select', options: ['planned', 'inProgress', 'completed'] }
  ];

  return <MasterPage moduleName="Project Stages" endpoint="project/planning" fields={fields as any} />;
};

export default ProjectPlanning;
