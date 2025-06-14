// app/race/[id]/lobby/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import TaskList from "@/components/TaskList";
import { nanoid } from "nanoid";

export default function LobbyPage() {
  const { raceCode } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [raceId, setRaceId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [participants, setParticipants] = useState<any[]>([]);

  useEffect(() => {
    const fetchLobbyData = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      setUserId(user.id);

      const { data: race } = await supabase
        .from("races")
        .select("*")
        .eq("race_code", raceCode)
        .single();

      if (!race) return;
      setRaceId(race.id);

      // Ensure user is in participants table
      const { data: existing } = await supabase
        .from("race_participants")
        .select("*")
        .eq("race_id", race.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (!existing) {
        await supabase.from("race_participants").insert({
          id: nanoid(),
          race_id: race.id,
          user_id: user.id,
          is_admin: false,
        });
      } else {
        setIsAdmin(existing.is_admin);
      }
      // Fetch all participants
      const { data: joined } = await supabase
        .from("race_participants")
        .select("*")
        .eq("race_id", race.id);

      setParticipants(joined || []);
    };
    fetchLobbyData();
  }, [raceCode]);

  const handleSubmitTasks = async (tasks: string[]) => {
    if (!raceId || !userId) return;
    await supabase
      .from("race_participants")
      .update({ tasks })
      .eq("race_id", raceId)
      .eq("user_id", userId);

    alert("Tasks submitted!");
  };

  const handleStartRace = async () => {
    if (!raceId || !isAdmin) return;

    const allReady =
      participants.length > 1 &&
      participants.every(
        (p) =>
          Array.isArray(p.tasks) && p.tasks.length > 0 && p.tasks.length <= 10
      );

    if (!allReady) {
      alert("Everyone must enter 1–10 tasks. At least 2 users required.");
      return;
    }

    await supabase
      .from("races")
      .update({ status: "active", started_at: new Date().toISOString() })
      .eq("id", raceId);

    router.push(`/race/${raceCode}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Race Lobby</h1>
      <TaskList onSubmit={handleSubmitTasks} />
      {isAdmin && (
        <button
          onClick={handleStartRace}
          className="mt-6 bg-purple-600 text-white px-6 py-2 rounded"
        >
          Start Race
        </button>
      )}
    </div>
  );
}
