import { useState } from 'react'
import './App.css'
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile"; 
import Login from "./pages/login/Login";  


function App() {
  const [page, setPage] = useState('login')

  return (
    <>
    {page === 'home' && (
        <Home onNavigateToProfile={() => setPage('profile')} />
      )}
      {page === 'login' && (
        <Login />
      )}
      {page === 'profile' && (
        <Profile onBackHome={() => setPage('home')} />
      )}
    </>
  )
}

export default App
