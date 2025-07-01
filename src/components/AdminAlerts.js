import React from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';
import '../styles/AdminAlerts.css';

const AdminAlerts = ({ alerts, onDismiss }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="admin-alerts">
      {alerts.map((alert, index) => (
        <div key={index} className={`alert alert-${alert.type || 'warning'}`}>
          {alert.type === 'error' ? (
            <XCircle className="alert-icon" />
          ) : (
            <AlertTriangle className="alert-icon" />
          )}
          <div className="alert-content">
            <p className="alert-message">{alert.message}</p>
            {alert.details && <p className="alert-details">{alert.details}</p>}
          </div>
          <button className="dismiss-button" onClick={() => onDismiss(index)}>×</button>
        </div>
      ))}
    </div>
  );
};

export default AdminAlerts;