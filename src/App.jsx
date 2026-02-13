import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from "./Home";
import Profile from "./Profile";  

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
