import React, { useState } from "react";
import './App.css';
import { Login } from "./frontend/Login";
import { Register } from "./frontend/Register";
import { Dashboard } from "./frontend/Dashboard";
import { EmployeesDashboard } from "./frontend/EmployeesDashboard";

function App() {
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  return (
    <div className="App">
      {
        currentForm === 'login' ? <Login onFormSwitch={toggleForm} /> :
        currentForm === 'register' ? <Register onFormSwitch={toggleForm} /> :
        currentForm === 'employeesDashboard' ? <EmployeesDashboard onFormSwitch={toggleForm} /> :
        <Dashboard onFormSwitch={toggleForm} />
      }
    </div>
  );
}

export default App;
