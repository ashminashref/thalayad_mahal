import React from 'react';
import { Button } from 'react-bootstrap';
import './SubmitButton.css';

const SubmitButton = () => {
  return (
    <div className="d-flex justify-content-center mb-5 pb-4">
      <Button className="submit-btn d-flex align-items-center gap-2 border-0 p-4">
        <span className="btn-text">Submit</span>
        <div className="icon-container">
          {/* Document Icon */}
          <svg viewBox="0 0 24 24" className="icon doc-icon">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor" />
          </svg>
          
          {/* Edit/Pencil Icon */}
          <svg viewBox="0 0 24 24" className="icon edit-icon">
            <path d="M20.71,7.04C21.1,6.65 21.1,6.01 20.71,5.63L18.37,3.29C17.99,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" fill="currentColor" />
          </svg>

          {/* Paper Plane Icon */}
          <svg viewBox="0 0 24 24" className="icon send-icon">
            <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" fill="currentColor" />
          </svg>

          {/* Inbox/Ready Icon (Default) */}
          <svg viewBox="0 0 24 24" className="icon inbox-icon default-icon">
            <path d="M19,15H15A3,3 0 0,1 12,18A3,3 0 0,1 9,15H5V5H19M19,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.9 20.1,3 19,3Z" fill="currentColor" />
          </svg>

          {/* Check Icon */}
          <svg viewBox="0 0 24 24" className="icon check-icon">
            <path d="M9,16.17L4.83,12L3.41,13.41L9,19L21,7L19.59,5.59L9,16.17Z" fill="currentColor" />
          </svg>
        </div>
      </Button>
    </div>
  );
};

export default SubmitButton;