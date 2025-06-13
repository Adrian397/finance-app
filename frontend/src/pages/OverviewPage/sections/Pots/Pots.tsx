import React, { type ReactElement, useMemo } from "react";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "@/utils/routePaths.ts";
import arrowIcon from "@/assets/images/common/icon-caret-right.svg";
import potIcon from "@/assets/images/pages/overview/icon-pot.svg";
import { type Pot, potService } from "@/services/potsService.ts";
import type { ApiServiceError } from "@/utils/apiUtils.ts";
import { useQuery } from "@tanstack/react-query";
import { DotLoader } from "react-spinners";
import { ErrorMessage } from "@/components/ErrorMessage/ErrorMessage.tsx";
import { EmptyMessage } from "@/components/EmptyMessage/EmptyMessage.tsx";

export const Pots = (): ReactElement => {
  const {
    data: potsData,
    isLoading,
    isError,
    error,
  } = useQuery<Pot[], ApiServiceError>({
    queryKey: ["pots"],
    queryFn: potService.getPots,
  });

  const totalSaved = useMemo(() => {
    if (!potsData) return 0;
    return potsData.reduce((sum, pot) => sum + pot.currentAmount, 0);
  }, [potsData]);

  return (
    <section className="overview-page__pots">
      <div
        className="overview-page__pots--header"
        style={{
          marginBottom:
            isLoading || isError || (potsData && potsData.length === 0)
              ? 0
              : "2rem",
        }}
      >
        <h2 className="text-preset-2">Pots</h2>
        <Link to={ROUTE_PATHS.POTS} className="btn-tertiary">
          See Details
          <img src={arrowIcon} alt="" />
        </Link>
      </div>
      {isLoading && (
        <div className="loading">
          <DotLoader color="#201F24" size={40} />
        </div>
      )}
      {isError && (
        <ErrorMessage
          message="Error fetching your savings pots"
          error={error?.message || "Unknown error"}
        />
      )}

      {!isLoading &&
        !isError &&
        (potsData && potsData.length > 0 ? (
          <div className="overview-page__pots--saved-wrapper">
            <div className="overview-page__pots--saved-total">
              <img src={potIcon} alt="" />
              <div>
                <span className="text-preset-4">Total Saved</span>
                <p className="text-preset-1">${totalSaved.toFixed(2)}</p>
              </div>
            </div>
            <div className="overview-page__pots--saved-details">
              {potsData.map((pot) => (
                <div
                  className="overview-page__pots--saved-details-pot"
                  key={pot.id}
                >
                  <div
                    className="decoration"
                    style={{ backgroundColor: pot.theme || "#cccccc" }}
                  ></div>
                  <div>
                    <span className="text-preset-5">{pot.name}</span>
                    <p className="text-preset-4b">
                      ${pot.currentAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyMessage message="You haven't set up any savings pots yet." />
        ))}
    </section>
  );
};
