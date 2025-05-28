"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface User {
  id: string;
  name: string;
  image: string;
  wins: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/leaderboard");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Leaderboard</h1>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 flex items-center"
            >
              <div className="flex-shrink-0 w-12 text-center">
                <span
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    index === 0
                      ? "bg-yellow-100 text-yellow-800"
                      : index === 1
                      ? "bg-gray-100 text-gray-800"
                      : index === 2
                      ? "bg-orange-100 text-orange-800"
                      : "bg-gray-50 text-gray-600"
                  }`}
                >
                  {index + 1}
                </span>
              </div>
              <div className="flex items-center flex-1">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    {user.name}
                  </h2>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-indigo-600">
                  {user.wins}
                </span>
                <span className="ml-2 text-sm text-gray-500">wins</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
