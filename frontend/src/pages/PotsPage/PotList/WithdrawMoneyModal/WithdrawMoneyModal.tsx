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

export const WithdrawMoneyModal = ({
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

  const withdrawMoneyMutation = useMutation<
    Pot,
    ApiServiceError,
    { id: number; amount: number }
  >({
    mutationFn: (variables) =>
      potService.withdrawMoneyFromPot(variables.id, variables.amount),
    onSuccess: () => {
      toast.success("Money withdrawn successfully!");
      queryClient.invalidateQueries({ queryKey: ["pots"] });
      queryClient.invalidateQueries({ queryKey: ["userSummary"] });
      onClose();
    },
    onError: (apiError) => {
      if (apiError.data?.errors?.amount) {
        setError(
          Array.isArray(apiError.data.errors.amount)
            ? apiError.data.errors.amount[0]
            : apiError.data.errors.amount,
        );
      } else {
        setError(apiError.message || "An unexpected error occurred.");
      }
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!pot) return;

    const numericAmount = parseFloat(amount);

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }
    if (numericAmount > pot.currentAmount) {
      setError("Cannot withdraw more than the available amount in the pot.");
      return;
    }

    setError(null);
    withdrawMoneyMutation.mutate({ id: pot.id, amount: numericAmount });
  };

  const currentAmount = pot?.currentAmount || 0;
  const targetAmount = pot?.targetAmount || 1;

  const amountToWithdraw = parseFloat(amount) || 0;

  const isValidForPreview =
    amountToWithdraw > 0 && amountToWithdraw <= currentAmount;

  const newAmount = currentAmount - amountToWithdraw;
  const currentProgressPercentage = (currentAmount / targetAmount) * 100;
  const newProgressPercentage = (newAmount / targetAmount) * 100;

  const innerBarWidthPercentage =
    isValidForPreview && currentProgressPercentage > 0
      ? (newProgressPercentage / currentProgressPercentage) * 100
      : 100;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Withdraw from '${pot?.name || "Pot"}'`}
      className="pot-withdraw-money-modal"
    >
      <form onSubmit={handleSubmit}>
        <p className="text-preset-4 modal-description">
          The withdrawn amount will be returned to your main balance.
        </p>
        <div className="pot-money-modal__amount">
          <div className="pot-money-modal__amount--header">
            <span className="text-preset-4">New Amount</span>
            <span className="text-preset-1">
              ${(isValidForPreview ? newAmount : currentAmount).toFixed(2)}
            </span>
          </div>
          <div className="pot-money-modal__amount--bar">
            <div
              className="pot-money-modal__amount--bar-current"
              style={{
                width: `${Math.min(currentProgressPercentage, 100)}%`,
              }}
            >
              <div
                className="pot-money-modal__amount--bar-new"
                style={{
                  width: `${Math.max(0, innerBarWidthPercentage)}%`,
                }}
              ></div>
            </div>
          </div>
          <div className="pot-money-modal__amount--target">
            <span className="text-preset-5b">
              {(isValidForPreview
                ? newProgressPercentage
                : currentProgressPercentage
              ).toFixed(1)}
              %
            </span>
            <span className="text-preset-5">
              Target of ${targetAmount.toFixed(2)}
            </span>
          </div>
        </div>
        <Input
          type="number"
          label="Amount to Withdraw"
          name="withdraw-money-pot-withdraw"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          showDollarIcon
          error={error}
          disabled={withdrawMoneyMutation.isPending}
        />
        {error && (
          <div className="modal-form-error">
            <p className="text-preset-4b">{error}</p>
          </div>
        )}
        <button
          type="submit"
          className={`btn btn-primary ${withdrawMoneyMutation.isPending ? "is-pending" : ""}`}
          disabled={withdrawMoneyMutation.isPending}
        >
          {withdrawMoneyMutation.isPending ? (
            <ClipLoader
              color={"#ffffff"}
              loading={true}
              size={26}
              aria-label="Withdrawing money from the pot..."
            />
          ) : (
            "Confirm Withdrawal"
          )}
        </button>
      </form>
    </Modal>
  );
};
