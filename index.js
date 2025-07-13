const express = require('express')
const mongoose = require('mongoose')
let cors = require('cors')

let env = require('dotenv')
const app = express();
const http = require('http');
env.config()



// Add Ably configuration
const ably = new Ably.Rest(process.env.ABLY_API_KEY);

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



const userRouter = require('./routes/users')
// const jobsRouter = require('./routes/jobs')
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
const platformEarningsRoutes = require('./routes/platformEarnings');
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
// app.use('/jobs', jobsRouter)
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
app.use('/platformEarnings', platformEarningsRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('*', function (req, res, next) {
  next({ statusCode: 404, message: "not found" })
})

app.use('/uploads', (req,res)=>{
  res.send("hello world abo")
});

const PORT = process.env.PORT || 3344;
app.listen(PORT, () => {
  console.log(`Server running on portt ${PORT}`);
});
