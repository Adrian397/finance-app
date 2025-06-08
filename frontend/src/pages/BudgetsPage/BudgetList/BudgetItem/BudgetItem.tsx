import React, { type ReactElement, useEffect, useRef, useState } from "react";
import ellipsisIcon from "@/assets/images/pages/budgets/icon-ellipsis.svg";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "@/utils/routePaths.ts";
import arrowIcon from "@/assets/images/common/icon-caret-right.svg";
import type { BudgetDetails } from "@/services/budgetService.ts";
import { EditBudgetModal } from "@/pages/BudgetsPage/BudgetList/EditBudgetModal/EditBudgetModal.tsx";
import { DeleteBudgetModal } from "@/pages/BudgetsPage/BudgetList/DeleteBudgetModal/DeleteBudgetModal.tsx";

type Props = {
  budget: BudgetDetails;
  allBudgets: BudgetDetails[];
};

export const BudgetItem = ({ budget, allBudgets }: Props): ReactElement => {
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const actionsMenuRef = useRef<HTMLDivElement>(null);

  const toggleActionsMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsActionsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionsMenuRef.current &&
        !actionsMenuRef.current.contains(event.target as Node)
      ) {
        setIsActionsMenuOpen(false);
      }
    };
    if (isActionsMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isActionsMenuOpen]);

  const handleEdit = () => {
    setIsActionsMenuOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setIsActionsMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  const remainingAmount = budget.maximumAmount - budget.spentAmount;
  const progressPercentage =
    budget.maximumAmount > 0
      ? (budget.spentAmount / budget.maximumAmount) * 100
      : 0;

  return (
    <>
      <div className="budgets-page__main--budget">
        <div className="budgets-page__main--budget-heading">
          <div>
            <div
              className="budget-color"
              style={{ backgroundColor: budget.theme || "#ccc" }}
            ></div>
            <h2 className="text-preset-2">{budget.category}</h2>
          </div>
          <div className="dropdown-wrapper" ref={actionsMenuRef}>
            <button
              onClick={toggleActionsMenu}
              aria-expanded={isActionsMenuOpen}
              aria-haspopup="menu"
              aria-label={`Actions for ${budget.category} budget`}
            >
              <img src={ellipsisIcon} alt="Actions menu" />
            </button>
            {isActionsMenuOpen && (
              <ul className="dropdown-options-list" role="menu">
                <li
                  role="menuitem"
                  onClick={handleEdit}
                  onKeyDown={(e) => e.key === "Enter" && handleEdit()}
                  tabIndex={0}
                  className="dropdown-options-item text-preset-4"
                >
                  Edit Budget
                </li>
                <li
                  role="menuitem"
                  onClick={handleDelete}
                  onKeyDown={(e) => e.key === "Enter" && handleDelete()}
                  tabIndex={0}
                  style={{ color: "red" }}
                  className="dropdown-options-item text-preset-4"
                >
                  Delete Budget
                </li>
              </ul>
            )}
          </div>
        </div>
        <div className="budgets-page__main--budget-overview">
          <span className="text-preset-4">
            Maximum of ${budget.maximumAmount.toFixed(2)}
          </span>
          <div className="budgets-page__main--budget-bar">
            <div
              className="budgets-page__main--budget-progress"
              style={{
                backgroundColor: budget.theme || "#ccc",
                width: `${Math.min(progressPercentage, 100)}%`,
              }}
            ></div>
          </div>
          <div className="budgets-page__main--budget-money">
            <div>
              <div
                className="decoration"
                style={{ backgroundColor: budget.theme || "#ccc" }}
              ></div>
              <div className="spent">
                <span className="text-preset-5">Spent</span>
                <p className="text-preset-4b">
                  ${budget.spentAmount.toFixed(2)}
                </p>
              </div>
            </div>
            <div>
              <div
                className="decoration"
                style={{ backgroundColor: "#F8F4F0" }}
              ></div>
              <div className="remaining">
                <span className="text-preset-5">Remaining</span>
                <p className="text-preset-4b">
                  ${remainingAmount > 0 ? remainingAmount.toFixed(2) : "0.00"}
                </p>
              </div>
            </div>
          </div>
          <div className="budgets-page__main--budget-latest-spending">
            <div className="budgets-page__main--budget-latest-spending__heading">
              <h3 className="text-preset-3">Latest Spending</h3>
              <Link
                to={`${ROUTE_PATHS.TRANSACTIONS}?category=${encodeURIComponent(budget.category)}`}
                className="btn-tertiary"
                title={`See all transactions for ${budget.category}`}
              >
                See All
                <img src={arrowIcon} alt="" />
              </Link>
            </div>
            <ul className="budgets-page__main--budget-latest-spending__list">
              {budget.latestTransactions.length > 0 ? (
                budget.latestTransactions.map((transaction) => (
                  <li
                    key={transaction.id}
                    className="budgets-page__main--budget-latest-spending__item"
                  >
                    <div className="name">
                      <img
                        src={transaction.avatar || undefined}
                        alt={transaction.name}
                      />
                      <span className="text-preset-5b">{transaction.name}</span>
                    </div>
                    <div className="spent">
                      <span className={`text-preset-5b amount-expense`}>
                        -${Math.abs(transaction.amount).toFixed(2)}
                      </span>
                      <p className="text-preset-5">
                        {new Date(transaction.date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="no-transactions-summary text-preset-3">
                  No recent spending in this category.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <EditBudgetModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        budget={budget}
        allBudgets={allBudgets || []}
      />
      <DeleteBudgetModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        budget={budget}
      />
    </>
  );
};
