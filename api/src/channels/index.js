module.exports = (io) => {
    io.on("connection", (socket) => {
        socket.emit("request", (data) => {
            return "Connected!!";
        });
        socket.on("disconnect", () => {
            console.log("client disconnected");
        });
    });
};