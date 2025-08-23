import React from 'react'
import { Router, Routes, Route } from 'react-router-dom'
import MenuPelanggan from './pages/MenuPelanggan/MenuPelanggan'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<MenuPelanggan/>}/>

      <Route path='/admin' element={<MenuPelanggan/>}/>

      <Route path='/cmsadmin' element={<MenuPelanggan/>}/>
    </Routes>
  )
}

export default App