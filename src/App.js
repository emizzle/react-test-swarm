import React, { Component } from 'react';
import logo from './logo.svg';
import './css/App.css';
import _SwarmJS from 'swarmjs';
import expect from 'expect';
import { ToggleButtonGroup, ToggleButton, ButtonToolbar, ButtonGroup, Button, ListGroup, ListGroupItem, PageHeader } from 'react-bootstrap';

class App extends Component {
  constructor(props, context) {
    super(props);
    this.swarm = new _SwarmJS();
    this.state = {
      gateway: 'https://swarm-gateways.net',
      errors: [],
      infos: []
    };
  }

  appendError(error) {
    let errors = this.state.errors;
    errors.push(<div key={`errors_${errors.length}`}>[{this.state.gateway}]: {error}</div>);
    this.setState({ errors: errors });
  }
  appendInfo(info) {
    let infos = this.state.infos;
    infos.push(<div key={`infos_${infos.length}`}>[{this.state.gateway}]: {info}</div>);
    this.setState({ infos: infos });
  }

  handleUpDownClick(e) {
    const storedData = 'Hello from swarmgw!';

    this.appendInfo('Testing upload/download...');
    this.swarm.uploadRaw(storedData, (err, hash) => {
      if (err) {
        this.appendError('Failed to upload: ' + JSON.stringify(err));
      }
      if (hash) {
        expect(hash).toEqual('36538034544401c810ec7535d8e789df5d6cd9bfe80b30207ab22b99c0932a03');
        this.appendInfo('Swarm hash: ' + hash);

        // This should output the content: Hello from swarmgw!
        this.swarm.downloadRaw(hash, (err, result) => {
          if (err) {
            expect(err).toNotExist('Error during swarm upload');
            this.appendError('Failed to download: ' + err);
          } else {
            expect(result).toEqual(storedData);
            this.appendInfo('Downloaded: ' + result);
          }
        })
      }
    });
  }

  handleIsAvailClick(e) {
    this.appendInfo('Testing if swarm is available...');
    this.swarm.isAvailable((err, isAvailable) => {
      if(err){
        this.appendError('Error on isAvailable: ' + err);
      }
      else{
        expect(isAvailable).toEqual(true);
        this.appendInfo('Swarm is available');
      }
    });
  }

  toggleNode(e) {
    //const isLocal = !Boolean(this.state.isLocal);
    //this.swarm.gateway = (isLocal ? 'http://localhost:8500' : 'https://swarm-gateways.net');
    this.swarm.gateway = e;
    this.setState({ gateway: e });
  }

  handleUpload(e) {
    this.swarm.putDirectory(__dirname, (err, hash) => {
      if(err){
        this.appendError('Error on isAvailable: ' + err);
      }
      else{
        expect(hash).toExist('hash returned from swarm is null!')
        this.appendInfo('Directory uploaded to ' + hash);
      }
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
          <ButtonToolbar>
            <ToggleButtonGroup
              type="radio"
              name="gateway"
              onChange={(e) => this.toggleNode(e)}
              value={this.state.gateway}
            >
              <ToggleButton key="0" value="https://swarm-gateways.net">https://swarm-gateways.net</ToggleButton>
              <ToggleButton key="1" value="http://localhost:8500">http://localhost:8500</ToggleButton>
            </ToggleButtonGroup>
          </ButtonToolbar>
        </header>
        <div className="container">
          <PageHeader>
            Test Suite <small>Using {this.state.gateway}</small>
          </PageHeader>
          <ButtonGroup>
            <Button onClick={(e) => this.handleIsAvailClick(e)}>isAvailable</Button>
            <Button onClick={(e) => this.handleUpDownClick(e)}>upload/download</Button>
            <Button onClick={(e) => this.handleUpload(e)} disabled>directory upload (doesn't work in the browser)</Button>
          </ButtonGroup>
          <ListGroup className="errors">
            {this.state.errors.map((error, idx) => {
              return <ListGroupItem key={idx}>{error}</ListGroupItem>;
            })}
          </ListGroup>
          <ListGroup className="infos">
            {this.state.infos.map((info, idx) => {
              return <ListGroupItem key={idx}>{info}</ListGroupItem>;
            })}
          </ListGroup>
        </div>
      </div>
    );
  }
}

export default App;
