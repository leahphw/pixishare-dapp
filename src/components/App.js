import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import Decentragram from '../abis/Decentragram.json'
import Navbar from './Navbar'
import Main from './Main'


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser. Consider trying another browser')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    console.log(accounts[0])
    this.setState( { account: accounts[0] } )

    const networkId = await web3.eth.net.getId()
    const networkData = Decentragram.networks[networkId]

    if (networkData) {
      const decentragram = web3.eth.Contract(Decentragram.abi, networkData.address)
      this.setState({ decentragram: decentragram })
      const postCount = await decentragram.methods.postCount().call()
      this.setState({ postCount })
      this.setState({ loading: false })
    } 
    else {
      window.alert("Decentragram contract not deployed to the detected network.")
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      decentragram: null,
      posts: [],
      loading: true
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        {this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
          // Code...
          />
        }

      </div>
    );
  }
}

export default App;