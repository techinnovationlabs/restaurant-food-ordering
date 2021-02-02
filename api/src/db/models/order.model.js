const sql = require("../db.connection");

var joinjs = require('join-js').default;

var resultMaps = [
    {
        mapId: 'orderMap',
        idProperty: 'id',
        properties: ['total', 'deal', 'status'],
        collections: [
            { name: 'items', mapId: 'itemMap', columnPrefix: 'item_' }
        ]
    },
    {
        mapId: 'itemMap',
        idProperty: 'item_id',
        properties: [
            { name: 'itemId', column: 'item_item_id' },
            'count',
        ]
    }
];

// constructor
const Order = function (order) {
    this.client_id = order.clientId;
    this.status = order.status;
    this.total = order.total;
    this.deal = order.deal;
};


Order.create = (newCustomer, result) => {
    sql.query("INSERT INTO orders SET ?", newCustomer, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created order: ", { id: res.insertId, ...newCustomer });
        result(null, { id: res.insertId, ...newCustomer });
    });
};

Order.findById = async (id) => {
    try {
        const query = await sql.query(`SELECT * FROM orders WHERE id = ${id}`);
        return query.values;
    } catch (err) {
        throw err;
    }
};

Order.getAllByClientId = (clientId, result) => {
    sql.query("SELECT o.id as order_id, o.deal as order_deal,o.status as order_status, o.total as order_total,oi.id as item_id, oi.item_id as item_item_id, oi.count as item_count FROM adfoodio.orders o join order_items oi on o.id = oi.order_id WHERE o.client_id = ?", [clientId], (err, allOrders) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        const response = joinjs.map(allOrders, resultMaps, 'orderMap', 'order_');
        response.map(odr => {
            console.log(JSON.stringify(odr));
        });
        result(null, response);
    });
};

Order.updateById = async (id, order) => {
    try {
        const query = await sql.query("UPDATE orders SET status = ? WHERE id = ?", [order.status, id]);
        return query.values;
    } catch (err) {
        throw err;
    }
};

module.exports = Order;