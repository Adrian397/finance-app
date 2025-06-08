import { Select } from "@/components/Select/Select.tsx";
import { Input } from "@/components/Input/Input.tsx";
import { Modal } from "@/components/Modal/Modal.tsx";
import React, { useEffect, useMemo, useState } from "react";
import {
  type BudgetDetails,
  type BudgetPayload,
  budgetService,
} from "@/services/budgetService.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiServiceError } from "@/utils/apiUtils.ts";
import { toast } from "react-toastify";
import { categoryOptions, themeOptions } from "@/utils/general.ts";
import { ClipLoader } from "react-spinners";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  allBudgets: BudgetDetails[];
};

const defaultCategoryOptions = categoryOptions.filter(
  (opt) => opt.value !== "",
);

export const AddBudgetModal = ({ isOpen, onClose, allBudgets }: Props) => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [theme, setTheme] = useState(themeOptions[0].value as string);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof BudgetPayload | "general", string>>
  >({});

  const queryClient = useQueryClient();

  const addBudgetMutation = useMutation<any, ApiServiceError, BudgetPayload>({
    mutationFn: budgetService.addBudget,
    onSuccess: () => {
      toast.success("Budget created successfully!");
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

  const usedThemes = useMemo(() => {
    return new Set(allBudgets.map((b) => b.theme));
  }, [allBudgets]);

  const themeOptionsWithDisabled = useMemo(() => {
    return themeOptions.map((option) => ({
      ...option,
      disabled: usedThemes.has(String(option.value)),
    }));
  }, [usedThemes]);

  useEffect(() => {
    if (isOpen) {
      const firstAvailableTheme = themeOptionsWithDisabled.find(
        (opt) => !opt.disabled,
      );
      setCategory((defaultCategoryOptions[0]?.value || "") as string);
      setAmount("");
      setTheme(firstAvailableTheme ? String(firstAvailableTheme.value) : "");
      setFieldErrors({});
    }
  }, [isOpen, themeOptionsWithDisabled]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFieldErrors({});

    addBudgetMutation.mutate({
      category,
      maximumAmount: amount,
      theme,
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
      title="Add New Budget"
      className="budget-add-modal"
    >
      <form onSubmit={handleSubmit}>
        <p className="text-preset-4 description">
          Choose a category to set a spending budget. These categories can help
          you monitor spending.
        </p>
        <Select
          label="Budget Category"
          name="add-budget-category"
          onChange={(newValue) => setCategory(String(newValue))}
          value={category}
          options={defaultCategoryOptions}
          id="add-budget-category"
          error={fieldErrors.category}
        />
        <Input
          label="Maximum Spend"
          type="number"
          name="add-maximum-spend"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
          id="add-maximum-spend"
          placeholder="e.g. 2000"
          showDollarIcon
          error={fieldErrors.maximumAmount}
        />
        <Select
          label="Theme"
          name="add-budget-theme"
          id="add-budget-theme"
          onChange={(newValue) => setTheme(String(newValue))}
          value={theme}
          options={themeOptionsWithDisabled}
          error={fieldErrors.theme}
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
          className={`btn btn-primary modal-form-submit  ${addBudgetMutation.isPending ? "is-pending" : ""}`}
          disabled={!isFormValid || addBudgetMutation.isPending}
        >
          {addBudgetMutation.isPending ? (
            <ClipLoader
              color={"#ffffff"}
              loading={true}
              size={26}
              aria-label="Adding budget..."
            />
          ) : (
            "Add Budget"
          )}
        </button>
      </form>
    </Modal>
  );
};
