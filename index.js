const express = require('express')
const mongoose = require('mongoose')
let cors = require('cors')

let env = require('dotenv')
const app = express();
const http = require('http');
env.config()
// const { Server } = require("socket.io");
const Pusher = require('pusher')



app.use(cors({
  origin: '*'
}))


//pusher

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true

});


console.log('Pusher configuration:', {
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER
});












// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:3000", "https://mostaqel-clone.vercel.app"],
//     methods: ["GET", "POST"],
//     credentials: true
//   }
// });
// const connectedUsers = new Map();

// io.on('connection', (socket) => {
//   console.log('A user connected');
  
//   socket.on('userConnected', (userId) => {
//     connectedUsers.set(userId, socket.id);
//     socket.join(userId); 
//     console.log(`User ${userId} connected`);
//   });

//   socket.on('joinConversation', (conversationId) => {
//     socket.join(conversationId);
//     console.log(`User joined conversation: ${conversationId}`);
//   });


  // io.on('connection', (socket) => {
  //   socket.on('joinConversation', (conversationId) => {
  //     socket.join(conversationId);
  //   });
  
  //   socket.on('newMessage', (message) => {
  //     io.to(message.conversationId).emit('newMessage', message);
  //   });
  // });



//   socket.on('disconnect', () => {
//     for (let [userId, socketId] of connectedUsers.entries()) {
//       if (socketId === socket.id) {
//         connectedUsers.delete(userId);
//         console.log(`User ${userId} disconnected`);
//         break;
//       }
//     }
//   });
// });


// io.on('connection', (socket) => {
//   console.log('A user connected');
  
  //Join a conversation room

  // socket.on('joinConversation', (conversationId) => {
  //   socket.join(conversationId);
  //   console.log(`User joined conversation: ${conversationId}`);
  // });

  // We don't need this handler anymore as we're emitting from the server
  // socket.on('sendMessage', (message) => {
  //   io.to(message.conversationId).emit('message', message);
  // });

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });





const userRouter = require('./routes/users')
const jobsRouter = require('./routes/jobs')
const messageRouter = require('./routes/messages')
const paymentRouter = require('./routes/payment')
const categoriesRouter = require('./routes/categories')
const proposalsRouter = require('./routes/proposals')
const reviewsRouter = require('./routes/reviews')
const projectRouter = require('./routes/project')
const complaintRoutes = require('./routes/Complaint');
const adminRoutes = require('./routes/Admin');
const Notification = require('./routes/Notification');
const skillRoutes = require('./routes/skills');
const portfolioRoutes = require('./routes/Portfolio');
const balanceRoutes = require('./routes/balance');
const conversationRoutes = require('./routes/conversation');
const messageRoutes = require('./routes/messages');
const transactionRoutes = require('./routes/trnsactions');
const paypalRoutes = require('./routes/paypal');
//const authRouter = require('./routes/auth')



mongoose.connect(`${process.env.MYDB}`).then(() => {
  console.log("connect on database succsesfully");
}).catch((err) => {

  console.log(err);

})



app.use(express.json())



//error handelling middelware
app.use((err, req, res, next) => {
  let statusCode = err.statusCode ? err.statusCode : 500
  res.status(statusCode).send({ message: err.message })
})

app.use(express.json())

app.use('/users', userRouter)
app.use('/jobs', jobsRouter)
app.use('/messages', messageRouter)
app.use('/payment', paymentRouter)
app.use('/categories', categoriesRouter)
app.use('/proposals', proposalsRouter)
app.use('/reviews', reviewsRouter)
app.use('/projects', projectRouter)
app.use('/complaints', complaintRoutes);
app.use('/admins', adminRoutes);
app.use('/notifications', Notification);
app.use('/skills', skillRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/balance', balanceRoutes);
app.use('/conversations', conversationRoutes);
app.use('/messages', messageRoutes);
app.use('/transactions', transactionRoutes);
app.use('/paypal', paypalRoutes);
app.use('/',(req,res)=>{
  res.send("hello world")
});

app.use('*', function (req, res, next) {
  next({ statusCode: 404, message: "not found" })
})




const PORT = process.env.PORT || 3344;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Make io accessible to our router
// app.set('io', io);
app.set('pusher', pusher);
// app.set('connectedUsers', connectedUsers);