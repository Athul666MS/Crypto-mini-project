import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './index.css'
import React from 'react'
import Home from './pages/Home'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  )
}
