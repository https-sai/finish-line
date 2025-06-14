// app/page.tsx
"use client";
import { createClient } from "../utils/supabase/client";

export default function Home() {
  const supabase = createClient();
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/dashboard`,
      },
    });
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6">
      <h1 className="text-4xl font-bold">🏁 Finish Line</h1>
      <p className="mt-4 text-lg text-gray-600">
        Compete by completing your real-life tasks!
      </p>
      <button
        onClick={handleGoogleLogin}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Log In with Google
      </button>
    </main>
  );
}
