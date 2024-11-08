const express = require('express')
const mongoose = require('mongoose')
let cors = require('cors')

let env = require('dotenv')
const app = express();
const http = require('http');
env.config()
// const { Server } = require("socket.io");
const Pusher = require('pusher')
const Ably = require('ably');
const path = require('path');
const fs = require('fs');

// Remove Pusher configuration
// Add Ably configuration
const ably = new Ably.Rest(process.env.ABLY_API_KEY);

// Make ably accessible to routes
app.set('ably', ably);

// Add environment variable check
console.log('Ably configuration:', {
  apiKey: process.env.ABLY_API_KEY ? 'Set' : 'Not set'
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads directory created at:', uploadsDir);
}

// Add this log to verify the directory is being served
console.log('Serving uploads from:', uploadsDir);

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
const paymentRoutes = require('./routes/payment');
const earningRoutes = require('./routes/earning');
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
// app.use('/messages', messageRoutes);
app.use('/transactions', transactionRoutes);
app.use('/paypal', paypalRoutes);
app.use('/payment', paymentRoutes);
app.use('/earning', earningRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('*', function (req, res, next) {
  next({ statusCode: 404, message: "not found" })
})
app.use('/static/users', express.static(path.join(__dirname, 'static/users')));
app.use('/static', express.static(path.join(__dirname, 'static')));

app.use('/static', (req, res, next) => {
    console.log('Static file requested:', req.url);
    next();
});

app.use('/static/users', (req, res, next) => {
    // If requested image doesn't exist, serve default avatar
    const requestedPath = path.join(__dirname, 'static/users', req.path);
    if (!fs.existsSync(requestedPath)) {
        return res.sendFile(path.join(__dirname, 'static/users/avatar.png'));
    }
    next();
});

app.use('/static/users/*', (req, res, next) => {
    const filePath = path.join(__dirname, req.url);
    if (!fs.existsSync(filePath)) {
        // If requested image doesn't exist, serve default
        return res.sendFile(path.join(__dirname, 'static/users/avatar.png'));
    }
    next();
});

// Add this line to serve static files from the uploads directory
app.use('/uploads', (req,res)=>{
  res.send("hello world abo")
});

const PORT = process.env.PORT || 3344;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Make io accessible to our router
// app.set('io', io);
app.set('pusher', pusher);
// app.set('connectedUsers', connectedUsers);