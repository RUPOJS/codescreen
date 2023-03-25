import React, { Component } from 'react';
import './style.css';
import Films from '../Films';

class App extends Component {
  render() {
    return (
      <div className="films-analysis-container">
        <p className="films-analysis-service">Films Analysis Service </p>
        <Films />
      </div>
    );
  }
}

export default App;