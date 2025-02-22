import http from "http";
import { WebSocketServer, WebSocket } from "ws";

const server = http.createServer(function(req,res){
    res.end("hi");
})

const wss = new WebSocketServer({ server });


function handleWebsocketMessageEvent(message: any){

}

function handleWebsocketCloseEvent(ws: WebSocket){

}


wss.on("connection",(ws) =>{
    ws.send(JSON.stringify({msg :"Connected to the ws successfully"}));
    ws.on("error",(error)=>console.log(error));
    ws.on("message", (message)=>{
        handleWebsocketMessageEvent(message);
    })
    ws.on("close", ()=>{
        handleWebsocketCloseEvent(ws)
    })
})


server.listen(8080,()=>{
    console.log("Ws server is listening on port 8080");
})

