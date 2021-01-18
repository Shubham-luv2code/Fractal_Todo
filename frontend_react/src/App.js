import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import CreateTodoList from "./ToDoComponents/CreateTodoList";
import ViewTodoList from "./ToDoComponents/ViewTodoList";


function App() {
  const [todoItems, setTodoItems] = useState([]);
    const getItem = () => {
        fetch('http://localhost:4000/api/getTodo/', {
            method: 'get',
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            setTodoItems(data)
        });
    };
    useEffect(() => {
        getItem()
    }, [])
  
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/" className="navbar-brand">MERN-Stack Todo App</Link>
            <div className="collpase navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/create" className="nav-link">Create Todo</Link>
                </li>
              </ul>
            </div>
          </nav>
          <br/>
          
          <Route path="/" exact render={(props) => <ViewTodoList todoItems={todoItems} getItem={getItem}/>}/>
          <Route path="/create" render={(props) => <CreateTodoList todoItems={todoItems} />}/>
          <Route path="/edit/:id" render={(props) => <CreateTodoList todoItems={todoItems} />}/>
        </div>
      </Router>
    );
  }

export default App;
