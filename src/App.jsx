import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import DisplayView from './DisplayView'
import AdminView from './AdminView'
import MessagesView from './MessagesView'
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DisplayView />} />
        <Route path="/admin" element={<AdminView />} />
        <Route path="/messages" element={<MessagesView />} />
      </Routes>
    </Router>
  )
}

export default App
