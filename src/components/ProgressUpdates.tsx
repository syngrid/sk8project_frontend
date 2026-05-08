import React from 'react';
import MasterPage from './MasterPage';

const ProgressUpdates: React.FC = () => {
  const fields = [
    { name: 'project', label: 'Project', type: 'select-api', apiEndpoint: '/project/projects', displayKey: 'projectName', required: true },
    { name: 'task', label: 'Task', type: 'select-api', apiEndpoint: '/project/tasks', displayKey: 'taskName' },
    { name: 'updateDate', label: 'Update Date', type: 'date', required: true },
    { name: 'updatedBy', label: 'Updated By', type: 'select-api', apiEndpoint: '/master/users', displayKey: 'firstName' },
    { name: 'progressPercentage', label: 'Progress %', type: 'number' },
    { name: 'currentStatus', label: 'Current Status', type: 'select', options: ['On Track', 'Delayed', 'At Risk', 'Completed'] },
    { name: 'workCompleted', label: 'Work Completed', type: 'textarea' },
    { name: 'pendingWork', label: 'Pending Work', type: 'textarea' },
    { name: 'issuesRisks', label: 'Issues / Risks', type: 'textarea' },
    { name: 'nextActionPlan', label: 'Next Action Plan', type: 'textarea' },
    { name: 'attachments', label: 'Attachments', type: 'text' },
    { name: 'remarks', label: 'Remarks', type: 'textarea' }
  ];

  return <MasterPage moduleName="Progress Updates" endpoint="project/updates" fields={fields as any} />;
};

export default ProgressUpdates;
