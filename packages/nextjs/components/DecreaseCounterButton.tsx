import React from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";

type Props = { counter: any };
export const DecreaseCounterButton = ({ counter }: Props) => {
  const { sendAsync, status } = useScaffoldWriteContract({
    contractName: "CounterContract",
    functionName: "decrease_counter",
    args: [],
  });

  const value = counter ? Number(counter) : 0;

  const isBusy = status === "pending";
  const isDisabled = isBusy || counter === undefined || value === 0;

  return (
    <button
      className="btn btn-primary btn-sm"
      onClick={() => sendAsync()}
      disabled={isDisabled}
      title={value <= 0 ? "Counter is already at 0" : undefined}
    >
      {isBusy ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        "-1"
      )}
    </button>
  );
};
