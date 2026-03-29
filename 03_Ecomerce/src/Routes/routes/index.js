const express = require('express');

const router = express.Router();

const { adminController,CustumerControllers } = require('../../controllers/index')
const { internalSvcMw } = require('../../middlewares/index')



router.get("/check", internalSvcMw.verifyToken ,(req, res) => {
  return res.json({ message: "Ecomerce Server is good to GO" });
});


// admin 
// admin/products
router.post( "/products/add", internalSvcMw.verifyToken ,  adminController.addProduct );
router.delete( "/products/delete",  internalSvcMw.verifyToken , adminController.deleteProduct );
router.get( "/products/getall",  internalSvcMw.verifyToken , CustumerControllers.getProductall );
router.delete( "/products/bulkdelete",  internalSvcMw.verifyToken , adminController.bulkdeleteProduct );
router.patch( "/products/update",  internalSvcMw.verifyToken , adminController.editProduct );

//admin/orders
router.get( "/orders",  internalSvcMw.verifyToken , adminController.getAllOrders );
router.get( "/ordersAll", internalSvcMw.verifyToken ,  adminController.getAllOrders );
router.get( "/getOrderAllWithoutFilter", internalSvcMw.verifyToken ,  adminController.getAllOrdersWithoutFilter );
router.patch( "/orders/update", internalSvcMw.verifyToken ,  adminController.editOrders );


//admin/users
router.get( "/users", internalSvcMw.verifyToken , adminController.getAllUsers );
router.get( "/userswithoutfilter", internalSvcMw.verifyToken ,  adminController.getAllUserWithoutFilter );
router.patch( "/users/update", internalSvcMw.verifyToken ,  adminController.updateUserById );
router.patch( "/users/bulkupdate", internalSvcMw.verifyToken ,  adminController.BulkupdateUsers );

// custumer 
// custumer/product
router.get( "/products",internalSvcMw.verifyToken ,internalSvcMw.verifyToken ,  CustumerControllers.getProduct );
router.get( "/product",internalSvcMw.verifyToken ,internalSvcMw.verifyToken ,  CustumerControllers.getProductById ); 

// custumer/orders
router.post( "/orders/addOrder",  internalSvcMw.verifyToken , CustumerControllers.addOrders );
router.get( "/orders/getByUser",  internalSvcMw.verifyToken , CustumerControllers.getOrdersByUserId );
router.post( "/orders/orderIntial", internalSvcMw.verifyToken ,  CustumerControllers.orderInitial );
router.get( "/orders/orderFinal", internalSvcMw.verifyToken ,  CustumerControllers.orderFinal );
router.get( "/orders/orderByNO",  internalSvcMw.verifyToken , CustumerControllers.getDetailOrderByOrderno );

// custumer / cart 
router.post( "/cart/add",  internalSvcMw.verifyToken ,CustumerControllers.addItemCart);
router.delete( "/cart/delete", internalSvcMw.verifyToken ,  CustumerControllers.clearCart );
router.post( "/cart/getCart", internalSvcMw.verifyToken ,  CustumerControllers.getCartById );
router.delete( "/cart/removeItem",  internalSvcMw.verifyToken , CustumerControllers.removeItemCart );
router.post( "/cart/bulkdelete", internalSvcMw.verifyToken ,  CustumerControllers.BulkremoveItemCart );
router.patch( "/cart/updateItem",  internalSvcMw.verifyToken , CustumerControllers.updateItemCart );
router.patch( "/cart/bulkupdate",  internalSvcMw.verifyToken , CustumerControllers.updateItemsBluk );

//custemer /checkout
router.get ( "/cart/checkout", internalSvcMw.verifyToken ,  CustumerControllers.checkoutCart );

 
 
module.exports = router;