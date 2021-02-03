import { AppBar, Button, Card, Tab, Tabs, Typography } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import React, { useEffect, useState } from "react";
import allItems from "../all-items";
import { OrderItem, Item, OfferItems } from "../types";
import axios from 'axios';
import { baseURL } from "../config";

const Menu = () => {

    const [tabIndex, setTabIndex] = useState(0);
    const [menu, setMenu] = useState<Item[]>([]);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [total, setTotal] = useState(0);
    const [offerItems, setOfferItems] = useState<OfferItems>({ offer1: [], offer2: [] });
    const [uID, setUID] = useState<string>("");

    let storage = window.sessionStorage;

    const menuData = allItems;

    const getMenu = async () => {
        setMenu(menuData);
    };

    const onTabChange = (event: any, value: number) => {
        setTabIndex(value);
    };

    const getItemsByCategory = (category: string) => {
        let items = menu.filter((item) => item.category === category);
        return items?.length ? items : [];
    };

    const getOrderItem = (itemID: number) => {
        if (orderItems.length) {
            let item = orderItems.find(({ id }) => id === itemID);
            return item;
        }
        return null;
    };

    const increaseCount = (item: Item) => {
        let orderItem = getOrderItem(item.id);
        if (orderItem) {
            orderItem.count++;
            let items = orderItems.filter(({ id }) => id != orderItem?.id);
            setOrderItems([...items, orderItem]);
            return;
        }
        setOrderItems([...orderItems, { id: item.id, count: 1, category: item.category }]);
    };

    const decreaseCount = (item: Item) => {
        let orderItem = getOrderItem(item.id);
        if (orderItem) {
            orderItem.count--;
            let items = orderItems.filter(({ id }) => id != orderItem?.id);
            setOrderItems([...items, orderItem]);
        }
    };

    const getCount = (itemID: number) => {
        if (orderItems.length) {
            let item = getOrderItem(itemID);
            if (item) {
                return item.count;
            }
        }
        return 0;
    };

    const getItemsCount = (items: Item[]) => {
        let count = 0;
        if (items.length) {
            for (const item of items) {
                count += getCount(item.id);
            }
        }
        return count;
    };

    const getLessPricedItem = (items: Item[]) => {
        return items.sort((item1, item2) => item1.price - item2.price)[0];
    };

    const getLessPricedItems = (items: Item[], limit: number) => {
        let itemArr = [...items];
        let list = [];
        for (let i = 1; i <= limit; i++) {
            let item = getLessPricedItem(items);
            let index = itemArr.findIndex(({ id }) => id == item.id);
            itemArr.splice(index, 1);
            let isPresent = list.find(({ id }) => item.id == id);
            if (!isPresent) {
                list.push(item);
            }
        }
        return list;
    };

    const applyOffers = (cartItems: Item[]) => {
        let offItems: OfferItems = { offer1: [], offer2: [] };
        if (cartItems.length) {
            let mains = cartItems.filter(({ category }) => category === "food");
            let mainsCount = getItemsCount(mains);
            let drinks = cartItems.filter(({ category }) => category === "drink");
            let drinksCount = getItemsCount(drinks);
            let desserts = cartItems.filter(({ category }) => category === "dessert");
            let dessertsCount = getItemsCount(desserts);
            //offer2
            if (mainsCount && drinksCount && dessertsCount) {
                if (mainsCount >= 2 && drinksCount >= 2) {
                    let lessPricedMain = getLessPricedItem(mains);
                    let lessPricedDrink = getLessPricedItem(drinks);
                    let lessPricedDessert = getLessPricedItem(desserts);
                    offItems = { offer1: [], offer2: [lessPricedMain, lessPricedDrink, lessPricedDessert] };
                    setOfferItems(offItems);
                }
            }
            //offer 1
            else if (mainsCount && drinksCount) {
                if (mainsCount == drinksCount) {
                    offItems = { offer1: [...mains, ...drinks], offer2: [] };
                    setOfferItems(offItems);
                } else if (mainsCount > drinksCount) {
                    let lessPricedMains = getLessPricedItems(mains, drinksCount);
                    offItems = { offer1: [...lessPricedMains, ...drinks], offer2: [] };
                    setOfferItems(offItems);
                } else if (drinksCount > mainsCount) {
                    let lessPricedDrinks = getLessPricedItems(drinks, mainsCount);
                    offItems = { offer1: [...lessPricedDrinks, ...mains], offer2: [] };
                    setOfferItems(offItems);
                }
            } else {
                setOfferItems(offItems);
            }
        }
        return offItems;
    };

    const getItems = (itemIDs: number[]) => {
        let items = [];
        for (const itemID of itemIDs) {
            let item = menu.find(({ id }) => id == itemID);
            if (item) {
                items.push(item);
            }
        }
        return items;
    };

    const getOrderItemIDs = () => {
        let IDs = [];
        for (const orderItem of orderItems) {
            if (orderItem.count) {
                let isPresent = IDs.find((id) => id == orderItem.id);
                if (!isPresent) {
                    IDs.push(orderItem.id);
                }
            }
        }
        return IDs;
    };

    const getTotal = () => {

        let IDs = getOrderItemIDs();
        let cartItems = getItems(IDs);
        // let offItems = applyOffers(cartItems);
        // console.log("off", offItems.offer1);
        // console.log("cart", cartItems);
        // if (offItems.offer1.length) {
        //     let cartItemArr = [...cartItems];
        //     let offItemsPrice = 0;
        //     // let cartItemsPrice = 0;
        //     for (const offItem of offItems.offer1) {
        //         let index = cartItemArr.findIndex(({ id }) => id == offItem.id);
        //         cartItemArr.splice(index, 1);
        //         offItemsPrice += (offItem.price - (offItem.price / 10));
        //     }
        //     console.log((offItemsPrice / 100).toFixed(2), cartItemArr);
        //     // return;
        // }
        let cartItemsPrice = 0;
        for (const cartItem of cartItems) {
            let orderItem = getOrderItem(cartItem.id);
            let count = orderItem ? orderItem.count : 1;
            cartItemsPrice += cartItem.price * count;
        }
        setTotal(cartItemsPrice);
        return cartItemsPrice;
    };

    const loadFromStorage = () => {
        let cache = storage.getItem('cache');
        let data = cache ? JSON.parse(cache) : null;
        if (data) {
            setOrderItems(data.orderItems);
            setTotal(data.total);
            setOfferItems(data.offerItems);
        }
    };

    const handleSubmit = async () => {
        let orderDetails = {
            total,
            deal: "Hot Offer 10%",
            items: orderItems
        };
        const res = await axios.post(`${baseURL}api/orders/${uID}`, orderDetails);
        console.log(res);
    };

    const setUserID = () => {
        let cache = storage.getItem('uID');
        let data = cache ? cache : null;
        console.log(data);
        if (data) {
            let storedUID = data;
            setUID(storedUID);
        } else {
            console.log("else");
            let uID = '_' + Math.random().toString(36).substr(2, 9);
            setUID(uID);
            storage.setItem('uID', uID);
        }
    };

    useEffect(() => {
        getMenu();
        loadFromStorage();
        setUserID();
    }, []);

    useEffect(() => {
        if (orderItems.length) {
            console.log("calling getTotal");
            getTotal();
        }
    }, [orderItems]);


    useEffect(() => {
        storage.setItem('cache', JSON.stringify({ orderItems, total, offerItems }));
    }, [total, orderItems, offerItems]);

    let ItemList = (props: any) => {
        return props.items?.length ? props.items.map((item: Item) => {
            return <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <span>{item?.name}</span>
                <span style={{ marginLeft: 10 }}>${(item?.price / 100).toFixed(2)}</span>
                <div>
                    <Button
                        onClick={() => decreaseCount(item)}
                        disabled={getOrderItem(item.id)?.count ? false : true}
                    >
                        <RemoveIcon fontSize="small" />
                    </Button>
                    {getCount(item.id)}
                    <Button
                        onClick={() => increaseCount(item)}
                    >
                        <AddIcon fontSize="small" />
                    </Button>
                </div>
            </div>;
        }) : <p>NO DATA</p>;
    };

    return (
        <>
            <Tabs
                value={tabIndex}
                onChange={onTabChange}
                indicatorColor="primary"
                textColor="primary"
            >
                <Tab label="Mains" />
                <Tab label="Drinks" />
                <Tab label="Desserts" />
            </Tabs>
            {
                tabIndex === 0 ? <ItemList items={getItemsByCategory("food")} /> :
                    tabIndex === 1 ? <ItemList items={getItemsByCategory("drink")} /> :
                        <ItemList items={getItemsByCategory("dessert")} />
            }
            <AppBar position="static" style={{ width: "15%", display: "flex", flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography variant="h6">
                    Grand Total
                </Typography>
                <Typography variant="h6">
                    ${(total / 100).toFixed(2)}
                </Typography>
            </AppBar>
            <Button variant="contained" color="primary" style={{ marginTop: 10 }} onClick={handleSubmit}>
                Submit
            </Button>
        </>
    );
};

export default Menu;;