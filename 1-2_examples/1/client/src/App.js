import React, {Component} from 'react';
import axios from 'axios';

import './App.css';

class App extends Component {
  state = {
    data : []
  }

  componentDidMount() {
    this.getDataFromDB();
  }
getDataFromDB = () => {
axios.get('http://localhost:3001/artists/{id}').then ((res) => {
  const data = res.data;
  this.setState({data});
})
}
render() {
  const {data} = this.state;
  return(
    <>
    <ul>
      {data.map((item) => 
      (<li>
        <span>id:</span> {item.id}<br/>
        <span>name:</span> {item.name}
      </li>) )}
    </ul>
    </>
  )
}
}

export default App;
