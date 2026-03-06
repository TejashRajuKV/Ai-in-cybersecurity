import React from 'react';

const ConfidenceBar = ({ value }) => (
  <div className="confidence-bar">
    <div className="fill" style={{ width: `${value}%` }}></div>
  </div>
);

export default ConfidenceBar;
