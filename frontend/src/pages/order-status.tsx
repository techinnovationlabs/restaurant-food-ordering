import { Accordion, AccordionDetails, AccordionSummary, Tab, Tabs, Typography } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import allItems from "../all-items";
import { Orders } from "../types";


const OrderStatus = () => {
    let menu = allItems;
    const [orders, setOrders] = useState<Orders[]>();
    useEffect(() => {
        async function getOrders() {
            let uID = window.sessionStorage.getItem("uID");
            await axios.get(`http://localhost:4848/api/orders/all/${uID}`).then(res => {
                debugger;
                setOrders(res.data);
            }).catch(err => { console.log(); });
        }
        getOrders();
    }, []);

    // useEffect(() => {

    // }, [updatedOrders]);


    const getItem = (itemID: number) => {
        let item = menu.find(({ id }) => id == itemID);
        return item;
    };

    const getItems = (items: any) => {
        let itemArr = [];
        if (items.length) {
            for (const data of items) {
                let item = getItem(data.id);
                itemArr.push(item);
            }
        }
        return itemArr;
    };

    const getOrderTotal = (orderItems: any) => {
        // let items = getItems(orderItems);
        let total = 0;
        for (const orderItem of orderItems) {
            let item = menu.find(({ id }) => id == orderItem.itemID);
            if (item) {
                total += item.price * orderItem.count;
            }
        }
        return total;
    };

    return (
        <>
            {orders && orders.map((order) => {
                // let total = getOrderTotal(order.items);
                return <Accordion square key={order.id}>
                    <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                        <div style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Typography>Order ID {" " + order.id}</Typography>
                            <Typography>Status:{" " + order.status}</Typography>
                            <Typography>Total:{" $" + order.total}</Typography>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div>
                            {order.deal.length ? <Typography>
                                {"Offer Applied: "}{order.deal}
                            </Typography> : null}
                            <Typography style={{ marginBottom: 10, marginTop: 10 }}>
                                Ordered Items:
                            </Typography>
                            {order.items.map(({ item_id, count }) => {
                                let item = getItem(item_id);
                                return (
                                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginBottom: 10 }}>
                                        <Typography style={{ width: "35%" }}>{item?.name}</Typography>
                                        <Typography>{" $"}{item?.price ? (item.price / 100).toFixed(2) : 0}</Typography>
                                        <Typography>{" X "}{count}</Typography>
                                    </div>
                                );
                            })}
                        </div>
                    </AccordionDetails>
                </Accordion>;
            })}
        </>
    );
};

export default OrderStatus;