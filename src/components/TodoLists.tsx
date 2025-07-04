// import React, { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useTodoLists } from "../hooks/useTodoLists";
// import { useNavigate } from "react-router-dom";

// const TodoLists = () => {
//   const { currentUser, logout } = useAuth();
//   const { 
//     lists, 
//     loading, 
//     error, 
//     createList, 
//     updateList, 
//     deleteList 
//   } = useTodoLists(currentUser?.email ?? null);
  
//   const navigate = useNavigate();
//   const [newTitle, setNewTitle] = useState("");
//   const [editId, setEditId] = useState(null);
//   const [editTitle, setEditTitle] = useState("");

//   const handleCreate = async (e) => {
//     e.preventDefault();
//     if (!newTitle.trim() || !currentUser?.email) return;
    
//     try {
//       await createList(newTitle.trim(), currentUser.email);
//       setNewTitle("");
//     } catch (err) {
//       alert("Помилка при створенні списку: " + err.message);
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!editId || !editTitle.trim()) return;
    
//     try {
//       await updateList(editId, editTitle.trim());
//       setEditId(null);
//       setEditTitle("");
//     } catch (err) {
//       alert("Помилка при оновленні списку: " + err.message);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Ви впевнені, що хочете видалити цей список?")) return;
    
//     try {
//       await deleteList(id);
//     } catch (err) {
//       alert("Помилка при видаленні списку: " + err.message);
//     }
//   };

//   if (!currentUser) {
//     return (
//       <div className="max-w-3xl mx-auto mt-10 p-4 text-center">
//         <p>Будь ласка, увійдіть в систему</p>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="max-w-3xl mx-auto mt-10 p-4 text-center">
//         <p>Завантаження списків...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-3xl mx-auto mt-10 p-4 text-center text-red-500">
//         <p>Помилка: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-3xl mx-auto mt-10 p-4">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold">Мої списки</h1>
//           <p className="text-gray-600">Вітаю, {currentUser.displayName || currentUser.email}</p>
//         </div>
//         <button
//           onClick={logout}
//           className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
//         >
//           Вийти
//         </button>
//       </div>

//       <form onSubmit={handleCreate} className="mb-8 bg-white p-4 rounded-lg shadow">
//         <h2 className="text-xl font-semibold mb-3">Створити новий список</h2>
//         <div className="flex gap-2">
//           <input
//             type="text"
//             placeholder="Назва списку"
//             value={newTitle}
//             onChange={(e) => setNewTitle(e.target.value)}
//             className="flex-grow border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//           <button
//             type="submit"
//             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
//           >
//             Створити
//           </button>
//         </div>
//       </form>

//       <div className="space-y-4">
//         {lists.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">
//             <p>У вас ще немає списків. Створіть перший!</p>
//           </div>
//         ) : (
//           lists.map((list) => (
//             <div 
//               key={list.id} 
//               className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
//             >
//               {editId === list.id ? (
//                 <form onSubmit={handleUpdate} className="flex gap-2">
//                   <input
//                     type="text"
//                     value={editTitle}
//                     onChange={(e) => setEditTitle(e.target.value)}
//                     className="flex-grow border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                   <button
//                     type="submit"
//                     className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg cursor-pointer"
//                   >
//                     Зберегти
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setEditId(null)}
//                     className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-lg cursor-pointer"
//                   >
//                     Скасувати
//                   </button>
//                 </form>
//               ) : (
//                 <div className="flex justify-between items-center">
//                   <div 
//                     onClick={() => navigate(`/lists/${list.id}`)}
//                     className="cursor-pointer flex-grow"
//                   >
//                     <h3 className="text-xl font-semibold hover:text-blue-600 transition-colors">
//                       {list.title}
//                     </h3>
//                     {list.createdAt && (
//                       <p className="text-sm text-gray-500">
//                         Створено: {new Date(list.createdAt.toDate()).toLocaleDateString()}
//                       </p>
//                     )}
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => {
//                         setEditId(list.id);
//                         setEditTitle(list.title);
//                       }}
//                       className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg cursor-pointer"
//                     >
//                       Редагувати
//                     </button>
//                     <button
//                       onClick={() => handleDelete(list.id)}
//                       className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg cursor-pointer"
//                     >
//                       Видалити
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default TodoLists;

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTodoLists } from "../hooks/useTodoLists";
import { useNavigate } from "react-router-dom";

