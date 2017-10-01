const express = require('express')
const uuid = require('uuid4')
const app = express()

const Blockchain = require('./chain')
const PORT = 3000
const NODE_ID = uuid()

const blockchain = new Blockchain()

app.get('/mine', (req, res) => {
  const last_block = blockchain.lastBlock()
  const last_proof = last_block.proof
  const new_proof = blockchain.proofOfWork(last_proof)

  blockchain.newTransaction(0, NODE_ID, 1) // Sender is 0 to signify new coin
  
  const new_block = blockchain.newBlock(new_proof)
  const { index, transactions, proof, previous_hash } = new_block

  res.status(200).json({
    status: 200,
    message: 'new block forged',
    index,
    transactions,
    proof,
    previous_hash
  })
})

app.post('/transactions/new', (req, res) => {
  const sender = req.query.sender
  const recipient = req.query.recipient
  const amount = req.query.amount

  if(!sender || !recipient || !amount) {
    res.status(400).json({
      status: 400,
      error: 'Missing required values (transaction must contain sender, recipient, amount)'
    })
  }

  const index = blockchain.newTransaction(sender, recipient, amount)
  
  res.status(201).json({
    status: 201,
    message: `Transaction will be added to block ${index}`
  })
})

app.get('/chain', (req, res) => {
  res.json({
    chain: blockchain.chain,
    length: blockchain.chain.length
  })
})

app.listen(PORT, () => {
  console.log(`simple-blockchain server listening at ${PORT}, node=${NODE_ID}`)
})