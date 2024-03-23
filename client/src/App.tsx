import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { NavbarProvider } from './Context/NavbarContext';
import AnalyticsPage from './Pages/AnalyticsPage';
import DataPage from './Pages/DataPage';
import HomePage from "./Pages/HomePage";

function App() {
  return (
    <body>
      <div className="width-full">
        <NavbarProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />}/>
            <Route path="/analytics" element={<AnalyticsPage />}/>
            <Route path="/data" element={<DataPage />}/>
          </Routes>
        </Router>
        </NavbarProvider>
      </div>
    </body>
  );
}

export default App;
