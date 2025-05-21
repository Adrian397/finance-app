import React, { type ReactElement } from "react";
import "./OverviewPage.scss";
import { Summary } from "@/pages/OverviewPage/sections/Summary/Summary.tsx";
import { Pots } from "@/pages/OverviewPage/sections/Pots/Pots.tsx";
import { Transactions } from "@/pages/OverviewPage/sections/Transactions/Transactions.tsx";
import { Budgets } from "@/pages/OverviewPage/sections/Budgets/Budgets.tsx";
import { Bills } from "@/pages/OverviewPage/sections/Bills/Bills.tsx";

const OverviewPage = (): ReactElement => {
  return (
    <div className="overview-page">
      <h1 className="overview-page__heading text-preset-1">Overview</h1>
      <Summary />
      <div className="overview-page__content">
        <div className="overview-page__content--left">
          <Pots />
          <Transactions />
        </div>
        <div className="overview-page__content--right">
          <Budgets />
          <Bills />
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
