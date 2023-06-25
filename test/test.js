const { assert } = require('chai')

const Decentragram = artifacts.require('./Decentragram.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Decentragram', ([deployer, author, tipper]) => {
  let decentragram

  before(async () => {
    decentragram = await Decentragram.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await decentragram.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await decentragram.name()
      assert.equal(name, 'Decentragram')
    })
  })

  describe('posts', async () => {
    let result;
    const hash = "abcd1234"

    before(async () => {
      result = await decentragram.upload(hash, "post description", { from: author })
      postCount = await decentragram.postCount()
    })

    it('create posts', async () => {

      // Success
      assert.equal(postCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), postCount.toNumber(), "id is correct")
      assert.equal(event.hash, hash, "hash is correct")
      assert.equal(event.description, "post description", "description is correct")
      assert.equal(event.tipAmount, 0, "tip amount is correct")
      assert.equal(event.author, author, "author is correct")

      // Fail
      await decentragram.upload('', 'post description', { from: author }).should.be.rejected;
      await decentragram.upload(hash, '', { from: author }).should.be.rejected;
      await decentragram.upload(hash, 'post description', { from: 0x0 }).should.be.rejected;
    })

    it('list posts', async () => {
      const post = await decentragram.posts(postCount);
      assert.equal(post.id.toNumber(), postCount.toNumber(), "id is correct")
      assert.equal(post.hash, hash, "hash is correct")
      assert.equal(post.description, "post description", "description is correct")
      assert.equal(post.tipAmount, 0, "tip amount is correct")
      assert.equal(post.author, author, "author is correct")
    })

    it('allows users to tip images', async () => {
      // Track the author balance before purchase
      let oldAuthorBalance
      oldAuthorBalance = await web3.eth.getBalance(author)
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

      result = await decentragram.tipUser(postCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })

      // Success
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
      assert.equal(event.hash, hash, 'hash is correct')
      assert.equal(event.description, 'post description', 'description is correct')
      assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
      assert.equal(event.author, author, 'author is correct')

      // Check that author received funds
      let newAuthorBalance
      newAuthorBalance = await web3.eth.getBalance(author)
      newAuthorBalance = new web3.utils.BN(newAuthorBalance)

      let tipUser
      tipUser = web3.utils.toWei('1', 'Ether')
      tipUser = new web3.utils.BN(tipUser)

      const expectedBalance = oldAuthorBalance.add(tipUser)

      assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

      // Fail: Tries to tip a image that does not exist
      await decentragram.tipUser(99, { from: tipper, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
    })

  })
})