import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

export interface TodoList {
  id: string;
  title: string;
  ownerId: string;
  collaborators: { email: string; role: 'admin' | 'viewer' }[];
  createdAt?: any;
  updatedAt?: any;
}

export function useTodoLists(userEmail: string | null) {
  const [lists, setLists] = useState<TodoList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userEmail) {
      setLists([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const listsRef = collection(db, "todoLists");
    const q = query(
      listsRef,
      where("ownerId", "==", userEmail)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const listsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as TodoList[];
        
        // Сортування на клієнті за датою створення (новіші перші)
        const sortedLists = [...listsData].sort((a, b) => {
          const dateA = a.createdAt?.toDate()?.getTime() || 0;
          const dateB = b.createdAt?.toDate()?.getTime() || 0;
          return dateB - dateA;
        });

        setLists(sortedLists);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError("Помилка завантаження: " + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userEmail]);

  const createList = async (title: string, ownerEmail: string) => {
    try {
      const newList = {
        title,
        ownerId: ownerEmail,
        collaborators: [],
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "todoLists"), newList);
    } catch (err) {
      console.error("Помилка створення списку:", err);
      throw err;
    }
  };

  const updateList = async (id: string, title: string) => {
    try {
      const ref = doc(db, "todoLists", id);
      await updateDoc(ref, {
        title,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Помилка оновлення списку:", err);
      throw err;
    }
  };

  const deleteList = async (id: string) => {
    try {
      const ref = doc(db, "todoLists", id);
      // Оптимістичне оновлення
      setLists(prev => prev.filter(list => list.id !== id));
      await deleteDoc(ref);
    } catch (err) {
      // Відкат у разі помилки
      setLists(prev => [...prev, prev.find(list => list.id === id)!]);
      console.error("Помилка видалення списку:", err);
      throw err;
    }
  };

  return {
    lists,
    loading,
    error,
    createList,
    updateList,
    deleteList,
  };
}