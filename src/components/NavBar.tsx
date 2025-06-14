// components/Navbar.tsx
"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-2 bg-gray-700 text-white shadow-md z-50">
      <Link
        href="/"
        className="font-bold text-xl hover:text-gray-300 transition-colors"
      >
        🏁 Finish Line
      </Link>
      <div className="flex items-center space-x-6">
        <Link
          href="/dashboard"
          className="hover:text-gray-300 transition-colors"
        >
          Dashboard
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className=" text-blue-500 hover:text-blue-200"
      >
        Logout
      </button>
    </nav>
  );
}
