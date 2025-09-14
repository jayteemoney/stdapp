"use client";

import { N } from "ethers";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-stark/useScaffoldEventHistory";

export const CounterChangedEvents = () => {
  const {
    data: events,
    isLoading,
    error,
  } = useScaffoldEventHistory({
    contractName: "CounterContract",
    eventName: "CounterChanged",
    fromBlock: 0n,
    watch: true,
  });

  if (error) {
    return <div className="text-center text-error">Failed to load</div>;
  }

  if (isLoading && !events) {
    return (
      <div className="text-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-4">No events found.</div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-base-200 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-4">
        Counter Change History
      </h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Old Value</th>
              <th>New Value</th>
              <th className="hidden md:table-cell">Block Number</th>
              <th className="hidden lg:table-cell">Transaction Hash</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, i) => (
              <tr
                key={`${event.block.blockNumber}-${event.transactionHash}-${i}`}
              >
                <td>{Number(event.parsedArgs.old_value) ?? "N/A"}</td>
                <td>{Number(event.parsedArgs.new_value) ?? "N/A"}</td>
                <td className="hidden md:table-cell">
                  {event.block.block_number?.toString()}
                </td>
                <td className="hidden lg:table-cell truncate max-w-xs">
                  {event.block.parent_hash}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
