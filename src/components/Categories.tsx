import React from 'react';
import MasterPage from './MasterPage';

const Categories: React.FC = () => {
  const fields = [
    { name: 'categoryName', label: 'Category Name', type: 'text', required: true },
    { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] }
  ];

  return <MasterPage moduleName="Categories" endpoint="master/categories" fields={fields as any} />;
};

export default Categories;
