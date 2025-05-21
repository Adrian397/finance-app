import React, { type ReactElement } from "react";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "@/utils/routePaths.ts";
import arrowIcon from "@/assets/images/common/icon-caret-right.svg";

export const Bills = (): ReactElement => {
  return (
    <section className="overview-page__bills">
      <div className="overview-page__bills--header">
        <h2 className="text-preset-2">Recurring Bills</h2>
        <Link to={ROUTE_PATHS.RECURRING_BILLS} className="btn-tertiary">
          See Details
          <img src={arrowIcon} alt="" />
        </Link>
      </div>
      <ul className="overview-page__bills--list">
        <li className="overview-page__bills--list-item">
          <span className="text-preset-4">Paid Bills</span>
          <span className="text-preset-4b">$190.00</span>
        </li>
        <li className="overview-page__bills--list-item">
          <span className="text-preset-4">Paid Bills</span>
          <span className="text-preset-4b">$190.00</span>
        </li>
        <li className="overview-page__bills--list-item">
          <span className="text-preset-4">Paid Bills</span>
          <span className="text-preset-4b">$190.00</span>
        </li>
      </ul>
    </section>
  );
};
