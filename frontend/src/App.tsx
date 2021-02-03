import React, { useEffect, useState } from 'react';
import './App.css';
import { AppBar, Tab, Tabs, Toolbar, Typography } from '@material-ui/core';
import Menu from './pages/menu';
import OrderStatus from './pages/order-status';
import { io as socketIOClient } from 'socket.io-client';
import { baseURL } from './config';
import { Alert } from '@material-ui/lab';

function App() {
  const [updateOrders, setUpdateOrders] = useState(false);
  const [notification, setNotification] = useState("");
  useEffect(() => {
    let socket: any;
    socket = socketIOClient(baseURL, {
      transports: ["websocket"],
    });
    socket.on("request", (data: any) => {
      console.log("Connected Successfully!.");
    });
    socket.on(window.sessionStorage.getItem("uID"), (data: any) => {
      setNotification(`OrderId ${data[1]} is ready to pickup`);
      setTimeout(() => setNotification(""), 5000);
      setUpdateOrders(true);
    });
  }, []);

  const [tabIndex, setTabIndex] = useState(0);

  const onTabChange = (event: any, value: number) => {
    setTabIndex(value);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: 'center' }}>
          <Typography variant="h5">
            The Adludio Restaurant
        </Typography>
        </Toolbar>
      </AppBar>
      {notification && <Alert severity="success">{notification}</Alert>}
      <AppBar position="static" style={{ backgroundColor: 'grey' }}>
        <Tabs
          value={tabIndex}
          onChange={onTabChange}
        >
          <Tab label="Menu" />
          <Tab label="Order Status" />
        </Tabs>
      </AppBar>
      {
        tabIndex === 0 ? <Menu /> : <OrderStatus updateOrders={updateOrders} setUpdateOrders={setUpdateOrders} />
      }
    </div>
  );
}

export default App;;