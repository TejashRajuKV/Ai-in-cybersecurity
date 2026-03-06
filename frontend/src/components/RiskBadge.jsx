import React from 'react';

const RiskBadge = ({ level }) => (
  <span className={`badge badge-${level}`}>{level}</span>
);

export default RiskBadge;
