pragma solidity ^0.5.0;

contract Decentragram {
  string public name = "Decentragram";

  // Store posts
  struct Post {
    uint id;
    string hash;
    string description;
    uint tipAmount;
    address payable author;
  }

  event PostUploaded(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );

  event PostTipped(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );

  mapping(uint => Post) public posts;
  uint public postCount = 0;

  // Create posts
  function upload(string memory _postHash, string memory _description) public {
    // Set requirements
    require(bytes(_description).length > 0);
    require(bytes(_postHash).length > 0);
    require(msg.sender != address(0x0));

    // Increment count
    postCount++;
    posts[postCount] = Post(postCount, _postHash, _description, 0, msg.sender);

    // Trigger an event
    emit PostUploaded(postCount, _postHash, _description, 0, msg.sender);
  }

  // Tip posts
  function tipUser(uint _id) public payable {
    // Ser requirements
    require(_id > 0 && _id <= postCount);

    // Fetch post and author
    Post memory _post = posts[_id];
    address payable _author = _post.author;

    // Send ETH to author
    address(_author).transfer(msg.value);

    // Update tip amount
    _post.tipAmount = msg.value + _post.tipAmount;

    // Update post
    posts[_id] = _post;

    // Trigger an event
    emit PostTipped(_id, _post.hash, _post.description, _post.tipAmount, _author);
  }
}