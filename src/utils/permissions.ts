import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const checkUserPermissions = async (listId: string, userEmail: string) => {
  const listRef = doc(db, "todoLists", listId);
  const listDoc = await getDoc(listRef);
  
  if (!listDoc.exists()) {
    throw new Error("List not found");
  }

  const listData = listDoc.data();
  const isOwner = listData.ownerId === userEmail;
  const userRole = listData.collaborators?.[userEmail] || 'viewer';

  return {
    canRead: true, // Базове право для всіх авторизованих
    canEdit: userRole === 'admin' || isOwner,
    isOwner
  };
};