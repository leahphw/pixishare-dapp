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

  mapping(uint => Post) public posts;

  // Create posts
  function upload() public {
    posts[1] = Post(1, "abc", "hello", 0, address(0x0));
  }

  // Tip posts
}