const TodoLists = () => {
  const { currentUser, logout } = useAuth();
  const { 
    lists, 
    loading, 
    error, 
    createList, 
    updateList, 
    deleteList,
    addCollaborator,
    removeCollaborator
  } = useTodoLists(currentUser?.email ?? null);
  
  const navigate = useNavigate();
  const [newTitle, setNewTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [collabInputs, setCollabInputs] = useState<Record<string, {email: string, role: 'admin' | 'viewer'}>>({});

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !currentUser?.email) return;
    
    try {
      await createList(newTitle.trim(), currentUser.email);
      setNewTitle("");
    } catch (err) {
      alert("Помилка при створенні списку: " + err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editId || !editTitle.trim()) return;
    
    try {
      await updateList(editId, editTitle.trim());
      setEditId(null);
      setEditTitle("");
    } catch (err) {
      alert("Помилка при оновленні списку: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Ви впевнені, що хочете видалити цей список?")) return;
    
    try {
      await deleteList(id);
    } catch (err) {
      alert("Помилка при видаленні списку: " + err.message);
    }
  };

  const handleAddCollaborator = async (listId: string) => {
    const { email, role } = collabInputs[listId] || {};
    if (!email || !role) return;
    
    try {
      await addCollaborator(listId, email, role);
      setCollabInputs(prev => ({ ...prev, [listId]: { email: '', role: 'viewer' } }));
    } catch (err) {
      alert("Помилка додавання співавтора: " + err.message);
    }
  };

  const handleRemoveCollaborator = async (listId: string, email: string) => {
    try {
      await removeCollaborator(listId, email);
    } catch (err) {
      alert("Помилка видалення співавтора: " + err.message);
    }
  };

  if (!currentUser) {
    return <div className="max-w-3xl mx-auto mt-10 p-4 text-center">Будь ласка, увійдіть в систему</div>;
  }

  if (loading) {
    return <div className="max-w-3xl mx-auto mt-10 p-4 text-center">Завантаження списків...</div>;
  }

  if (error) {
    return <div className="max-w-3xl mx-auto mt-10 p-4 text-center text-red-500">Помилка: {error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Мої списки</h1>
          <p className="text-gray-600">Вітаю, {currentUser.displayName || currentUser.email}</p>
        </div>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Вийти
        </button>
      </div>

      <form onSubmit={handleCreate} className="mb-8 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3">Створити новий список</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Назва списку"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-grow border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Створити
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {lists.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>У вас ще немає списків. Створіть перший!</p>
          </div>
        ) : (
          lists.map((list) => (
            <div key={list.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              {editId === list.id ? (
                <form onSubmit={handleUpdate} className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-grow border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg cursor-pointer"
                  >
                    Зберегти
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditId(null)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-lg cursor-pointer"
                  >
                    Скасувати
                  </button>
                </form>
              ) : (
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <div 
                      onClick={() => navigate(`/lists/${list.id}`)}
                      className="cursor-pointer flex-grow"
                    >
                      <h3 className="text-xl font-semibold hover:text-blue-600 transition-colors cursor-pointer">
                        {list.title}
                      </h3>
                      {list.createdAt && (
                        <p className="text-sm text-gray-500 cursor-pointer">
                          Створено: {new Date(list.createdAt.toDate()).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditId(list.id);
                          setEditTitle(list.title);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg cursor-pointer"
                      >
                        Редагувати
                      </button>
                      <button
                        onClick={() => handleDelete(list.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg cursor-pointer"
                      >
                        Видалити
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {list.ownerId === currentUser.email && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Керування співавторами:</h4>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="email"
                      placeholder="Email співавтора"
                      value={collabInputs[list.id]?.email || ''}
                      onChange={(e) => setCollabInputs(prev => ({
                        ...prev,
                        [list.id]: {
                          ...prev[list.id],
                          email: e.target.value
                        }
                      }))}
                      className="flex-1 p-2 border rounded"
                      autoComplete="off"
                    />
                    <select
                      value={collabInputs[list.id]?.role || 'viewer'}
                      onChange={(e) => setCollabInputs(prev => ({
                        ...prev,
                        [list.id]: {
                          ...prev[list.id],
                          role: e.target.value as 'admin' | 'viewer'
                        }
                      }))}
                      className="p-2 border rounded cursor-pointer"
                    >
                      <option value="viewer">Переглядач</option>
                      <option value="admin">Адміністратор</option>
                    </select>
                    <button
                      onClick={() => handleAddCollaborator(list.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                    >
                      Додати
                    </button>
                  </div>

                  {list.collaborators && Object.keys(list.collaborators).length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-1">Поточні співавтори:</h5>
                      <ul className="space-y-1">
                        {Object.entries(list.collaborators)
                          .filter(([email]) => email !== currentUser.email)
                          .map(([email, role]) => (
                            <li key={email} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="cursor-pointer">{email}</span>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 text-xs rounded ${
                                  role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                } cursor-pointer`}>
                                  {role === 'admin' ? 'Адміністратор' : 'Переглядач'}
                                </span>
                                <button
                                  onClick={() => handleRemoveCollaborator(list.id, email)}
                                  className="text-red-500 hover:text-red-700 text-sm cursor-pointer"
                                >
                                  Видалити
                                </button>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoLists;