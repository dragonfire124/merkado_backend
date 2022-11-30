import  express  from 'express';
import  cors from 'cors';
import  mongoose from  'mongoose';
import  bodyParser from  'body-parser';
import  path from  'path';
import config from './config.js'; 
import userRouter from './routers/userRoute.js';
import uploadRouter from './routers/uploadRouter.js';
import orderRouter from './routers/orderRouter.js';
import productRouter from './routers/productRouter.js';
import User from './models/userModels.js';


mongoose.connect(
    'mongodb+srv://karl:holamundo@cluster0.uxvrmgu.mongodb.net/test',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
  }).then(() => console.log('Connected to MongoDB.'))
  .catch((error)=>{
    console.log(error)
  })

const app = express();




app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', userRouter);
app.use('/api/uploads', uploadRouter)
app.use('/api/orders', orderRouter);
app.use('/api/products', productRouter);





/*
app.use((err,req,res)=>{
    const status = err.name && err.name === 'ValidationError'? 400:500;
    res.status(status).send({message: err.message})
  })*/
 
  app.listen(5000, () => {
    console.log('serve at http://localhost:5000');
  });
  