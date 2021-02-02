const _ = require("lodash");
const Order = require("../db/models/order.model");
const OrderItem = require("../db/models/order-item.model");

const notify = async (order) => {
    console.log("Notify");
    console.log(order);
    try {
        const updatedOrder = await Order.updateById(order.id, { clientId: order.client_id, status: "Ready To Pickup", total: order.total, deal: order.deal });
        global.io.emit(`order.client_id`, updatedOrder);
        console.log("updatedOrder", updatedOrder);
    } catch (err) {
        return;
    }
};

module.exports = {
    async placeOrder(req, res) {
        // Validate request
        if (!req.body) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
        }
        // Create a Order
        const order = new Order({
            clientId: req.params.clientId,
            status: "Preparing",
            total: req.body.total,
            deal: req.body.deal
        });
        const items = req.body.items;
        // Save Order in the database
        Order.create(order, async (err, orderData) => {
            if (err) {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the Order."
                });
            }
            else {
                var ItemsData = [];
                for (let i = 0; i < items.length; i++) {
                    let orderItem = new OrderItem({ orderId: orderData.id, itemId: items[i].id, count: items[i].count });
                    try {
                        const resp = await OrderItem.create(orderItem);
                        ItemsData.push(resp);
                    } catch (err) {
                        res.status(500).send({
                            message:
                                err.message || "Some error occurred while creating the Order."
                        });
                    }
                };
                setTimeout(notify, 15000, orderData);
                res.send({ ...orderData, items: ItemsData });
            }
        });
    },
    async fetchOrders(req, res) {
        if (!req.body) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
        }
        Order.getAllByClientId(req.params.clientId, async (err, allOrders) => {
            if (err) {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while Fetching the Orders."
                });
            }
            res.send(allOrders);
        });


    },
};