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

    it('create images', async () => {
      result = await decentragram.upload()
      let post = await decentragram.posts(1)
      console.log(post)
    })
  })
  
})