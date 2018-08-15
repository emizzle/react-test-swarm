import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import swarmgw from 'swarmgw';
import expect from 'expect'

class App extends Component {
  constructor(props, context) {
    super(props);
    this.swarm = swarmgw();
    this.state = {
      isLocal: false,
      errors:[],
      infos:[]
    };
  }

  appendError(error){
    let errors = this.state.errors;
    errors.push(<div>[{this.state.isLocal ? 'http://localhost:8500' : 'https://swarm-gateways.net'}]: {error}</div>);
    this.setState({ errors: errors });
  }
  appendInfo(info){
    let infos = this.state.infos;
    infos.push(<div>[{this.state.isLocal ? 'http://localhost:8500' : 'https://swarm-gateways.net'}]: {info}</div>);
    this.setState({ infos: infos });
  }

  handleClick(e) {
    let hash;
    const storedData = 'Hello from swarmgw!';
    // This should output the hash: 931cc5a6bd57724ffd1adefc0ea6b4f0235497fca9e4f9ae4029476bcb51a8c6
    this.swarm.put(storedData, (err, ret) => {
      if (err) {
        expect(err).toNotExist('Error during swarm upload');
        this.appendError('Failed to upload: ' + err);
      } else {
        expect(ret).toEqual('36538034544401c810ec7535d8e789df5d6cd9bfe80b30207ab22b99c0932a03');
        this.appendInfo('Swarm hash: ' + ret);
        hash = ret;

        // This should output the content: Hello from swarmgw!
        this.swarm.get('bzz-raw://' + hash, (err, ret) => {
          if (err) {
            expect(err).toNotExist('Error during swarm upload');
            this.appendError('Failed to download: ' + err);
          } else {
            expect(ret).toEqual(storedData);
            this.appendInfo('Downloaded: ' + ret);
          }
        })
      }
    });

    

  }

  toggleNode(e){
    const isLocal = !Boolean(this.state.isLocal);
    this.swarm = swarmgw(isLocal ? 'http://localhost:8500' : 'https://swarm-gateways.net');
    this.setState({ isLocal: isLocal });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          Using swarm node {this.state.isLocal ? 'http://localhost:8500' : 'https://swarm-gateways.net'}
        </p>
        <button onClick={(e) => this.toggleNode(e)}>Use {this.state.isLocal ? 'https://swarm-gateways.net' : 'http://localhost:8500'} instead</button>
        <button onClick={(e) => this.handleClick(e)}>Test swarm</button>
        <div className="errors">{this.state.errors}</div>
        <div className="infos">{this.state.infos}</div>
      </div>
    );
  }
}

export default App;
