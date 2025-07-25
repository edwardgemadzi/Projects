import {Routes, Route, Link} from 'react-router-dom'
import './App.css'
import About from './About'

function App() {
  function Home(){
    return <h2>Home page</h2>
  }
    function NotFound(){
    return <h2>Page Not Found</h2>
  }
      function Contact(){
    return <h2>Contact Us</h2>
  }
      function Careers(){
    return <h2>Available Roles</h2>
  }

  return (
    <div className='container'>
      <nav>
        <Link to="/" style={{color:'white'}}>Home</Link>
        <Link to="/about" style={{color:'white'}}>About</Link>
        <Link to="/contact-us" style={{color:'white'}}>Contact Us</Link>
        <Link to="/careers" style={{color:'white'}}>Careers</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
