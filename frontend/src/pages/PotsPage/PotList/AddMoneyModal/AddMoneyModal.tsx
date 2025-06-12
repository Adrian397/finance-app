import React, { type ReactElement, useEffect, useState } from "react";
import { Modal } from "@/components/Modal/Modal.tsx";
import { Input } from "@/components/Input/Input.tsx";
import { type Pot, potService } from "@/services/potsService.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { ApiServiceError } from "@/utils/apiUtils.ts";
import { ClipLoader } from "react-spinners";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  pot: Pot | null;
};

export const AddMoneyModal = ({
  isOpen,
  onClose,
  pot,
}: Props): ReactElement => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setError(null);
    }
  }, [isOpen]);

  const addMoneyMutation = useMutation<
    Pot,
    ApiServiceError,
    { id: number; amount: number }
  >({
    mutationFn: (variables) =>
      potService.addMoneyToPot(variables.id, variables.amount),
    onSuccess: () => {
      toast.success("Money added to pot successfully!");
      queryClient.invalidateQueries({ queryKey: ["pots"] });
      queryClient.invalidateQueries({ queryKey: ["userSummary"] });
      onClose();
    },
    onError: (apiError) => {
      if (apiError.data?.errors?.amount) {
        const amountErrors = apiError.data.errors.amount;
        const firstErrorMessage = Array.isArray(amountErrors)
          ? amountErrors[0]
          : amountErrors;
        setError(firstErrorMessage);
      } else {
        setError(apiError.message || "An unexpected error occurred.");
      }
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!pot) return;

    const numericAmount = parseFloat(amount);
    const potTarget = pot.targetAmount;
    const potCurrent = pot.currentAmount;

    if (!pot || !amount || isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }

    if (potCurrent + numericAmount > potTarget) {
      setError(
        `This amount would exceed the target of $${potTarget.toFixed(2)}.`,
      );
      return;
    }

    setError(null);
    addMoneyMutation.mutate({ id: pot.id, amount: numericAmount });
  };

  const currentAmount = pot?.currentAmount || 0;
  const targetAmount = pot?.targetAmount || 1;
  const amountToAdd = parseFloat(amount) || 0;
  const newAmount = currentAmount + amountToAdd;
  const progressPercentage = (currentAmount / targetAmount) * 100;
  const newProgressPercentage = (newAmount / targetAmount) * 100;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add to '${pot?.name || "Pot"}'`}
      className="pot-add-money-modal"
    >
      <form onSubmit={handleSubmit}>
        <p className="text-preset-4 modal-description">
          Add funds from your main balance to this savings pot.
        </p>
        <div className="pot-money-modal__amount">
          <div className="pot-money-modal__amount--header">
            <span className="text-preset-4">New Amount</span>
            <span className="text-preset-1">
              $
              {newAmount > currentAmount
                ? newAmount.toFixed(2)
                : currentAmount.toFixed(2)}
            </span>
          </div>
          <div className="pot-money-modal__amount--bar">
            <div
              className="pot-money-modal__amount--bar-new"
              style={{ width: `${Math.min(newProgressPercentage, 100)}%` }}
            >
              <div
                className="pot-money-modal__amount--bar-current"
                style={{
                  width: `${(progressPercentage / newProgressPercentage) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <div className="pot-money-modal__amount--target">
            <span className="text-preset-5b">
              {newProgressPercentage > progressPercentage
                ? newProgressPercentage.toFixed(2)
                : progressPercentage.toFixed(2)}
              %
            </span>
            <span className="text-preset-5">
              Target of ${targetAmount.toFixed(2)}
            </span>
          </div>
        </div>
        <Input
          type="number"
          label="Amount to Add"
          name="add-money-pot-add"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          showDollarIcon
          error={error}
        />
        {error && (
          <div className="modal-form-error">
            <p className="text-preset-4b">{error}</p>
          </div>
        )}
        <button
          type="submit"
          className={`btn btn-primary modal-form-submit  ${addMoneyMutation.isPending ? "is-pending" : ""}`}
          disabled={addMoneyMutation.isPending}
        >
          {addMoneyMutation.isPending ? (
            <ClipLoader
              color={"#ffffff"}
              loading={true}
              size={26}
              aria-label="Adding money to pot..."
            />
          ) : (
            "Confirm Addition"
          )}
        </button>
      </form>
    </Modal>
  );
};
