import { Route, Routes } from 'react-router'
import Home from './Views/Home'

export default function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />}/>
      </Routes>
    </>
  )
}

