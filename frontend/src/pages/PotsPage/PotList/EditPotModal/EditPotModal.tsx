import React, { type ReactElement, useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/Modal/Modal.tsx";
import { Input } from "@/components/Input/Input.tsx";
import { Select } from "@/components/Select/Select.tsx";
import { themeOptions } from "@/utils/general.ts";
import {
  type Pot,
  type PotPayload,
  potService,
} from "@/services/potsService.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiServiceError } from "@/utils/apiUtils.ts";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  pot: Pot | null;
  allPots: Pot[];
};

export const EditPotModal = ({
  isOpen,
  onClose,
  pot,
  allPots,
}: Props): ReactElement => {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [theme, setTheme] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof PotPayload | "general", string>>
  >({});

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen && pot) {
      setName(pot.name);
      setTarget(String(pot.targetAmount));
      setTheme(pot.theme || (themeOptions[0].value as string));
      setFieldErrors({});
    }
  }, [isOpen, pot]);

  const updatePotMutation = useMutation<
    Pot,
    ApiServiceError,
    { id: number; payload: PotPayload }
  >({
    mutationFn: (variables) =>
      potService.updatePot(variables.id, variables.payload),
    onSuccess: () => {
      toast.success("Pot updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["pots"] });
      onClose();
    },
    onError: (error) => {
      const newErrors: Partial<Record<string, string>> = {};
      if (error.data && error.data.errors) {
        for (const key in error.data.errors) {
          newErrors[key] = Array.isArray(error.data.errors[key])
            ? error.data.errors[key][0]
            : error.data.errors[key];
        }
      } else {
        newErrors.general = error.message || "Failed to update pot.";
      }
      setFieldErrors(newErrors);
    },
  });

  const usedThemes = useMemo(() => {
    if (!allPots || !pot) return new Set();
    return new Set(allPots.filter((p) => p.id !== pot.id).map((p) => p.theme));
  }, [allPots, pot]);

  const themeOptionsWithDisabled = useMemo(() => {
    return themeOptions.map((option) => ({
      ...option,
      disabled: usedThemes.has(String(option.value)),
    }));
  }, [usedThemes]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!pot) return;

    setFieldErrors({});
    updatePotMutation.mutate({
      id: pot.id,
      payload: {
        name,
        targetAmount: target,
        theme,
      },
    });
  };

  const isFormValid =
    name.trim() !== "" && target.trim() !== "" && !isNaN(parseFloat(target));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Pot"
      className="pot-edit-modal"
    >
      <form onSubmit={handleSubmit}>
        <p className="text-preset-4 modal-description">
          If your saving targets change, feel free to update your pots.
        </p>
        <Input
          type="text"
          label="Pot Name"
          placeholder="e.g. Rainy Days"
          name="edit-pot-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name}
          helper="30 characters maximum"
          disabled={updatePotMutation.isPending}
        />
        <Input
          type="number"
          label="Target"
          placeholder="e.g. 2000"
          name="edit-pot-target"
          showDollarIcon
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          error={fieldErrors.targetAmount}
          disabled={updatePotMutation.isPending}
        />
        <Select
          label="Theme"
          name="edit-pot-theme"
          options={themeOptionsWithDisabled}
          value={theme}
          onChange={(newValue) => setTheme(String(newValue))}
          showColorThemes
          error={fieldErrors.theme as string}
          disabled={updatePotMutation.isPending}
        />
        {Object.keys(fieldErrors).length > 0 && (
          <div className="modal-form-error">
            {Object.values(fieldErrors).map((err, i) => (
              <p className="text-preset-4b" key={i}>
                {err}
              </p>
            ))}
          </div>
        )}
        <button
          type="submit"
          className={`btn btn-primary modal-form-submit  ${updatePotMutation.isPending ? "is-pending" : ""}`}
          disabled={!isFormValid || updatePotMutation.isPending}
        >
          {updatePotMutation.isPending ? (
            <ClipLoader
              color={"#ffffff"}
              loading={true}
              size={26}
              aria-label="Editing pot..."
            />
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </Modal>
  );
};
