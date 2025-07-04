import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../hooks/useTasks";
import { useTodoLists } from "../hooks/useTodoLists";

const Tasks: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const { tasks, addTask, updateTask, deleteTask } = useTasks(listId ?? null);
  const { lists } = useTodoLists(currentUser?.email ?? null);

  const list = lists.find((l) => l.id === listId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!list || !currentUser) return <p className="p-4">Loading...</p>;

  const isOwner = list.ownerId === currentUser.email;
  const collaborator = list.collaborators.find((c) => c.email === currentUser.email);
  const role = isOwner ? "admin" : collaborator?.role ?? "viewer";

  const canEdit = role === "admin";
  const canToggle = role === "admin" || role === "viewer";

  const handleAdd = async () => {
    if (!title.trim()) return;
    await addTask(list.id, title.trim(), description.trim());
    setTitle("");
    setDescription("");
  };

  const handleToggle = async (id: string, completed: boolean) => {
    await updateTask(id, { completed: !completed });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <div className="mb-6 flex justify-between">
        <h2 className="text-2xl font-bold">{list.title}</h2>
        <button onClick={() => navigate("/dashboard")} className="text-blue-600 underline">
          Back
        </button>
      </div>

      {canEdit && (
        <div className="flex flex-col gap-2 mb-6">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded"
          />
          <textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={handleAdd}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Add Task
          </button>
        </div>
      )}

      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <h3
                className={`text-lg font-semibold ${
                  task.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {task.title}
              </h3>
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
            <div className="flex gap-2 items-center">
              {canToggle && (
                <button
                  onClick={() => handleToggle(task.id, task.completed)}
                  className="text-sm text-blue-600 underline"
                >
                  {task.completed ? "Uncomplete" : "Complete"}
                </button>
              )}
              {canEdit && (
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
