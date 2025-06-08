import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import React, { type ReactElement } from "react";

type ChartDataItem = {
  name: string;
  value: number;
  color: string | null;
};

type Props = {
  data: ChartDataItem[];
  totalSpent: number;
  totalBudget: number;
};

const FALLBACK_COLOR = "#cccccc";

export const BudgetsChart = ({
  data,
  totalSpent,
  totalBudget,
}: Props): ReactElement => {
  const desiredCenterCircleDiameter = 187;
  const centerCircleRadius = desiredCenterCircleDiameter / 2;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          labelLine={false}
          outerRadius={120}
          innerRadius={80}
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || FALLBACK_COLOR}
              stroke={entry.color || FALLBACK_COLOR}
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
            ${Math.floor(totalSpent)}
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
            of ${totalBudget} spent
          </text>
        </g>
      </PieChart>
    </ResponsiveContainer>
  );
};
