import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gray-100">
            <Navbar/>
          </div>
        } />
       
      </Routes>
    </Router>
  )
}

export default App
