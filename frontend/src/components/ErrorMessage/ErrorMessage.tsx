import type { ReactElement } from "react";
import "./ErrorMessage.scss";

type Props = {
  message: string;
  error: string;
};

export const ErrorMessage = ({ message, error }: Props): ReactElement => {
  return (
    <div className="text-preset-3 error-message">
      {message}: {error}
    </div>
  );
};
