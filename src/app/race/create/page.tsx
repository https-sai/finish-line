"use client";

import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { createClient } from "@/utils/supabase/client";

export default function CreateRacePage() {
  const router = useRouter();
  const supabase = createClient();

  const handleCreateRace = async () => {
    const userRes = await supabase.auth.getUser();
    const user = userRes.data.user;
    if (!user) return alert("Not Logged in");
    const raceId = nanoid(); // e.g., "Uakgb_J5m9g-0JDMbcJqL"
    const raceCode = nanoid(6).toUpperCase(); // e.g., "A1B2C3"

    console.log(raceId);
    console.log(raceCode);
    // 1. Create Race
    const { error: raceError } = await supabase.from("races").insert({
      id: raceId,
      race_code: raceCode,
      created_by: user.id,
      status: "lobby",
      duration: 16,
      started_at: null,
      created_at: null,
    });
    if (raceError) {
      console.error("Failed to create race:", raceError);
      return;
    }

    //2. Add Creator/Admin to race_participants
    const { error: participantError } = await supabase
      .from("race_participants")
      .insert({
        id: nanoid(),
        race_id: raceId,
        user_id: user.id,
        is_admin: true,
      });
    if (participantError) {
      console.error("Failed to add participant:", participantError);
      return;
    }

    // 3. Redirect to Lobby
    router.push(`/race/${raceCode}/lobby`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Create a New Race</h1>
      <button
        onClick={handleCreateRace}
        className="bg-green-600 text-white px-6 py-3 rounded text-lg hover:bg-green-700"
      >
        Create Race
      </button>
    </main>
  );
}
