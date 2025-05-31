import { type ReactElement, useEffect, useState } from "react";
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

const MINIMIZE_BREAKPOINT = 1450;

export const Sidebar = (): ReactElement => {
  const [userPrefersMinimized, setUserPrefersMinimized] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(
    window.innerWidth <= MINIMIZE_BREAKPOINT,
  );

  const isDisplayedAsMinimized = isSmallScreen ? true : userPrefersMinimized;

  const logout = useAuthStore((state) => state.logout);

  const handleManualToggle = () => {
    setUserPrefersMinimized((prev) => !prev);
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= MINIMIZE_BREAKPOINT);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <nav
      className={`sidebar ${isDisplayedAsMinimized ? "sidebar--minimized" : ""}`}
    >
      <div className="sidebar__header">
        <img
          src={!isDisplayedAsMinimized ? largeLogoIcon : smallLogoIcon}
          alt="logo"
        />
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
              <span className="sidebar__nav-label text-preset-3">
                {item.label}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="sidebar__footer">
        {!isSmallScreen && (
          <button
            onClick={handleManualToggle}
            className="sidebar__minimize-btn text-preset-3"
          >
            <img
              src={minimizeIcon}
              alt={userPrefersMinimized ? "Expand menu" : "Minimize menu"}
            />
            {!userPrefersMinimized && <span>Minimize Menu</span>}
          </button>
        )}
        <button onClick={logout} className="sidebar__logout-btn">
          <img src={logoutIcon} alt="logout" />
          <span className="text-preset-3">Logout</span>
        </button>
      </div>
    </nav>
  );
};
