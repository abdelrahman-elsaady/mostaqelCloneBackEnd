const express = require('express')
const mongoose = require('mongoose')
let cors = require('cors')

let env = require('dotenv')
const app = express();

app.use(cors({
  origin:'*'
}))

const http = require('http');
const { Server } = require("socket.io");
const socketIo = require('socket.io');


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your client's URL
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});






env.config()


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
//const authRouter = require('./routes/auth')



mongoose.connect(`${process.env.MYDB}`).then(()=>{
  console.log("connect on database succsesfully");
}).catch((err) => {

  console.log(err);
  
})



app.use(express.json())



//error handelling middelware
app.use((err , req ,res , next)=>{
  let statusCode = err.statusCode?err.statusCode:500
  res.status(statusCode).send({message : err.message})
})

app.use(express.json())

app.use('/users',userRouter)
app.use('/jobs',jobsRouter)
app.use('/messages',messageRouter)
app.use('/payment',paymentRouter)
app.use('/categories',categoriesRouter)
app.use('/proposals',proposalsRouter)
app.use('/reviews',reviewsRouter)
app.use('/projects',projectRouter)
app.use('/complaints', complaintRoutes);
app.use('/admins', adminRoutes);
app.use('/notifications', Notification);
app.use('/skills', skillRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/balance', balanceRoutes);
app.use('/conversations', conversationRoutes);
app.use('/messages', messageRoutes);


app.use('*' , function(req , res , next){
  next({statusCode:404 , message : "not found"})
 })




const PORT = 3344;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
