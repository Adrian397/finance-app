import React, { type ReactElement, useState } from "react";
import "./PotsPage.scss";
import { PotList } from "@/pages/PotsPage/PotList/PotList.tsx";
import { AddPotModal } from "@/pages/PotsPage/AddPotModal/AddPotModal.tsx";
import { type Pot, potService } from "@/services/potsService.ts";
import type { ApiServiceError } from "@/utils/apiUtils.ts";
import { useQuery } from "@tanstack/react-query";
import { DotLoader } from "react-spinners";
import { ErrorMessage } from "@/components/ErrorMessage/ErrorMessage.tsx";
import { EmptyMessage } from "@/components/EmptyMessage/EmptyMessage.tsx";

const PotsPage = (): ReactElement => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    data: potsData,
    isLoading,
    isError,
    error,
  } = useQuery<Pot[], ApiServiceError>({
    queryKey: ["pots"],
    queryFn: potService.getPots,
  });

  return (
    <>
      <div className="pots-page">
        <div className="pots-page__heading">
          <h1 className="text-preset-1">Pots</h1>
          <button
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            + Add New Pot
          </button>
        </div>
        {isLoading && (
          <div className="loading">
            <DotLoader color="#201F24" size={50} />
          </div>
        )}
        {isError && (
          <ErrorMessage
            message="Error fetching your savings pots"
            error={error?.message || "Unknown error"}
          />
        )}
        {!isLoading && !isError && potsData && potsData.length > 0 ? (
          <PotList pots={potsData} />
        ) : (
          <EmptyMessage message="You haven't created any savings pots yet." />
        )}
      </div>
      <AddPotModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        allPots={potsData || []}
      />
    </>
  );
};

export default PotsPage;
