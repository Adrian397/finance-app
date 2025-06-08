import { Select } from "@/components/Select/Select.tsx";
import { categoryOptions, themeOptions } from "@/utils/general.ts";
import { Input } from "@/components/Input/Input.tsx";
import { Modal } from "@/components/Modal/Modal.tsx";
import React, { useEffect, useMemo, useState } from "react";
import {
  type BudgetDetails,
  type BudgetPayload,
  budgetService,
} from "@/services/budgetService.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { ApiServiceError } from "@/utils/apiUtils.ts";
import { ClipLoader } from "react-spinners";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  budget: BudgetDetails | null;
  allBudgets: BudgetDetails[];
};

const defaultCategoryOptions = categoryOptions.filter(
  (opt) => opt.value !== "",
);

export const EditBudgetModal = ({
  isOpen,
  onClose,
  budget,
  allBudgets,
}: Props) => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [theme, setTheme] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof BudgetPayload | "general", string>>
  >({});

  const queryClient = useQueryClient();

  const usedThemes = useMemo(() => {
    if (!allBudgets || !budget) return new Set();

    return new Set(
      allBudgets.filter((b) => b.id !== budget.id).map((b) => b.theme),
    );
  }, [allBudgets, budget]);

  const themeOptionsWithDisabled = useMemo(() => {
    return themeOptions.map((option) => ({
      ...option,
      disabled: usedThemes.has(String(option.value)),
    }));
  }, [usedThemes]);

  useEffect(() => {
    if (isOpen && budget) {
      setCategory(budget.category);
      setAmount(String(budget.maximumAmount));
      setTheme(budget.theme || (themeOptions[0].value as string));
      setFieldErrors({});
    }
  }, [isOpen, budget]);

  const updateBudgetMutation = useMutation<
    BudgetDetails,
    ApiServiceError,
    { id: number; payload: BudgetPayload }
  >({
    mutationFn: (variables) =>
      budgetService.updateBudget(variables.id, variables.payload),
    onSuccess: () => {
      toast.success("Budget updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      onClose();
    },
    onError: (error) => {
      const newErrors: Partial<Record<string, string>> = {};
      let hasSpecificErrors = false;
      if (error.data && error.data.errors) {
        for (const key in error.data.errors) {
          const messages = error.data.errors[key];
          newErrors[key] = Array.isArray(messages) ? messages[0] : messages;
          hasSpecificErrors = true;
        }
      }
      if (!hasSpecificErrors) {
        newErrors.general = error.message || "Failed to create budget.";
      }
      setFieldErrors(newErrors);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFieldErrors({});

    if (!budget) return;
    updateBudgetMutation.mutate({
      id: budget.id,
      payload: {
        category,
        maximumAmount: amount,
        theme,
      },
    });
  };

  const isFormValid =
    category.trim() !== "" &&
    amount.trim() !== "" &&
    !isNaN(parseFloat(amount));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${budget?.category || "Budget"}`}
      className="budget-edit-modal"
    >
      <form onSubmit={handleSubmit}>
        <p className="text-preset-4 description">
          As your budgets change, feel free to update your spending limits.
        </p>
        <Select
          label="Budget Category"
          name="edit-budget-category"
          onChange={(newValue) => setCategory(String(newValue))}
          value={category}
          options={defaultCategoryOptions}
          id="edit-budget-category"
          error={fieldErrors.category}
        />
        <Input
          label="Maximum Spend"
          type="number"
          name="edit-maximum-spend"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
          showDollarIcon
          id="edit-maximum-spend"
          error={fieldErrors.maximumAmount}
        />
        <Select
          label="Theme"
          name="edit-budget-theme"
          onChange={(newValue) => setTheme(String(newValue))}
          value={theme}
          options={themeOptionsWithDisabled}
          id="edit-budget-theme"
          error={fieldErrors.theme as string}
          showColorThemes
        />
        {Object.keys(fieldErrors).length > 0 && (
          <div className="modal-form-error">
            {Object.entries(fieldErrors).map(([field, message]) => (
              <p className="text-preset-4b" key={field}>
                {message}
              </p>
            ))}
          </div>
        )}
        <button
          type="submit"
          className={`btn btn-primary modal-form-submit  ${updateBudgetMutation.isPending ? "is-pending" : ""}`}
          disabled={!isFormValid || updateBudgetMutation.isPending}
        >
          {updateBudgetMutation.isPending ? (
            <ClipLoader
              color={"#ffffff"}
              loading={true}
              size={26}
              aria-label="Editing budget..."
            />
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </Modal>
  );
};
