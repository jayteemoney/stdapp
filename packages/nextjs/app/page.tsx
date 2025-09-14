"use client";
import { CounterChangedEvents } from "~~/components/CounterChangedEvents";
import { CounterValue } from "~~/components/CounterValue";
import { DecreaseCounterButton } from "~~/components/DecreaseCounterButton";
import { IncreaseCounterButton } from "~~/components/IncreaseCounterButton";
import { ResetCounterButton } from "~~/components/ResetCounterButton";
import { SetCounterForm } from "~~/components/SetCounterForm";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";

const Home = () => {
  const { data, isLoading, error } = useScaffoldReadContract({
    contractName: "CounterContract",
    functionName: "get_counter",
    args: [],
  });
  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="px-5 w-full max-w-md">
        <div className="bg-base-200 rounded-lg shadow-lg p-6 space-y-4">
          <h1 className="text-2xl font-bold text-center">Starknet Counter</h1>
          <div className="flex items-center justify-center gap-4 text-2xl">
            <DecreaseCounterButton counter={data} />
            <CounterValue value={data} isLoading={isLoading} error={error} />
            <IncreaseCounterButton />
          </div>
          <div className="flex justify-center">
            <SetCounterForm currentValue={data} />
          </div>
          <div className="flex justify-center">
            <ResetCounterButton />
          </div>
        </div>
      </div>

      <div className="mt-8 w-full">
        <CounterChangedEvents />
      </div>
    </div>
  );
};

export default Home;
