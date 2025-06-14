"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function JoinRacePage() {
  const [raceId, setRaceId] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    if (raceId.trim()) {
      router.push(`/race/lobby/${raceId}`);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Join a Race</h1>

      <input
        type="text"
        placeholder="Enter Race ID"
        value={raceId}
        onChange={(e) => setRaceId(e.target.value)}
        className="px-4 py-2 border rounded w-72 mb-4"
      />

      <button
        onClick={handleJoin}
        className="bg-blue-600 text-white px-6 py-3 rounded text-lg hover:bg-blue-700"
      >
        Join Race Lobby
      </button>
    </main>
  );
}
