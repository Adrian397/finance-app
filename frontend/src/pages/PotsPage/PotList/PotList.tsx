import React, { type ReactElement } from "react";
import { PotItem } from "@/pages/PotsPage/PotList/PotItem/PotItem.tsx";
import type { Pot } from "@/services/potsService.ts";

type Props = {
  pots: Pot[];
};

export const PotList = ({ pots }: Props): ReactElement => {
  return (
    <div className="pots-page__list">
      {pots.map((pot) => (
        <PotItem key={pot.id} pot={pot} allPots={pots} />
      ))}
    </div>
  );
};
