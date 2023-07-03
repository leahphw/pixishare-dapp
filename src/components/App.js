import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import Decentragram from '../abis/Decentragram.json'
import Navbar from './Navbar'
import Main from './Main'

// Declare IPFS
const ipfsClient = require('ipfs-http-client');
const projectId = "2S3D7FiQmglBjTsNV6MsQfxnTzo";
const projectSecret = "5c42db573664918910202560ae3cc741";
const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const ipfs = ipfsClient.create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

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
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = Decentragram.networks[networkId]

    if (networkData) {
      const decentragram = web3.eth.Contract(Decentragram.abi, networkData.address)
      this.setState({ decentragram: decentragram })
      const postCount = await decentragram.methods.postCount.call()
      this.setState({ postCount })

      // Load images
      for (var i = 1; i <= postCount; i++) {
        const post = await decentragram.methods.posts(i).call()
        this.setState({
          posts: [...this.state.posts, post]
        })
      }
      
      // Sort posts. Show highest tipped images first
      this.setState({
        posts: this.state.posts.sort((a,b) => b.tipAmount - a.tipAmount )
      })
      this.setState({ loading: false })
    }
    else {
      window.alert("Decentragram contract not deployed to the detected network.")
    }
  }

  captureFile = event => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

upload = async (description) => {
  console.log("sending files to IPFS...");

  try {
    const result = await ipfs.add(this.state.buffer);
    console.log("IPFS result:", result);

    this.setState({ loading: true });

    await this.state.decentragram.methods
      .upload(result.path, description)
      .send({ from: this.state.account })
      .on('transactionHash', (hash) => {
        console.log("Upload transaction hash:", hash);
        this.setState({ loading: false });
      });
  } catch (error) {
    console.error("IPFS upload error:", error);
  }
};
  
   tipUser(id, tipAmount) {
    this.setState({ loading: true })
    this.state.decentragram.methods.tipUser(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
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
            posts={this.state.posts}
            captureFile={this.captureFile}
            upload={this.upload}
            tipUser={this.tipUser}
          />
        }
      </div>
    );
  }
}

export default App;