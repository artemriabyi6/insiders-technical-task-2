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

// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /todoLists/{listId} {
//       allow read: if request.auth != null && 
//                    resource.data.ownerId == request.auth.token.email;
      
//       allow create: if request.auth != null;
      
//       allow update, delete: if request.auth != null && 
//                             resource.data.ownerId == request.auth.token.email;
      
//       match /tasks/{taskId} {
//         allow read, write: if request.auth != null && 
//                            get(/databases/$(database)/documents/todoLists/$(listId)).data.ownerId == request.auth.token.email;
//       }
//     }
//   }
// }