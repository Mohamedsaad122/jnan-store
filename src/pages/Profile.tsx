import React from 'react';
import { Navigate } from 'react-router-dom';

const Profile: React.FC = () => {
  return <Navigate to="/dashboard/profile" replace />;
};

export default Profile;
