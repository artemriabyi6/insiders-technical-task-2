import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { checkUserPermissions } from "../utils/permissions";

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: any;
  updatedAt?: any;
}

export function useTasks(todoListId: string | null, currentUserEmail?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Підписка на зміни завдань
  useEffect(() => {
    if (!todoListId || !currentUserEmail) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const tasksRef = collection(db, "todoLists", todoListId, "tasks");
    const q = query(tasksRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        try {
          // Додаткова перевірка прав на читання
          const { canRead } = await checkUserPermissions(todoListId, currentUserEmail);
          if (!canRead) {
            throw new Error("You don't have read permissions");
          }

          const tasksData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Task[];
          setTasks(tasksData);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Permission denied");
          setTasks([]);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [todoListId, currentUserEmail]);

  // Додавання завдання з перевіркою прав
  const addTask = async (title: string, description: string) => {
    if (!todoListId || !currentUserEmail) throw new Error("Missing required data");

    try {
      const { canEdit } = await checkUserPermissions(todoListId, currentUserEmail);
      if (!canEdit) throw new Error("You don't have permission to add tasks");

      const tasksRef = collection(db, "todoLists", todoListId, "tasks");
      await addDoc(tasksRef, {
        title,
        description,
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to add task:", err);
      throw err;
    }
  };

  // Оновлення завдання з перевіркою прав
  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!todoListId || !currentUserEmail) throw new Error("Missing required data");

    try {
      const { canEdit } = await checkUserPermissions(todoListId, currentUserEmail);
      if (!canEdit) throw new Error("You don't have permission to edit tasks");

      const taskRef = doc(db, "todoLists", todoListId, "tasks", taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to update task:", err);
      throw err;
    }
  };

  // Видалення завдання з перевіркою прав
  const deleteTask = async (taskId: string) => {
    if (!todoListId || !currentUserEmail) throw new Error("Missing required data");

    try {
      const { canEdit } = await checkUserPermissions(todoListId, currentUserEmail);
      if (!canEdit) throw new Error("You don't have permission to delete tasks");

      const taskRef = doc(db, "todoLists", todoListId, "tasks", taskId);
      await deleteDoc(taskRef);
    } catch (err) {
      console.error("Failed to delete task:", err);
      throw err;
    }
  };

  // Перемикання статусу завдання
  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    return updateTask(taskId, { completed: !completed });
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  };
}