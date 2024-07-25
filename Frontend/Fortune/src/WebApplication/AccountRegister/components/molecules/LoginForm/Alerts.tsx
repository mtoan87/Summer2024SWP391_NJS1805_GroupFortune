import React from 'react';
import Alert from 'react-bootstrap/Alert';

interface AlertProps {
  message: string;
  variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
}

const AlertMessage: React.FC<AlertProps> = ({ message, variant }) => {
  return (
    <Alert variant={variant}>
      {message}
    </Alert>
  );
};

export default AlertMessage;
