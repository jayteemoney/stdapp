import React, { useState, useMemo, useEffect } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { useAccount } from "~~/hooks/useAccount";

type Props = { currentValue: any };
export const SetCounterForm = ({ currentValue }: Props) => {
  const [value, setValue] = useState(currentValue ? String(currentValue) : "0");
  const { sendAsync, status } = useScaffoldWriteContract({
    contractName: "CounterContract",
    functionName: "set_counter",
    args: [BigInt(value)],
  });
  const { address } = useAccount();
  const { data: owner } = useScaffoldReadContract({
    contractName: "CounterContract",
    functionName: "owner",
  });

  const normalizeToHex = (input: any) => {
    if (input === undefined || input === null) return undefined;

    if (String(input).startsWith("0x")) return input;
    return `0x${BigInt(input).toString(16)}`;
  };

  const addrHex = useMemo(() => normalizeToHex(address), [address]);
  const ownerHex = useMemo(() => normalizeToHex(owner), [owner]);

  const isOwner = useMemo(() => {
    if (!addrHex || !ownerHex) return false;
    try {
      return BigInt(addrHex) === BigInt(ownerHex);
    } catch {
      return false;
    }
  }, [addrHex, ownerHex]);

  useEffect(() => {
    if (currentValue !== undefined) {
      setValue(String(currentValue));
    }
  }, [currentValue]);

  const isBusy = status === "pending";
  const parsed = (() => {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) return undefined;
    return n;
  })();

  const getButtonTitle = () => {
    if (parsed === undefined) return "Enter a non-negative integer";
    if (!isOwner) return "Only the owner can set the counter";
    return undefined;
  };

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (parsed === undefined) return;
        sendAsync({
          args: [parsed],
        });
      }}
    >
      <input
        type="number"
        className="input input-bordered input-sm w-24"
        value={value}
        min={0}
        step={1}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className="btn btn-primary btn-sm"
        type="submit"
        disabled={isBusy || parsed === 0 || !isOwner}
        title={getButtonTitle()}
      >
        {isBusy ? (
          <>
            <span className="loading loading-spinner loading-xs"></span>
            Setting
          </>
        ) : (
          "Set"
        )}
      </button>
    </form>
  );
};
