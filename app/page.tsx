"use client";

import { useCompletion } from "ai/react";

export default function SloganGenerator() {
  const { completion, input, handleInputChange, handleSubmit, isLoading } =
    useCompletion();

  return (
    <div className="mx-auto w-full max-w-[30rem] py-24 flex flex-col stretch">
      <h1 className="text-2xl">Slogan generator</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="fixed w-full max-w-md bottom-0 border border-gray-300 rounded mb-8 shadow-xl p-2 bg-transparent"
          value={input}
          placeholder="Describe your business..."
          onChange={handleInputChange}
        />
      </form>
      <div className="whitespace-pre-wrap my-6">
        {isLoading && <div>Thinking...</div>} {/* Loading state */}
        {completion}
      </div>
    </div>
  );
}
