require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data
app.use('/images', express.static('public/images'))
const port = process.env.PORT || 3000

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

app.get('/aboutus', (req,res)=>{
  const response = {
    name: "Name: Daniel Sun",
    description: `I'm currently a senior pursuing a dual degree in Economics and Computer Science. With a passion for both analytical thinking and problem-solving, I’ve found the perfect balance between understanding complex financial systems and building efficient, scalable software solutions. \n

My goal is to become a software engineer, where I can apply my technical skills to create impactful and innovative technologies. I’m particularly interested in areas like algorithms and data structures, which are not only vital in software engineering but also align with some of my favorite hobbies, like solving Rubik’s cubes and playing Tetris. I've been solving Rubik's cubes ever since I was in elementary school, and now I am the president of the Rubik's Cube Club at NYU. In addition, I've found Tetris to be an enjoyable activity for destressing especially after a long day of school/work. These games fuel my fascination with strategy and optimization, and I often find myself approaching coding challenges with the same mindset. \n

The past summer, I've started to go climbing after working at my internship in the city. To me, it just feels like a real life physical version of leetcode or problem solving. There's always a solution though many are much messier and overcomplicated. It’s a great way to stay active, challenge myself physically, and keep my mind sharp. Just like coding, climbing requires focus, adaptability, and perseverance—qualities.`,
    imageUrl: `http://localhost:${port}/images/sun_daniel_image.jpg`
  }
  res.json({
    response,
    status: 'all good'
  })
})

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
