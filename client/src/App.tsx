import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import HomePage from "./Pages/HomePage";

function App() {
  return (
    <body>
      <div className="width-full">
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />}/>
          </Routes>
        </Router>
      </div>
    </body>
  );
}

export default App;
