import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import TodoLists from "./components/TodoLists";
import Tasks from "./components/Tasks";
import { useAuth } from "./context/AuthContext";

function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={currentUser ? <TodoLists /> : <Navigate to="/login" />}
        />
        <Route
          path="/lists/:listId"
          element={currentUser ? <Tasks /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;

