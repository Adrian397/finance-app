import React, { type ReactElement } from "react";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "@/utils/routePaths.ts";
import arrowIcon from "@/assets/images/common/icon-caret-right.svg";
import potIcon from "@/assets/images/pages/overview/icon-pot.svg";

export const Pots = (): ReactElement => {
  return (
    <section className="overview-page__pots">
      <div className="overview-page__pots--header">
        <h2 className="text-preset-2">Pots</h2>
        <Link to={ROUTE_PATHS.POTS} className="btn-tertiary">
          See Details
          <img src={arrowIcon} alt="" />
        </Link>
      </div>
      <div className="overview-page__pots--saved-wrapper">
        <div className="overview-page__pots--saved-total">
          <img src={potIcon} alt="" />
          <div>
            <span className="text-preset-4">Total Saved</span>
            <p className="text-preset-1">$850</p>
          </div>
        </div>
        <div className="overview-page__pots--saved-details">
          <div className="overview-page__pots--saved-details-pot">
            <div className="decoration"></div>
            <div>
              <span className="text-preset-5">Savings</span>
              <p className="text-preset-4b">$159</p>
            </div>
          </div>
          <div className="overview-page__pots--saved-details-pot">
            <div className="decoration"></div>
            <div>
              <span className="text-preset-5">Gift</span>
              <p className="text-preset-4b">$159</p>
            </div>
          </div>
          <div className="overview-page__pots--saved-details-pot">
            <div className="decoration"></div>
            <div>
              <span className="text-preset-5">Concert Ticket</span>
              <p className="text-preset-4b">$159</p>
            </div>
          </div>
          <div className="overview-page__pots--saved-details-pot">
            <div className="decoration"></div>
            <div>
              <span className="text-preset-5">New Laptop</span>
              <p className="text-preset-4b">$159</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
