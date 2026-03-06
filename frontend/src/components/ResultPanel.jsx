import React from 'react';

const ResultPanel = ({ data }) => (
  <div className="result-panel">
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
);

export default ResultPanel;
