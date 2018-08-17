import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from "./components/Header";
import Match from "./components/Match";

class App extends Component {
  render() {
    return (
      <div className="App">
          <Header/>
          <Match/>
      </div>
    );
  }
}

export default App;
