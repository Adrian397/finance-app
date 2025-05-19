import { type ReactElement, useState } from "react";
import "./Sidebar.scss";
import { useAuthStore } from "@/stores/authStore.ts";
import largeLogoIcon from "@/assets/images/common/logo-large.svg";
import smallLogoIcon from "@/assets/images/common/logo-small.svg";
import { ROUTE_PATHS } from "@/utils/routePaths.ts";
import { NavLink } from "react-router-dom";
import budgetsIcon from "@/assets/images/nav/icon-nav-budgets.svg";
import potsIcon from "@/assets/images/nav/icon-nav-pots.svg";
import billsIcon from "@/assets/images/nav/icon-nav-recurring-bills.svg";
import transactionsIcon from "@/assets/images/nav/icon-nav-transactions.svg";
import overviewIcon from "@/assets/images/nav/icon-nav-overview.svg";
import minimizeIcon from "@/assets/images/nav/icon-minimize-menu.svg";
import logoutIcon from "@/assets/images/nav/icon-logout.svg";

type NavItem = {
  to: string;
  label: string;
  icon: string;
};

const navItems: NavItem[] = [
  { to: ROUTE_PATHS.OVERVIEW, label: "Overview", icon: overviewIcon },
  {
    to: ROUTE_PATHS.TRANSACTIONS,
    label: "Transactions",
    icon: transactionsIcon,
  },
  { to: ROUTE_PATHS.BUDGETS, label: "Budgets", icon: budgetsIcon },
  { to: ROUTE_PATHS.POTS, label: "Pots", icon: potsIcon },
  {
    to: ROUTE_PATHS.RECURRING_BILLS,
    label: "Recurring Bills",
    icon: billsIcon,
  },
];

export const Sidebar = (): ReactElement => {
  const [isMinimized, setIsMinimized] = useState(false);

  const logout = useAuthStore((state) => state.logout);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <nav className={`sidebar ${isMinimized ? "sidebar--minimized" : ""}`}>
      <div className="sidebar__header">
        <img src={!isMinimized ? largeLogoIcon : smallLogoIcon} alt="logo" />
      </div>
      <ul className="sidebar__nav-list">
        {navItems.map((item) => (
          <li key={item.to} className="sidebar__nav-item">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                isActive ? "sidebar__nav-link active" : "sidebar__nav-link"
              }
            >
              <img src={item.icon} alt="" className="sidebar__nav-icon" />
              {!isMinimized && (
                <span className="sidebar__nav-label text-preset-3">
                  {item.label}
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="sidebar__footer">
        <button
          onClick={toggleMinimize}
          className="sidebar__minimize-btn text-preset-3"
        >
          <img src={minimizeIcon} alt="minimize menu" />
          {!isMinimized && <span>Minimize Menu</span>}
        </button>
        <button onClick={logout} className="sidebar__logout-btn text-preset-3">
          <img src={logoutIcon} alt="logout" />
          {!isMinimized && <span>Logout</span>}
        </button>
      </div>
    </nav>
  );
};
