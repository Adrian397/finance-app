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
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiServiceError } from "@/utils/apiUtils.ts";
import { ClipLoader } from "react-spinners";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  allPots: Pot[];
};

export const AddPotModal = ({
  isOpen,
  onClose,
  allPots,
}: Props): ReactElement => {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [theme, setTheme] = useState(themeOptions[0].value as string);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof PotPayload | "general", string>>
  >({});

  const queryClient = useQueryClient();

  const addPotMutation = useMutation<any, ApiServiceError, PotPayload>({
    mutationFn: potService.addPot,
    onSuccess: () => {
      toast.success("Savings pot created successfully!");
      queryClient.invalidateQueries({ queryKey: ["pots"] });
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
        newErrors.general = error.message || "Failed to create pot.";
      }
      setFieldErrors(newErrors);
    },
  });

  useEffect(() => {
    if (isOpen) {
      setName("");
      setTarget("");
      setTheme(themeOptions[0].value as string);
      setFieldErrors({});
    }
  }, [isOpen]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFieldErrors({});

    addPotMutation.mutate({
      name,
      targetAmount: target,
      theme,
    });
  };

  const usedThemes = useMemo(() => {
    return new Set(allPots.map((p) => p.theme));
  }, [allPots]);

  const themeOptionsWithDisabled = useMemo(() => {
    return themeOptions.map((option) => ({
      ...option,
      disabled: usedThemes.has(String(option.value)),
    }));
  }, [usedThemes]);

  const isFormValid = name.trim() !== "" && target.trim() !== "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Pot"
      className="pot-add-modal"
    >
      <form onSubmit={handleSubmit}>
        <p className="text-preset-4 modal-description">
          Create a pot to set savings targets. These can help keep you on track
          as you save for special purchases.
        </p>
        <Input
          type="text"
          label="Pot Name"
          helper="30 characters maximum"
          placeholder="e.g. Rainy Days"
          name="add-pot-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name}
        />
        <Input
          type="number"
          label="Target"
          placeholder="e.g. 2000"
          name="add-pot-target"
          showDollarIcon
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          error={fieldErrors.targetAmount}
        />
        <Select
          label="Theme"
          name="add-pot-theme"
          options={themeOptionsWithDisabled}
          value={theme}
          onChange={(newValue) => setTheme(String(newValue))}
          showColorThemes
          error={fieldErrors.theme as string}
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
          className={`btn btn-primary modal-form-submit  ${addPotMutation.isPending ? "is-pending" : ""}`}
          disabled={!isFormValid || addPotMutation.isPending}
        >
          {addPotMutation.isPending ? (
            <ClipLoader
              color={"#ffffff"}
              loading={true}
              size={26}
              aria-label="Adding pot..."
            />
          ) : (
            "Add Pot"
          )}
        </button>
      </form>
    </Modal>
  );
};
