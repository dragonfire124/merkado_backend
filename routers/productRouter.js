import   express  from 'express';
import  expressAsyncHandler from 'express-async-handler';
import  Product from '../models/productModel.js';
import  { isAuth, isAdmin } from '../utils.js';

const productRouter = express.Router();

                                            // Crea producto //
productRouter.post('/', isAuth, isAdmin, expressAsyncHandler(async(req,res)=>{
    const product =  new Product({
        name: 'sample product',
        description: 'sample desc',
        category: 'sample category',
        brand: 'sample brand',
        image: '/images/product-1.jpg'
    });

const createdProduct = await product.save();
    if(createdProduct){
        res.status(201).send({
            message: 'Product Created', product: createdProduct          // Manda info del producto
        })
    }else{
        res.status(500).send({message: 'Error in creating product'})
    }
}))

// UPDATE PRODUCT //
productRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async(req,res)=>{
    const productId = req.params.id;
    const product = await Product.findById(productId);
        if(product){
        product.name = req.body.name;
        product.description= req.body.description;
        product.category= req.body.category;
        product.brand= req.body.brand;
        product.image=req.body.image;
        product.countInStock= req.body.countInStock;
        product.price=req.body.price;
        const updatedProduct = await product.save()
         if(updatedProduct){
            res.send({message: 'Product updated', product: updatedProduct})
         }else{
            res.status(500).send({message: 'Error en updating the product'})
         }
        }else{
            res.status(404).send({message: 'Product not found!!!'})

        }
    }))
    
//GETL ALL PRODUCTS
productRouter.get('/', expressAsyncHandler(async (req,res)=>{
     const products = await Product.find({})                             // Obtiene todos los productos
    res.send(products)
}))

//GET A A SINGLE PRODUCT
    productRouter.get('/:id', expressAsyncHandler(async (req,res)=>{
        const product = await Product.findById(req.params.id)                             // Obtiene un solo producto
       res.send(product)
       }))

productRouter.delete('/:id',  isAuth,isAdmin,  expressAsyncHandler(async(req,res)=>{
    const product = await Product.findById(req.params.id);
    if(product){
        const deletedProduct = await  product.remove();
        res.send({message: 'Product Deleted', product: deletedProduct})
    }else{
        res.status(404).send({message: 'Product not found'})
    }
}))
export default productRouter;