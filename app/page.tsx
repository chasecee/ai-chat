"use client";

import { useCompletion } from "ai/react";
import Header from "./components/Header";
import { SetStateAction, useState } from "react";
import Loading from "./components/Loading";

export default function SloganGenerator() {
  const [temperature, setTemperature] = useState(0.9); // Default temperature

  const { completion, input, handleInputChange, handleSubmit, isLoading } =
    useCompletion({
      api: "/api/completion",
      body: { temperature: temperature }, // Include the temperature value
    });

  const handleTemperatureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTemperature(parseFloat(event.target.value));
  };
  return (
    <div>
      <Header />
      <div className="mx-auto w-full max-w-[30rem] py-24 flex flex-col stretch">
        <form onSubmit={handleSubmit}>
          <div className="fixed bottom-8">
            <div className="flex flex-col gap-6 w-full">
              <input
                className="w-[30rem] max-w-full border border-gray-300 rounded shadow-xl p-2 bg-white dark:bg-gray-800"
                value={input}
                placeholder="Describe your business or brand..."
                onChange={handleInputChange}
              />
              <div className="flex flex-row gap-2 items-center">
                <label
                  htmlFor="temp"
                  className={`block flex-none dark:opacity-80 ${
                    temperature > 1.2
                      ? "text-red-400 animate-bounce"
                      : temperature >= 0.9
                      ? "text-yellow-600 dark:text-yellow-400"
                      : ""
                  } `}
                >
                  Sauce: {temperature}
                </label>
                <input
                  id="temp"
                  type="range"
                  min="0"
                  max="1.5"
                  step="0.1"
                  value={temperature}
                  onChange={handleTemperatureChange}
                  className={`slider w-full max-w-lg ${
                    temperature > 1.2
                      ? "high-temperature"
                      : temperature >= 0.9
                      ? "text-yellow-400"
                      : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </form>
        <div className="whitespace-pre-wrap my-6 ">
          <div className="text-xl font-bold text-center leading-10 ">
            {isLoading && (
              <div className="opacity-50">
                <Loading />
                Thinking...
              </div>
            )}{" "}
            {/* Loading state */}
            {completion}
          </div>
        </div>
      </div>
    </div>
  );
}
