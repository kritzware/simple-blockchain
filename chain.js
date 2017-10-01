const moment = require('moment')
const { createHash } = require('crypto')

const Blockchain = class {

  constructor() {
    this.chain = []
    this.current_transactions = []
    
    /* Create the genesis block */
    this.newBlock(100, 1, true)
  }

  newBlock(proof, previous_hash = null, is_genesis = false) {
    const block = {
      index: this.chain.length + 1,
      timestamp: moment().format('X'),
      transactions: this.current_transactions,
      proof,
      previous_hash: previous_hash || this.hash(this.chain[0])
    }
    if(is_genesis) block.genesis = true
    
    this.current_transactions = []
    this.chain.push(block)

    return block
  }

  newTransaction(sender, recipient, amount) {
    this.current_transactions.push({
      sender,
      recipient,
      amount
    })

    const last_block = this.lastBlock()
    return last_block.index + 1
  }

  lastBlock () {
    return this.chain[this.chain.length - 1]
  }

  hash(block) {
    const block_string = block.toString()
    const hash = createHash('sha256')
    hash.update(block_string)
    return hash.digest('hex')
  }

  proofOfWork(last_proof) {
    let proof = 0
    while(!this.validProof(last_proof, proof)) {
      proof += 1
    }
    return proof
  }

  validProof(last_proof, proof) {
    const guess = `${last_proof}${proof}`
    const hash = createHash('sha256')
    const hashed_guess = hash.update(guess).digest('hex')
    console.log(proof, hashed_guess)
    return hashed_guess.substr(hashed_guess.length - 4) === '00000'
  }

}

module.exports = Blockchain