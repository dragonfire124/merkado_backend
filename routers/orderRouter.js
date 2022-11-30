
import express from "express"
import expressAsyncHandler from "express-async-handler";
import { isAdmin, isAuth } from "../utils.js";
import Order from "../models/orderModel.js";
import User from "../models/userModels.js";
import Product from "../models/productModel.js";

const orderRouter = express.Router();


orderRouter.get('/summary',  isAuth, expressAsyncHandler(async(req,res)=>{                   // Encuentra orden por id, si lo hay regresa info, sino mensaje no encontrado
    const orders  = await  Order.aggregate([{
        $group:{
            _id:null,
            numOrders:{$sum:1},
            totalSales: {$sum:  '$totalPrice'},
        }
    }
]);
const users = await User.aggregate([
    {
        $group:{
            _id:null,
            numUsers:{$sum:1}
        }
    }
])
const dailyOrders = await Order.aggregate([
    {
        $group:{
            _id:{$dateToString:{format: '%Y-%m-%d', date: '$createdAt'}},
            orders: {$sum:1},
            sales: {$sum: 'totalPrice'}
        }
    }
])

const productCategories = await Product.aggregate([
    {
        $group:{
            _id: '$category',
            count: {$sum:1}
        }
    }
])

res.send({users, orders, dailyOrders, productCategories })
}) )

orderRouter.get('/:id', /*isAuth,*/ expressAsyncHandler(async(req,res)=>{                   // Encuentra orden por id, si lo hay regresa info, sino mensaje no encontrado
    const order  = await  Order.findById(req.params.id);
    if(order){
        res.send(order);
    }else{
        res.status(404).send({message:'Order not found'})
    }

}) )

orderRouter.get('/', /*isAuth, isAdmin,*/  expressAsyncHandler(async(req,res)=>{                   // Encuentra orden por id, si lo hay regresa info, sino mensaje no encontrado
    const orders  = await  Order.find({}).populate('user');
    res.send(orders);
}));

orderRouter.post(
'/',
isAuth,
expressAsyncHandler(async (req,res)=>{
    const order = new Order({
        orderItems: req.body.orderItems,
        user: req.user._id,
        shipping: req.body.shipping,
        payment: req.body.payment,
        itemsPrice: req.body.itemsPrice,
        taxPrice: req.body.taxPrice,
        shippingPrice: req.body.shippingPrice,
        totalPrice: req.body.totalPrice,
    });

const createdOrder = await order.save();
    res.status(201).send({message: 'New Order  Created', order: createdOrder})
})
);


orderRouter.delete('/:id',  isAuth,isAdmin,  expressAsyncHandler(async(req,res)=>{
    const order = await Order.findById(req.params.id);
    if(order){
        const deletedOrder = await  order.remove();
        res.send({message: 'Order Deleted', order: deletedOrder})
    }else{
        res.status(404).send({message: 'Order not found'})
    }
}))


// UPDATE PRODUCT //
orderRouter.put('/:id/deliver', isAuth, isAdmin, expressAsyncHandler(async(req,res)=>{
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
        if(order){
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save()
        res.send({message: 'Order Delivered', order: updatedOrder})
        }else{
            res.status(404).send({message: 'Order not found!!!'})
        }
    })
    );


export default orderRouter;