import React, { useEffect, useState } from 'react';
import logo from './logo.png';
import './App.css';
import { AppBar, Tab, Tabs, Toolbar, Typography } from '@material-ui/core';
import Menu from './pages/menu';
import OrderStatus from './pages/order-status';
import { io as socketIOClient } from 'socket.io-client';

function App() {

  useEffect(() => {
    let socket: any;
    socket = socketIOClient("http://localhost:4848/", {
      transports: ["websocket"],
    });
    socket.on("request", (data: any) => {
      console.log("Connected Successfully!.");
    });
    console.log(window.sessionStorage.getItem("uID"));
    socket.on(window.sessionStorage.getItem("uID"), (data: any) => {
      console.log("websocket");
      console.log(data);
      // fetchPhotographerTodayShoots(photographerId);
    });
  });

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
        tabIndex === 0 ? <Menu /> : <OrderStatus />
      }
    </div>
  );
}

export default App;;