import React from "react";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "@/utils/routePaths.ts";
import arrowIcon from "@/assets/images/common/icon-caret-right.svg";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const budgetData = [
  { name: "Groceries", value: 400, color: "#F2CDAC" },
  { name: "Utilities", value: 150, color: "#626070" },
  { name: "Rent/Mortgage", value: 850, color: "#82C9D7" },
  { name: "Transport", value: 120, color: "#277C78" },
];

const currentSpentAmount = 338;
const totalBudgetLimit = 975;
export const Budgets = () => {
  const desiredCenterCircleDiameter = 187;
  const centerCircleRadius = desiredCenterCircleDiameter / 2;

  return (
    <section className="overview-page__budgets">
      <div className="overview-page__budgets--header">
        <h2 className="text-preset-2">Budgets</h2>
        <Link to={ROUTE_PATHS.BUDGETS} className="btn-tertiary">
          See Details
          <img src={arrowIcon} alt="" />
        </Link>
      </div>
      <div className="overview-page__budgets--chart-wrapper">
        <div className="overview-page__budgets--chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={budgetData}
                labelLine={false}
                outerRadius={120}
                innerRadius={80}
                dataKey="value"
                nameKey="name"
              >
                {budgetData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={entry.color}
                  />
                ))}
              </Pie>
              <g>
                <circle
                  cx="50%"
                  cy="50%"
                  r={centerCircleRadius}
                  fill="white"
                  opacity="0.25"
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-preset-1"
                  dy="-0.5rem"
                  style={{
                    fill: "#201F24",
                  }}
                >
                  ${currentSpentAmount}
                </text>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-preset-5"
                  dy="1.6rem"
                  style={{
                    fill: "#696868",
                  }}
                >
                  of ${totalBudgetLimit} limit
                </text>
              </g>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="overview-page__budgets--chart-legend">
          {budgetData.map((entry, index) => (
            <div
              className="overview-page__budgets--chart-legend-pot"
              key={`legend-pot-${index}`}
            >
              <div
                className="decoration"
                style={{
                  backgroundColor: entry.color,
                }}
              ></div>
              <div>
                <span className="text-preset-5">{entry.name}</span>
                <p className="text-preset-4b">${entry.value.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
