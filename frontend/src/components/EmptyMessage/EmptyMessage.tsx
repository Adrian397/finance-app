import type { ReactElement } from "react";
import "./EmptyMessage.scss";

type Props = {
  message: string;
};

export const EmptyMessage = ({ message }: Props): ReactElement => {
  return <div className="text-preset-3 empty-message">{message}</div>;
};
