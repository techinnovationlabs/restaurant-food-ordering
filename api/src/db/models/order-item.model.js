const sql = require("../db.connection");

// constructor
const OrderItems = function (orderItem) {
    this.order_id = orderItem.orderId;
    this.item_id = orderItem.itemId;
    this.count = orderItem.count;
};

OrderItems.create = async (newOrderItem) => {
    try {
        const query = await sql.query("INSERT INTO order_items SET ?", newOrderItem);
        return query.values;
    } catch (err) {
        throw err;
    }
};

OrderItems.getAllByOrderId = async (orderId, result) => {
    sql.query(`SELECT * FROM order_items WHERE order_id = ${1}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

module.exports = OrderItems;