import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../hooks/useTasks";
import { useTodoLists } from "../hooks/useTodoLists";
import { checkUserPermissions } from "../utils/permissions";

const Tasks: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  } = useTasks(listId || null, currentUser?.email || null);
  
  const { lists, loading: listsLoading } = useTodoLists(currentUser?.email || null);
  const [currentPermissions, setCurrentPermissions] = useState({
    canEdit: false,
    isOwner: false
  });

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "active">("all");
  const [uiState, setUiState] = useState<"view" | "edit" | "add">("view");

  // Завантаження прав при зміні списку або користувача
  useEffect(() => {
    const loadPermissions = async () => {
      if (listId && currentUser?.email) {
        try {
          const permissions = await checkUserPermissions(listId, currentUser.email);
          setCurrentPermissions({
            canEdit: permissions.canEdit,
            isOwner: permissions.isOwner
          });
        } catch (error) {
          console.error("Failed to load permissions:", error);
        }
      }
    };

    loadPermissions();
  }, [listId, currentUser?.email]);

  if (!listId || !currentUser) return <div className="p-4">Loading...</div>;

  const list = lists.find((l) => l.id === listId);
  if (!list) return <div className="p-4">List not found</div>;

  // Фільтрація завдань
  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  });

  // Обробник додавання завдання
  const handleAddTask = async () => {
    try {
      await addTask(newTaskTitle, newTaskDescription);
      setNewTaskTitle("");
      setNewTaskDescription("");
      setUiState("view");
    } catch (error) {
      alert(`Failed to add task: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  // Обробник збереження редагування
  const handleSaveEdit = async () => {
    try {
      await updateTask(editingTaskId!, {
        title: editTitle,
        description: editDescription
      });
      setEditingTaskId(null);
    } catch (error) {
      alert(`Failed to update task: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  // Обробник видалення завдання
  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        alert(`Failed to delete task: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }
  };

  // Обробник перемикання статусу
  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      await toggleTaskCompletion(taskId, completed);
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{list.title}</h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 hover:text-blue-800 cursor-pointer" 
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Фільтрація завдань */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded cursor-pointer ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-3 py-1 rounded cursor-pointer ${filter === "active" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1 rounded cursor-pointer ${filter === "completed" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Completed
        </button>
      </div>

      {/* Форма додавання завдання */}
      {currentPermissions.canEdit && uiState === "add" && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium mb-2">Add New Task</h3>
          <input
            type="text"
            placeholder="Task title*"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <textarea
            placeholder="Task description (optional)"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddTask}
              disabled={!newTaskTitle.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 cursor-pointer"
            >
              Add Task
            </button>
            <button
              onClick={() => setUiState("view")}
              className="px-4 py-2 border rounded cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Список завдань */}
      <div className="space-y-3">
        {tasksLoading ? (
          <p className="text-center py-4">Loading tasks...</p>
        ) : tasksError ? (
          <p className="text-red-500 text-center py-4">{tasksError}</p>
        ) : filteredTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No tasks found</p>
        ) : (
          filteredTasks.map((task) => (
            <div 
              key={task.id} 
              className={`border rounded-lg p-4 ${task.completed ? "bg-gray-50" : "bg-white"}`}
            >
              {editingTaskId === task.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2 border rounded font-medium"
                    placeholder="Task title*"
                    required
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Task description (optional)"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      disabled={!editTitle.trim()}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTaskId(null)}
                      className="px-3 py-1 border rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task.id, task.completed)}
                      className="mt-1 cursor-pointer"
                      disabled={!currentPermissions.canEdit}
                    />
                    <div className="flex-1">
                      <h3 
                        className={`font-semibold ${task.completed ? "line-through text-gray-500" : ""}`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-gray-600 mt-1 whitespace-pre-wrap">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    {currentPermissions.canEdit && (
                      <>
                        <button
                          onClick={() => {
                            setEditTitle(task.title);
                            setEditDescription(task.description);
                            setEditingTaskId(task.id);
                          }}
                          className="text-sm text-yellow-600 hover:text-yellow-800 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-sm text-red-600 hover:text-red-800 cursor-pointer"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Кнопка додавання (показується тільки для тих, хто може редагувати) */}
      {currentPermissions.canEdit && uiState === "view" && (
        <button
          onClick={() => setUiState("add")}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
        >
          + Add New Task
        </button>
      )}
    </div>
  );
};

export default Tasks;