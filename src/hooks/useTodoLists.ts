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
  QuerySnapshot,
} from "firebase/firestore";
import type  {DocumentData} from "firebase/firestore";
import { db } from "../firebase";

export interface TodoList {
  id: string;
  title: string;
  ownerId: string;
  collaborators: { email: string; role: string }[];
}

export function useTodoLists(userEmail: string | null) {
  const [lists, setLists] = useState<TodoList[]>([]);

  useEffect(() => {
    if (!userEmail) {
      setLists([]);
      return;
    }

    const listsRef = collection(db, "todoLists");

    const qOwner = query(listsRef, where("ownerId", "==", userEmail));
    const qCollaborator = query(
      listsRef,
      where("collaborators", "array-contains", { email: userEmail })
    );

    const handleSnapshot = (snapshot: QuerySnapshot<DocumentData>) => {
      const data = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as TodoList)
      );

      setLists((prev) => {
        const combined = [...prev, ...data];
        const unique = combined.filter(
          (list, index, self) => self.findIndex((l) => l.id === list.id) === index
        );
        return unique;
      });
    };

    const unsub1 = onSnapshot(qOwner, handleSnapshot);
    const unsub2 = onSnapshot(qCollaborator, handleSnapshot);

    return () => {
      unsub1();
      unsub2();
    };
  }, [userEmail]);

  async function createList(title: string, ownerId: string) {
    await addDoc(collection(db, "todoLists"), {
      title,
      ownerId,
      collaborators: [],
    });
  }

  async function updateList(id: string, title: string) {
    const ref = doc(db, "todoLists", id);
    await updateDoc(ref, { title });
  }

  async function deleteList(id: string) {
    const ref = doc(db, "todoLists", id);
    await deleteDoc(ref);
  }

  return { lists, createList, updateList, deleteList };
}
