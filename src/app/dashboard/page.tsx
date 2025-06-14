// app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/login");
      else setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-8">Welcome to 🏁 Finish Line</h1>

      <div className="space-y-4 space-x-4">
        <button
          onClick={() => router.push("/race/create")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded text-lg"
        >
          Create a Race
        </button>

        <button
          onClick={() => router.push("/race/join")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded text-lg"
        >
          Join a Race
        </button>
      </div>
    </main>
  );
}
