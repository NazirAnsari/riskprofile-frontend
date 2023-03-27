import React from 'react'
import Accodion from './Components/index'
import { BrowserRouter } from 'react-router-dom'
import { Route,Routes } from 'react-router-dom'

export default function App() {

  return (
    <div>
      
<BrowserRouter>
<Routes>
  <Route path='/' element={<Accodion/>}></Route>
</Routes>
</BrowserRouter>
    </div>
  )
}
