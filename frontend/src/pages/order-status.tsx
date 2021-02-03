import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import allItems from "../all-items";
import { Orders } from "../types";
import { Alert } from '@material-ui/lab';
import { baseURL } from "../config";



const OrderStatus = ({ updateOrders, setUpdateOrders }: any) => {
    let menu = allItems;
    const [orders, setOrders] = useState<Orders[]>();
    const [error, setError] = useState(false);
    useEffect(() => {
        getOrders();
    }, []);

    useEffect(() => {
        if (updateOrders) {
            getOrders();
        }
    }, [updateOrders]);

    const getOrders = async () => {
        let uID = window.sessionStorage.getItem("uID");
        await axios.get(`${baseURL}api/orders/all/${uID}`).then(res => {
            setError(false);
            setOrders(res.data);
            setUpdateOrders(false);
        }).catch(err => {
            setError(true);
        });
    };

    const getItem = (itemID: number) => {
        let item = menu.find(({ id }) => id == itemID);
        return item;
    };

    return (
        <>  {error && <Alert severity="error">Something went wrong in fetching orders</Alert>}
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