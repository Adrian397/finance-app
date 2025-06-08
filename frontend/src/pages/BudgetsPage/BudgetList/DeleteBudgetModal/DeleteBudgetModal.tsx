import { Modal } from "@/components/Modal/Modal.tsx";
import React from "react";
import { type BudgetDetails, budgetService } from "@/services/budgetService.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiServiceError } from "@/utils/apiUtils.ts";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  budget: BudgetDetails | null;
};

export const DeleteBudgetModal = ({ isOpen, onClose, budget }: Props) => {
  const queryClient = useQueryClient();

  const deleteBudgetMutation = useMutation<void, ApiServiceError, number>({
    mutationFn: budgetService.deleteBudget,
    onSuccess: () => {
      toast.success(`Budget for "${budget?.category}" deleted successfully!`);
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete budget.");
    },
  });

  const handleDelete = (event: React.FormEvent) => {
    event.preventDefault();
    if (!budget) return;

    deleteBudgetMutation.mutate(budget.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Delete ${budget?.category || "Budget"}`}
      className="budget-delete-modal"
    >
      <form onSubmit={handleDelete}>
        <p className="text-preset-4">
          Are you sure you want to delete this budget? This action cannot be
          reversed, and all the data inside it will be removed forever.
        </p>
        <div className="action-buttons">
          <button
            type="submit"
            className={`btn btn-destroy ${deleteBudgetMutation.isPending ? "is-pending" : ""}`}
            disabled={deleteBudgetMutation.isPending}
          >
            {deleteBudgetMutation.isPending ? (
              <ClipLoader
                color={"#ffffff"}
                loading={true}
                size={26}
                aria-label="Deleting budget..."
              />
            ) : (
              "Yes, Confirm Deletion"
            )}
          </button>
          <button type="button" onClick={onClose}>
            No, Go back
          </button>
        </div>
      </form>
    </Modal>
  );
};
