import React from 'react'
import { Router, Routes, Route } from 'react-router-dom'
import MenuPelanggan from './pages/MenuPelanggan/MenuPelanggan'
import KeranjangPelanggan from './pages/KeranjangPelanggan/KeranjangPelanggan'
import ConfirmOrderPelanggan from './pages/ConfirmOrderPelanggan/ConfirmOrderPelanggan'
import PaymentPelanggan from './pages/PaymentPelanggan/PaymentPelanggan'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<MenuPelanggan/>}/>

      <Route path='/admin' element={<MenuPelanggan/>}/>

      <Route path='/keranjang-pelanggan' element={<KeranjangPelanggan/>}/>

      <Route path='/confirm-order-pelanggan' element={<ConfirmOrderPelanggan/>}/>

      <Route path='/payment-pelanggan' element={<PaymentPelanggan/>}/>

      <Route path='/cmsadmin' element={<MenuPelanggan/>}/>
    </Routes>
  )
}

export default App