"use client";

import { useMemo } from "react";
import { useAccount } from "@starknet-react/core";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { useDeployedContractInfo } from "~~/hooks/scaffold-stark";

const RESET_COST = 10n ** 18n; // 1 STRK in FRI

export const ResetCounterButton = () => {
  const { address: accountAddress } = useAccount();
  const { data: counterContract } = useDeployedContractInfo("CounterContract");

  const { data: allowance, refetch: refetchAllowance } =
    useScaffoldReadContract({
      contractName: "Strk",
      functionName: "allowance",
      args: [accountAddress, counterContract?.address],
      watch: true,
    });

  const { sendAsync: approve, status: approveStatus } =
    useScaffoldWriteContract({
      contractName: "Strk",
      args: [counterContract?.address, RESET_COST],
      functionName: "approve",
    });

  const { sendAsync: reset, status: resetStatus } = useScaffoldWriteContract({
    contractName: "CounterContract",
    functionName: "reset_counter",
  });

  const hasEnoughAllowance = useMemo(() => {
    if (!allowance) return false;
    const allowanceBN = BigInt(allowance as any);
    return allowanceBN >= RESET_COST;
  }, [allowance]);

  const handleApprove = async () => {
    await approve({ args: [counterContract?.address, RESET_COST] });
    // Refetch allowance after approval
    setTimeout(() => refetchAllowance(), 2000);
  };

  const handleReset = async () => {
    await reset();
  };

  const isApproving = approveStatus === "pending";
  const isResetting = resetStatus === "pending";

  if (!hasEnoughAllowance) {
    return (
      <button
        className="btn btn-accent btn-sm"
        onClick={handleApprove}
        disabled={isApproving}
      >
        {isApproving ? (
          <>
            <span className="loading loading-spinner loading-xs"></span>
            Approving...
          </>
        ) : (
          "Approve 1 STRK to Reset"
        )}
      </button>
    );
  }

  return (
    <button
      className="btn btn-accent btn-sm"
      onClick={handleReset}
      disabled={isResetting}
    >
      {isResetting ? (
        <>
          <span className="loading loading-spinner loading-xs"></span>
          Resetting...
        </>
      ) : (
        "Reset Counter (1 STRK)"
      )}
    </button>
  );
};
