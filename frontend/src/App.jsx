
import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import SendMoney from './pages/SendMoney'
import SignIn from './pages/SignIn'
function App() {

  return (
    <>
    
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/send" element={<SendMoney />} />
      
    </Routes>
    </BrowserRouter>

    
    </>
  )
}

export default App
