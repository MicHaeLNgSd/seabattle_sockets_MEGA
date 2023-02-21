const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const path = require('path');
const PORT = process.env.PORT || 3000;

//TODO Set static folder
app.use(express.static(path.join(__dirname, "public")));
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public/main.js'))
// })

//TODO Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}. Link: http://localhost:${PORT}`));

gamesArr = []; // 1 play 0 wait
connections = [];
let userInfo = [];

io.on('connection', (socket) => {
    //TODO indexOfFreeConnection
    let indexOfFreeConnection = connections.indexOf(undefined);
    (indexOfFreeConnection == -1) ? indexOfFreeConnection = parseInt(connections.length) : console.log("   Re:Connection");
    connections[indexOfFreeConnection] = socket

    let gamesArrWaitIndex = gamesArr.indexOf(false);
    (gamesArrWaitIndex == -1) ? gamesArrWaitIndex = parseInt(gamesArr.length) : console.log("   Re:UseOldRoom");
    socket.join(`Room${gamesArrWaitIndex}`);
    console.log(`Player ${indexOfFreeConnection} connected to Room${gamesArrWaitIndex}`);
    //console.log("\n\n", socket.adapter.rooms, "\n\n");

    let playerNumber = 0

    if (io.sockets.adapter.rooms.get(`Room${gamesArrWaitIndex}`).size == 2) {
        gamesArr[gamesArrWaitIndex] = true
        console.log(`Game ${gamesArrWaitIndex} is full`);
        playerNumber = 2
    }
    else if (io.sockets.adapter.rooms.get(`Room${gamesArrWaitIndex}`).size == 1) { // TODO can be optomized
        playerNumber = 1
    }

    userInfo[indexOfFreeConnection] = { name: undefined, statusInfo: { conn: false, ready: false }, board: undefined } // TODO Can be changet to null (for example)


    socket.emit('player-start', playerNumber)
    socket.on('check-player', (currentUserName) => {
        userInfo[indexOfFreeConnection].statusInfo.conn = true;
        userInfo[indexOfFreeConnection].name = currentUserName;

        let tempIndOponent = (playerNumber == 2) ? -1 : +1;
        socket.emit('check-player-answer', userInfo[indexOfFreeConnection + tempIndOponent], userInfo[indexOfFreeConnection].statusInfo)
        socket.to(`Room${gamesArrWaitIndex}`).emit('tell-another-player', userInfo[indexOfFreeConnection])
    })

    socket.on('player-ready', plN => {
        userInfo[indexOfFreeConnection].statusInfo.ready = true;
        socket.to(`Room${gamesArrWaitIndex}`).emit('player-ready-answer', plN)
    })


    socket.on('disconnect', () => {
        socket.leave(`Room${gamesArrWaitIndex}`);
        console.log(`Player${indexOfFreeConnection} disconnected from Room${gamesArrWaitIndex}`);
        gamesArr[gamesArrWaitIndex] = false
        connections[indexOfFreeConnection] = undefined
        userInfo[indexOfFreeConnection] = undefined;

        //console.log("\n\n", socket.adapter.rooms, "\n\n");

    })

    //TODO Warnings:
    // All users MUST leave the room if one of them leaved !! (Because new connection will always create a "2" playerNum )



    //====================================================
    //aga = [{ ag: { p1: undefined, p2: undefined } }]

    // {  { p1:{ playerInfo:{ name:'', numer:-1 }, statusInfo:{ conn:false, ready:false }, board:board },
    //      p2:{ playerInfo:{ name:'', numer:-1 }, statusInfo:{ conn:false, ready:false }, board:board }  },...}
    //playerFullInfo = [] //{{ name:'', numer:-1 },{ conn:false, ready:false }}
    // { name:'', numer:-1 }
    //statusInfo = [] //{ conn:false, ready:false }

    //console.log("\n\n", findClientsSocket(`Room${gamesArrWaitIndex}`), "\n\n");
    // console.log("\n\n", io.in(`Room${gamesArrWaitIndex}`).fetchSockets()
    //     .then((sockets) => {
    //         sockets.forEach((socket) => {
    //             console.log(socket);
    //         })
    //     })
    //     , "\n\n");
    //userInfo[indexOfFreeConnection].statusInfo.conn = false;



    // function findClientsSocket(roomId, namespace) {
    //     var res = [], ns = io.of(namespace || "/");
    //     if (ns) {
    //         for (var id in ns.connected) {
    //             if (roomId) {
    //                 var index = ns.connected[id].rooms.indexOf(roomId);
    //                 if (index !== -1) {
    //                     res.push(ns.connected[id]);
    //                 }
    //             } else {
    //                 res.push(ns.connected[id]);
    //             }
    //         }
    //     }
    //     return res;
    // }

    //====================================================


    // let findFreeGameIndex = aga.findIndex((e, i) => (aga[i].ag.p1 == undefined || aga[i].ag.p2 == undefined))
    // if (findFreeGameIndex == -1) {
    //     aga.push({ ag: { p1: undefined, p2: undefined } })
    //     findFreeGameIndex = parseInt(aga.length) - 1
    // }

    // let currentGame = aga[findFreeGameIndex]
    // let currentGamePlayerIndex = Object.values(currentGame.ag).findIndex((e) => (e == undefined))
    // let currentGamePlayerKey = Object.keys(currentGame.ag)[currentGamePlayerIndex]
    // let currentGameEnemyKey

    // currentGame.ag[currentGamePlayerKey] = { num: indexOfFreeConnection, name: `KMG${indexOfFreeConnection}`, statusInfo: { conn: true, ready: false }, board: "board" }
    // socket.emit('player-start', indexOfFreeConnection)
    // socket.on('check-player', () => {
    //     currentGameEnemyKey = Object.keys(currentGame.ag)[Object.keys(currentGame.ag).findIndex((e) => (e != currentGamePlayerKey))]
    //     let InfoArr = { me: currentGame.ag[currentGamePlayerKey], enemy: currentGame.ag[currentGameEnemyKey] }
    //     socket.broadcast.emit('tell-another-player', currentGame.ag[currentGamePlayerKey])
    //     socket.emit('check-player-answer', InfoArr)
    //     socket.on('save-name', (player1Name) => {
    //         currentGame.ag[currentGamePlayerKey].name = player1Name
    //     })
    // })


});

// io.of("/").adapter.on("create-room", (room) => {
//     console.log(`room ${room} was created`);
// });
// io.of("/").adapter.on("delete-room", (room) => {
//     console.log(`room ${room} was deleted`);
// });
// io.of("/").adapter.on("join-room", (room, id) => {
//     console.log(`socket ${id} has joined room ${room}`);
// });
// io.of("/").adapter.on("leave-room", (room, id) => {
//     console.log(`socket ${id} has leave room ${room}`);
// });