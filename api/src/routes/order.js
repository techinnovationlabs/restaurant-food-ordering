const express = require("express");
const OrderController = require("../controllers/order");
const router = express.Router();

router.get("/all/:clientId", OrderController.fetchOrders);
router.post("/:clientId", OrderController.placeOrder);

module.exports = router;