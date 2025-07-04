import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTodoLists } from "../hooks/useTodoLists";
import { useNavigate } from "react-router-dom";

const TodoLists: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { lists, createList, updateList, deleteList } = useTodoLists(
    currentUser?.email ?? null
  );
  const navigate = useNavigate();

  const [newTitle, setNewTitle] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  if (!currentUser) return null;

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    await createList(newTitle.trim(), currentUser.email!);
    setNewTitle("");
  };

  const handleUpdate = async () => {
    if (editId && editTitle.trim()) {
      await updateList(editId, editTitle.trim());
      setEditId(null);
      setEditTitle("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hello, {currentUser.displayName}</h1>
        <button
          onClick={() => logout()}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="New list title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-grow border p-2 rounded"
        />
        <button
          onClick={handleCreate}
          className="bg-green-600 hover:bg-green-700 text-white px-4 rounded"
        >
          Create
        </button>
      </div>

      <ul>
        {lists.map((list) => (
          <li
            key={list.id}
            className="mb-3 p-3 border rounded flex justify-between items-center"
          >
            {editId === list.id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="border p-1 rounded flex-grow mr-2"
                />
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditId(null)}
                  className="bg-gray-400 text-white px-3 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span
                  onClick={() => navigate(`/lists/${list.id}`)}
                  className="cursor-pointer text-lg font-semibold"
                >
                  {list.title}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditId(list.id);
                      setEditTitle(list.title);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteList(list.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 rounded"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoLists;
