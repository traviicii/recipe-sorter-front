import { Route, Routes } from 'react-router'
import Home from './Views/Home'
import NewHome from './Views/NewHome'

export default function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/testing' element={<NewHome />}/>
      </Routes>
    </>
  )
}

