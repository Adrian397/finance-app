import React, { type ReactElement } from "react";
import { Modal } from "@/components/Modal/Modal.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiServiceError } from "@/utils/apiUtils.ts";
import { type Pot, potService } from "@/services/potsService.ts";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  pot: Pot | null;
};

export const DeletePotModal = ({
  isOpen,
  onClose,
  pot,
}: Props): ReactElement => {
  const queryClient = useQueryClient();

  const deletePotMutation = useMutation<void, ApiServiceError, number>({
    mutationFn: potService.deletePot,
    onSuccess: () => {
      toast.success(`Pot "${pot?.name}" deleted successfully!`);
      queryClient.invalidateQueries({ queryKey: ["pots"] });
      queryClient.invalidateQueries({ queryKey: ["userSummary"] });
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete pot.");
    },
  });

  const handleDelete = (event: React.FormEvent) => {
    event.preventDefault();
    if (!pot) return;

    deletePotMutation.mutate(pot.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Delete ${pot?.name || "Pot"}`}
      className="delete-modal"
    >
      <form onSubmit={handleDelete}>
        <p className="text-preset-4 modal-description">
          Are you sure you want to delete this pot? This action cannot be
          reversed, and all the data inside it will be removed forever.
        </p>
        <div className="action-buttons">
          <button
            type="submit"
            className={`btn btn-destroy ${deletePotMutation.isPending ? "is-pending" : ""}`}
            disabled={deletePotMutation.isPending}
          >
            {deletePotMutation.isPending ? (
              <ClipLoader
                color={"#ffffff"}
                loading={true}
                size={26}
                aria-label="Deleting pot..."
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
