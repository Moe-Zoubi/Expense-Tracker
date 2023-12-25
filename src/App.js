import './App.css';
import { useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Authorication } from './pages/login/index.jsx';
import Dashboard from './pages/dashboard/index.jsx';
import Transactions from './pages/transactions/index.jsx';
import Budgets from './pages/budgets/index.jsx';
import History from './pages/history/index.jsx';
import Sidebar from './components/Sidebar.jsx';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Authorication />}
          />
            <Route
              path="/*"
              element={
                <Sidebar>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="budgets" element={<Budgets />} />
                    <Route path="history" element={<History />} />
                  </Routes>
                </Sidebar>
              }
            />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;