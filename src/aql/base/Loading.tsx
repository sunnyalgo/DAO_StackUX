import React from 'react';

export const Loading = () => {
  return (
    <div id="loading" className="loading hidden">
      <div className="lds-roller">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};
