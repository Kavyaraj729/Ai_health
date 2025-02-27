import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home/Home';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patient/*" element={
          // Will add patient dashboard later
          <div>Patient Dashboard</div>
        } />
        <Route path="/doctor/*" element={
          // Will add doctor dashboard later
          <div>Doctor Dashboard</div>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
