import React, { type ReactElement, useEffect, useRef, useState } from "react";
import ellipsisIcon from "@/assets/images/pages/budgets/icon-ellipsis.svg";
import { EditPotModal } from "@/pages/PotsPage/PotList/EditPotModal/EditPotModal.tsx";
import { DeletePotModal } from "@/pages/PotsPage/PotList/DeletePotModal/DeletePotModal.tsx";
import { AddMoneyModal } from "@/pages/PotsPage/PotList/AddMoneyModal/AddMoneyModal.tsx";
import { WithdrawMoneyModal } from "@/pages/PotsPage/PotList/WithdrawMoneyModal/WithdrawMoneyModal.tsx";
import type { Pot } from "@/services/potsService.ts";

type Props = {
  pot: Pot;
  allPots: Pot[];
};

export const PotItem = ({ pot, allPots }: Props): ReactElement => {
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [isWithdrawMoneyModalOpen, setIsWithdrawMoneyModalOpen] =
    useState(false);

  const actionsMenuRef = useRef<HTMLDivElement>(null);

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

  const toggleActionsMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsActionsMenuOpen((prev) => !prev);
  };

  const handleEdit = () => {
    setIsActionsMenuOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setIsActionsMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  const progressPercentage =
    pot.targetAmount > 0 ? (pot.currentAmount / pot.targetAmount) * 100 : 0;

  return (
    <>
      <div className="pots-page__pot">
        <div className="pots-page__pot--header">
          <div>
            <div
              className="theme-color"
              style={{ backgroundColor: pot.theme || "#ccc" }}
            ></div>
            <h2 className="text-preset-2">{pot.name}</h2>
          </div>
          <div className="dropdown-wrapper" ref={actionsMenuRef}>
            <button
              onClick={toggleActionsMenu}
              aria-expanded={isActionsMenuOpen}
              aria-haspopup="menu"
              aria-label={`Actions for ${pot.name} pot`}
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
                  Edit Pot
                </li>
                <li
                  role="menuitem"
                  onClick={handleDelete}
                  onKeyDown={(e) => e.key === "Enter" && handleDelete()}
                  tabIndex={0}
                  style={{ color: "#C94736" }}
                  className="dropdown-options-item text-preset-4"
                >
                  Delete Pot
                </li>
              </ul>
            )}
          </div>
        </div>
        <div className="pots-page__pot--overview">
          <div className="pots-page__pot--overview-saved">
            <span className="text-preset-4">Total Saved</span>
            <span className="text-preset-1">
              ${pot.currentAmount.toFixed(2)}
            </span>
          </div>
          <div className="pots-page__pot--overview-bar">
            <div
              className="pots-page__pot--overview-progress"
              style={{
                backgroundColor: pot.theme || "#ccc",
                width: `${Math.min(progressPercentage, 100)}%`,
              }}
            ></div>
          </div>
          <div className="pots-page__pot--overview-percentage">
            <span className="text-preset-5b">
              {progressPercentage.toFixed(2)}%
            </span>
            <span className="text-preset-5">
              Target of ${pot.targetAmount.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="pots-page__pot--action-btns">
          <button
            className="btn btn-secondary text-preset-4b"
            onClick={() => setIsAddMoneyModalOpen(true)}
          >
            + Add Money
          </button>
          <button
            className="btn btn-secondary text-preset-4b"
            onClick={() => setIsWithdrawMoneyModalOpen(true)}
          >
            Withdraw
          </button>
        </div>
      </div>
      <DeletePotModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        pot={pot}
      />
      <EditPotModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        pot={pot}
        allPots={allPots}
      />
      <AddMoneyModal
        isOpen={isAddMoneyModalOpen}
        onClose={() => setIsAddMoneyModalOpen(false)}
        pot={pot}
      />
      <WithdrawMoneyModal
        isOpen={isWithdrawMoneyModalOpen}
        onClose={() => setIsWithdrawMoneyModalOpen(false)}
        pot={pot}
      />
    </>
  );
};
