import React, { type ReactElement } from "react";

export const Summary = (): ReactElement => {
  return (
    <section className="overview-page__summary">
      <div className="overview-page__summary--balance">
        <h2 className="text-preset-4">Current Balance</h2>
        <p className="text-preset-1">$4,836.00</p>
      </div>
      <div className="overview-page__summary--income">
        <h2 className="text-preset-4">Income</h2>
        <p className="text-preset-1">$3,814.25</p>
      </div>
      <div className="overview-page__summary--expenses">
        <h2 className="text-preset-4">Expenses</h2>
        <p className="text-preset-1">$1,700.50</p>
      </div>
    </section>
  );
};
