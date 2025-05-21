import React, { type ReactElement } from "react";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "@/utils/routePaths.ts";
import arrowIcon from "@/assets/images/common/icon-caret-right.svg";
import avatarIcon from "@/assets/images/avatars/emma-richardson.jpg";

export const Transactions = (): ReactElement => {
  return (
    <section className="overview-page__transactions">
      <div className="overview-page__transactions--header">
        <h2 className="text-preset-2">Transactions</h2>
        <Link to={ROUTE_PATHS.TRANSACTIONS} className="btn-tertiary">
          View All
          <img src={arrowIcon} alt="" />
        </Link>
      </div>
      <ul className="overview-page__transactions--list">
        <li className="overview-page__transactions--list__item">
          <div className="overview-page__transactions--list__item-avatar">
            <img src={avatarIcon} alt="avatar" />
            <span className="text-preset-4b">Emma Richardson</span>
          </div>
          <div className="overview-page__transactions--list__item-transaction">
            <span className="text-preset-4b">+$75.50</span>
            <p className="text-preset-5">19 Aug 2024</p>
          </div>
        </li>
        <li className="overview-page__transactions--list__item">
          <div className="overview-page__transactions--list__item-avatar">
            <img src={avatarIcon} alt="avatar" />
            <span className="text-preset-4b">Emma Richardson</span>
          </div>
          <div className="overview-page__transactions--list__item-transaction">
            <span className="text-preset-4b">+$75.50</span>
            <p className="text-preset-5">19 Aug 2024</p>
          </div>
        </li>
        <li className="overview-page__transactions--list__item">
          <div className="overview-page__transactions--list__item-avatar">
            <img src={avatarIcon} alt="avatar" />
            <span className="text-preset-4b">Emma Richardson</span>
          </div>
          <div className="overview-page__transactions--list__item-transaction">
            <span className="text-preset-4b">+$75.50</span>
            <p className="text-preset-5">19 Aug 2024</p>
          </div>
        </li>
      </ul>
    </section>
  );
};
