import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DisplayView from './DisplayView'
import AdminView from './AdminView'
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DisplayView />} />
        <Route path="/admin" element={<AdminView />} />
      </Routes>
    </Router>
  )
}

export default App
