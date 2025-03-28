import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import UserList from './Components/Userlist';
import LoginPage from './Components/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/users" element={<UserList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
