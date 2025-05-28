"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Race {
  id: string;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  participants: {
    id: string;
    name: string;
    image: string;
  }[];
}

export default function RacesPage() {
  const { data: session } = useSession();
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const response = await fetch("/api/races");
        if (response.ok) {
          const data = await response.json();
          setRaces(data);
        }
      } catch (error) {
        console.error("Failed to fetch races:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Races</h1>
        {session && (
          <Link
            href="/races/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            Create New Race
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {races.map((race) => (
          <motion.div
            key={race.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-sm rounded-lg overflow-hidden"
          >
            <Link href={`/races/${race.id}`}>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {race.name}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {race.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      race.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : race.status === "active"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {race.status}
                  </span>
                  <span>
                    Ends: {new Date(race.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex -space-x-2">
                  {race.participants.map((participant) => (
                    <img
                      key={participant.id}
                      src={participant.image}
                      alt={participant.name}
                      className="w-8 h-8 rounded-full border-2 border-white"
                      title={participant.name}
                    />
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
