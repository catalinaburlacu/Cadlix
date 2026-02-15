import { useState } from 'react'
import './App.css'
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";  

function App() {
  const [page, setPage] = useState('home')

  return (
    <>
      {page === 'home' && (
        <Home onNavigateToProfile={() => setPage('profile')} />
      )}
      {page === 'profile' && (
        <Profile onBackHome={() => setPage('home')} />
      )}
    </>
  )
}

export default App
