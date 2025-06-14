// src/app/test/page.tsx
"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";

export default function TestPage() {
  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.auth.getUser();
      console.log("User:", data.user);
      if (error) console.error("Error:", error);
    };

    testConnection();
  }, []);

  return <div>Check the console for Supabase connection test.</div>;
}
