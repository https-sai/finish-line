// components/TaskList.tsx
"use client";
import { useState } from "react";

type TaskListProps = {
  onSubmit: (tasks: string[]) => void;
  initialTasks?: string[];
};

export default function TaskList({
  onSubmit,
  initialTasks = [],
}: TaskListProps) {
  const [tasks, setTasks] = useState<string[]>(initialTasks);
  const [input, setInput] = useState("");

  const addTask = () => {
    if (input.trim() && tasks.length < 10) {
      setTasks([...tasks, input.trim()]);
      setInput("");
    }
  };

  const removeTask = (index: number) => {
    const updated = [...tasks];
    updated.splice(index, 1);
    setTasks(updated);
  };

  return (
    <div className="p-4 bg-gray-100 rounded max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-2">
        Your Tasks ({tasks.length}/10)
      </h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={addTask}
          className="bg-green-500 text-white px-4 py-1 rounded"
        >
          Add
        </button>
      </div>
      <ul className="mb-4">
        {tasks.map((task, idx) => (
          <li
            key={idx}
            className="flex justify-between bg-white p-2 mb-2 rounded"
          >
            <span>{task}</span>
            <button className="text-red-500" onClick={() => removeTask(idx)}>
              ✕
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => onSubmit(tasks)}
        disabled={tasks.length === 0}
        className="bg-blue-600 text-white w-full p-2 rounded disabled:opacity-50"
      >
        Submit Tasks
      </button>
    </div>
  );
}
