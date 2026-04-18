import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './index.css'
import React from 'react'
import Home from './pages/Home'
import CoinDeatil from './pages/CoinDeatil'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/coin/:id' element={<CoinDeatil/>}/>
      </Routes>
    </BrowserRouter>
  )
}
