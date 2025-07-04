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
} from "firebase/firestore";
import { db } from "../firebase";

export interface Task {
  id: string;
  todoListId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: any;
}

export function useTasks(todoListId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!todoListId) {
      setTasks([]);
      return;
    }
    const tasksRef = collection(db, "tasks");
    const q = query(
      tasksRef,
      where("todoListId", "==", todoListId),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Task)
      );
      setTasks(data);
    });
    return () => unsubscribe();
  }, [todoListId]);

  const addTask = async (
    todoListId: string,
    title: string,
    description: string
  ) => {
    await addDoc(collection(db, "tasks"), {
      todoListId,
      title,
      description,
      completed: false,
      createdAt: new Date(),
    });
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    const docRef = doc(db, "tasks", id);
    await updateDoc(docRef, data);
  };

  const deleteTask = async (id: string) => {
    const docRef = doc(db, "tasks", id);
    await deleteDoc(docRef);
  };

  return { tasks, addTask, updateTask, deleteTask };
}
