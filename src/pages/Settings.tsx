import React from 'react';
import { Navigate } from 'react-router-dom';

const Settings: React.FC = () => {
  return <Navigate to="/dashboard/settings" replace />;
};

export default Settings;
