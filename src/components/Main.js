import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Main extends Component {

  renderUpload() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="upload-container">
            <main role="main" className="upload-content">
              <h2>Share Image</h2>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const description = this.postDescription.value;
                  this.props.upload(description);
                }}
              >
                {/* Input fields for uploading an image */}
                <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
                <div className="form-group mr-sm-2">
                  <br></br>
                  <input
                    id="imageDescription"
                    type="text"
                    ref={(input) => { this.postDescription = input }}
                    className="form-control"
                    placeholder="Post description..."
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">Upload!</button>
              </form>
            </main>
          </div>
          <div className="feed-container">
            <main role="main" className="feed-content">
              {/* Render the posts */}
              {this.renderPosts()}
            </main>
          </div>
        </div>
      </div>
    );
  }


  renderPosts = () => {
    return this.props.posts.map((post, key) => (
      <div className="card mb-4" key={key}>
        <div className="card-header">
          <img
            className="mr-2"
            width="30"
            height="30"
            src={`data:image/png;base64,${new Identicon(post.author, 30).toString()}`}
          />
          <small className="text-muted">{post.author}</small>
        </div>
        <ul id="imageList" className="list-group list-group-flush">
          <li className="list-group-item">
            <p className="text-center">
              <img
                src={`https://ipfs.io/ipfs/${post.hash}`}
                alt="Post Image"
                style={{ maxWidth: '420px' }}
              />
            </p>
            <p>{post.description}</p>
          </li>
          <li key={key} className="list-group-item py-2">
            <small className="float-left mt-1 text-muted">
              TIPS: {window.web3.utils.fromWei(post.tipAmount.toString(), 'Ether')} ETH
            </small>
            <button
              className="btn btn-link btn-sm float-right pt-0"
              name={post.id}
              onClick={(event) => {
                let tipAmount = window.web3.utils.toWei('0.1', 'Ether');
                console.log(event.target.name, tipAmount);
                this.props.tipUser(event.target.name, tipAmount);
              }}
            >
              TIP 0.1 ETH
            </button>
          </li>
        </ul>
      </div>
    ));
  };

  render() {
    return <div>{this.renderUpload()}</div>;
  }
}

export default Main;