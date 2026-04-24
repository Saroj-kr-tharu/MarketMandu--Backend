const express = require("express");
const router = express.Router();

const templateCtrl = require("../../Controllers/remainder.ctrl");
const internalSvcMw = require("../../Middlewares/internal.service.middleware")


router.get("/check", internalSvcMw.verifyToken ,(req, res) => {
  return res.json({ message: "Remainder Server is good to Go" });
});

router.post("/template", internalSvcMw.verifyToken,     templateCtrl.createCtrl);
router.delete("/template/:templateId",  internalSvcMw.verifyToken,   templateCtrl.deleteCtrl);
router.patch("/template/:templateId", internalSvcMw.verifyToken,      templateCtrl.updateCtrl);
router.get("/template", internalSvcMw.verifyToken,    templateCtrl.getAll);



module.exports = router;
