
module.exports = {
   paymentTransactionValidation : require("./paymentTransactionValidation"),
   eSewaValidation : require("./esewaValidation"),
   khaltiValidation : require("./khaltiValidation"),
   stripeValidation: require("./stripeValidation"),
   internalSvcMw : require('./internal.service.middleware'),
}