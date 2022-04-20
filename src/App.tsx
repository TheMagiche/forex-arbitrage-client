import AppNavbar from './components/common/Navbar'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Home from 'views/Home'
import NotFound from 'views/NotFound'

function App() {
  return (
    <div className="App">
      <AppNavbar />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
