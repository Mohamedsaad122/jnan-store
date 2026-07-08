import React from 'react';
import { Navigate } from 'react-router-dom';

const Orders: React.FC = () => {
  return <Navigate to="/dashboard/orders" replace />;
};

export default Orders;
