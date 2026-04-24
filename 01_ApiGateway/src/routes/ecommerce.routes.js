const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const {userMw} = require("../middlewares/index");
const { INTERNAL_SERVER_TOKEN, ECOMMERCE_BACKEND_URL } = require("../serverConfig/server.config");

const router = express.Router();

const ecommerceProxy = createProxyMiddleware({
  target: ECOMMERCE_BACKEND_URL,
  changeOrigin: true,
  pathRewrite: { "^/payment": "" },
  headers: { "x-internal-server-token": INTERNAL_SERVER_TOKEN },
  logLevel: "debug", 
});

router.get("/check", ecommerceProxy);


// admin 
// admin/products
router.post( "/products/add",           userMw.verifyAdmin,  ecommerceProxy );
router.delete( "/products/delete",      userMw.verifyAdmin,  ecommerceProxy );
router.get( "/products/getall",         userMw.verifyAdmin,  ecommerceProxy );
router.delete( "/products/bulkdelete",  userMw.verifyAdmin,  ecommerceProxy );
router.patch( "/products/update",       userMw.verifyAdmin,  ecommerceProxy );

//admin/orders
router.get( "/orders",  userMw.verifyAdmin,  ecommerceProxy );
router.get( "/ordersAll",  userMw.verifyAdmin,  ecommerceProxy );
router.get( "/getOrderAllWithoutFilter",  userMw.verifyAdmin,  ecommerceProxy );
router.patch( "/orders/update",  userMw.verifyAdmin,  ecommerceProxy );




// custumer 
// custumer/product 
router.get( "/products",    ecommerceProxy );
router.get( "/product",    ecommerceProxy ); 

// custumer/orders
router.post( "/orders/addOrder",  userMw.verifyUser,  ecommerceProxy  );
router.get( "/orders/getByUser",  userMw.verifyUser,  ecommerceProxy );
router.post( "/orders/orderIntial",  userMw.verifyUser,  ecommerceProxy );
router.get( "/orders/orderFinal",     ecommerceProxy);
router.get( "/orders/orderByNO",   userMw.verifyUser,  ecommerceProxy);

// custumer / cart 
router.post( "/cart", userMw.verifyUser,  ecommerceProxy );
router.delete( "/cart", userMw.verifyUser,  ecommerceProxy );
router.post( "/cart/items", userMw.verifyUser,  ecommerceProxy);
router.delete( "/cart/items", userMw.verifyUser,  ecommerceProxy );
router.patch( "/cart/items", userMw.verifyUser,  ecommerceProxy);
router.delete( "/cart/items/:itemId", userMw.verifyUser,  ecommerceProxy );
router.patch( "/cart/items/:itemId", userMw.verifyUser,  ecommerceProxy );

//custemer /checkout
router.get ( "/cart/checkout",  userMw.verifyUser,  ecommerceProxy );




module.exports = router;
