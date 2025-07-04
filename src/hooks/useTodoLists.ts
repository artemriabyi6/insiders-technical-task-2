import { useEffect, useState } from "react";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

export interface Collaborator {
  email: string;
  role: "admin" | "viewer";
}

export interface TodoList {
  id: string;
  title: string;
  ownerId: string;
  collaborators: Collaborator[];
}

export function useTodoLists(userEmail: string | null) {
  const [lists, setLists] = useState<TodoList[]>([]);

  useEffect(() => {
    if (!userEmail) {
      setLists([]);
      return;
    }
    const colRef = collection(db, "todoLists");
    const unsub = onSnapshot(colRef, (snapshot) => {
      const allLists = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as TodoList)
      );
      const filtered = allLists.filter(
        (list) =>
          list.ownerId === userEmail ||
          list.collaborators.some((c) => c.email === userEmail)
      );
      setLists(filtered);
    });
    return () => unsub();
  }, [userEmail]);

  const createList = async (title: string, ownerId: string) => {
    await addDoc(collection(db, "todoLists"), {
      title,
      ownerId,
      collaborators: [],
    });
  };

  const updateList = async (id: string, title: string) => {
    const docRef = doc(db, "todoLists", id);
    await updateDoc(docRef, { title });
  };

  const deleteList = async (id: string) => {
    const docRef = doc(db, "todoLists", id);
    await deleteDoc(docRef);
  };

  return { lists, createList, updateList, deleteList };
}
