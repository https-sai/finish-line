"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import InviteFriend from "@/components/InviteFriend";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  order: number;
  userId: string;
}

interface Participant {
  id: string;
  name: string;
  image: string;
  tasks: Task[];
}

interface Race {
  id: string;
  name: string;
  description: string;
  status: string;
  endDate: string;
  duration: number;
  tasks: Task[];
  participants: Participant[];
  creatorId: string;
}

export default function RacePage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [race, setRace] = useState<Race | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventSource = new EventSource(`/api/races/${params.id}/events`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRace(data);
      setLoading(false);
    };

    eventSource.onerror = () => {
      eventSource.close();
      setLoading(false);
    };

    return () => {
      eventSource.close();
    };
  }, [params.id]);

  const handleTaskComplete = async (taskId: string) => {
    if (!session?.user) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}/complete`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to complete task");
      }
    } catch (error) {
      console.error("Failed to complete task:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!race) {
    return <div className="text-center py-12">Race not found</div>;
  }

  const getProgress = (tasks: Task[]) => {
    const completed = tasks.filter((t) => t.completed).length;
    return (completed / tasks.length) * 100;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : race ? (
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold mb-4">{race.name}</h1>
            <p className="text-gray-600 mb-4">{race.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Duration: {race.duration} days</span>
              <span>•</span>
              <span>Participants: {race.participants.length}</span>
            </div>
          </div>

          <InviteFriend raceId={params.id} />

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Tasks</h2>
            <div className="space-y-4">
              {race.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border ${
                    task.completed
                      ? "bg-green-50 border-green-200"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Task {task.order}
                  </p>
                  <p className="text-xs text-gray-600">{task.title}</p>
                  {session?.user?.id === task.userId && !task.completed && (
                    <button
                      onClick={() => handleTaskComplete(task.id)}
                      className="mt-2 w-full text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                    >
                      Complete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Participants</h2>
            <div className="space-y-4">
              {race.participants.map((participant) => (
                <div key={participant.id} className="relative">
                  <div className="flex items-center mb-2">
                    <img
                      src={participant.image}
                      alt={participant.name}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <span className="font-medium text-gray-900">
                      {participant.name}
                    </span>
                  </div>

                  {/* Track */}
                  <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-indigo-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${getProgress(participant.tasks)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  {/* Tasks */}
                  <div className="mt-4 grid grid-cols-5 gap-4">
                    {participant.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3 rounded-lg border ${
                          task.completed
                            ? "bg-green-50 border-green-200"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Task {task.order}
                        </p>
                        <p className="text-xs text-gray-600">{task.title}</p>
                        {session?.user?.id === participant.id &&
                          !task.completed && (
                            <button
                              onClick={() => handleTaskComplete(task.id)}
                              className="mt-2 w-full text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                            >
                              Complete
                            </button>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600">Race not found</div>
      )}
    </div>
  );
}
