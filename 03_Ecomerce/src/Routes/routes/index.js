const express = require('express');

const router = express.Router();

const { CustumerCtrl, adminCtrl } = require('../../controllers/index')
const { internalSvcMw } = require('../../middlewares/index')


router.get("/check", internalSvcMw.verifyToken ,(req, res) => {
  return res.json({ message: "Ecomerce Server is good to GO" });
});


// admin 
// admin/products
router.post( "/products/add", internalSvcMw.verifyToken ,  adminCtrl.addProduct );
router.delete( "/products/delete",  internalSvcMw.verifyToken , adminCtrl.deleteProduct );
router.get( "/products/getall",  internalSvcMw.verifyToken , CustumerCtrl.getProductall );
router.delete( "/products/bulkdelete",  internalSvcMw.verifyToken , adminCtrl.bulkdeleteProduct );
router.patch( "/products/update",  internalSvcMw.verifyToken , adminCtrl.editProduct );

//admin/orders
router.get( "/orders",  internalSvcMw.verifyToken , adminCtrl.getAllOrders );
router.get( "/ordersAll", internalSvcMw.verifyToken ,  adminCtrl.getAllOrders );
router.get( "/getOrderAllWithoutFilter", internalSvcMw.verifyToken ,  adminCtrl.getAllOrdersWithoutFilter );
router.patch( "/orders/update", internalSvcMw.verifyToken ,  adminCtrl.editOrders ); 


// custumer 
// custumer/product
router.get( "/products",internalSvcMw.verifyToken ,internalSvcMw.verifyToken ,  CustumerCtrl.getProduct );
router.get( "/product",internalSvcMw.verifyToken ,internalSvcMw.verifyToken ,  CustumerCtrl.getProductById ); 

// custumer/orders
router.post( "/orders/addOrder",  internalSvcMw.verifyToken , CustumerCtrl.addOrders );
router.get( "/orders/getByUser",  internalSvcMw.verifyToken , CustumerCtrl.getOrdersByUserId );
router.post( "/orders/orderIntial", internalSvcMw.verifyToken ,  CustumerCtrl.orderInitial );
router.get( "/orders/orderFinal", internalSvcMw.verifyToken ,  CustumerCtrl.orderFinal );
router.get( "/orders/orderByNO",  internalSvcMw.verifyToken , CustumerCtrl.getDetailOrderByOrderno );

// custumer / cart 
router.post( "/cart", internalSvcMw.verifyToken ,  CustumerCtrl.getCartById );
router.delete( "/cart", internalSvcMw.verifyToken ,  CustumerCtrl.clearCart );

router.post( "/cart/items",  internalSvcMw.verifyToken ,CustumerCtrl.addItemCart);
router.delete( "/cart/items", internalSvcMw.verifyToken ,  CustumerCtrl.BulkremoveItemCart );
router.patch( "/cart/items",  internalSvcMw.verifyToken , CustumerCtrl.updateItemsBluk );

router.delete( "/cart/items/:itemId",  internalSvcMw.verifyToken , CustumerCtrl.removeItemCart );
router.patch( "/cart/items/:itemId",  internalSvcMw.verifyToken , CustumerCtrl.updateItemCart );
 

//custemer /checkout
router.get ( "/cart/checkout", internalSvcMw.verifyToken ,  CustumerCtrl.checkoutCart );
module.exports = router;