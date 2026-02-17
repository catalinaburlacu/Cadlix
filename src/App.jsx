import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Home from "./ui/pages/home/Home";
import Profile from "./ui/pages/profile/Profile"; 
import Login from "./ui/pages/login/Login";  
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App
