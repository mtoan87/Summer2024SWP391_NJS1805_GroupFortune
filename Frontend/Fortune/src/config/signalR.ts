import * as signalR from "@microsoft/signalr";

document.addEventListener('DOMContentLoaded', function () {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/biddingHub")
        .build();

    connection.start().then(() => {
        console.log("SignalR connected");
    }).catch(err => console.error("SignalR connection error: ", err));

    connection.on("RefreshHighestPrice", () => {
        refreshHighestPrice();
    });

    function refreshHighestPrice() {
        
    }

});
