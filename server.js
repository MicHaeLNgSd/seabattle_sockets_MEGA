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
//turnArr = [];
connections = [];
let userInfo = [];

io.on('connection', (socket) => {
    //TODO indexOfFreeConnection
    let indexOfFreeConnection = connections.indexOf(undefined);
    (indexOfFreeConnection == -1) ? indexOfFreeConnection = parseInt(connections.length) : console.log("   Re:Connection");
    connections[indexOfFreeConnection] = socket

    let gamesArrWaitIndex = gamesArr.indexOf(false);
    let roomName = `Room${gamesArrWaitIndex}`;

    (gamesArrWaitIndex == -1) ? gamesArrWaitIndex = parseInt(gamesArr.length) : console.log("   Re:UseOldRoom");
    socket.join(roomName);
    console.log(`Player ${indexOfFreeConnection} connected to Room${gamesArrWaitIndex}`);
    //console.log("\n\n", socket.adapter.rooms, "\n\n");

    let playerNumber = 0
    let tempIndOponent


    if (io.sockets.adapter.rooms.get(roomName).size == 2) {
        gamesArr[gamesArrWaitIndex] = true
        console.log(`Game ${gamesArrWaitIndex} is full`);
        playerNumber = 2
    }
    else if (io.sockets.adapter.rooms.get(roomName).size == 1) { // TODO can be optomized
        playerNumber = 1
    }

    userInfo[indexOfFreeConnection] = { name: undefined, statusInfo: { conn: false, ready: false }, board: undefined, isPlayerTurn: undefined } // TODO Can be changet to null (for example)

    userInfo[indexOfFreeConnection].isPlayerTurn = (playerNumber == 1)
    socket.emit('player-start', playerNumber, userInfo[indexOfFreeConnection].isPlayerTurn)
    socket.on('check-player', (currentUserName) => {
        userInfo[indexOfFreeConnection].statusInfo.conn = true;
        userInfo[indexOfFreeConnection].name = currentUserName;
        //userInfo[indexOfFreeConnection].isPlayerTurn = (playerNumber == 1)

        tempIndOponent = (playerNumber == 2) ? -1 : +1;
        socket.emit('check-player-answer', userInfo[indexOfFreeConnection + tempIndOponent], userInfo[indexOfFreeConnection].statusInfo)
        socket.to(roomName).emit('tell-another-player', userInfo[indexOfFreeConnection])
    })

    socket.on('player-ready', plN => {
        userInfo[indexOfFreeConnection].statusInfo.ready = true;
        socket.to(roomName).emit('player-ready-answer', plN)

        if (userInfo[indexOfFreeConnection + tempIndOponent] && userInfo[indexOfFreeConnection + tempIndOponent].statusInfo.ready === true) {//TODO bug no another unit => statusInfo = undefined
            userInfo[indexOfFreeConnection].statusInfo

            console.log(userInfo[indexOfFreeConnection].isPlayerTurn);
            //turnArr[indexOfFreeConnection] = false
            //io.in(roomName).emit('nextTurn');
            //io.in(roomName).emit('start-game', userInfo[indexOfFreeConnection].isPlayerTurn);
            io.in(roomName).emit('start-game');

        }
    })

    let boardTestZero = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]
    let boardTest = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]
    // let boardTestFull = [
    //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //     0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    //     0, 3, 3, 4, 4, 2, 0, 0, 0, 0,
    //     0, 3, 0, 0, 0, 0, 1, 1, 1, 0,
    //     0, 0, 0, 0, 0, 0, 1, 5, 1, 0,
    //     0, 0, 0, 0, 0, 0, 1, 5, 1, 0,
    //     0, 0, 0, 0, 0, 0, 1, 5, 1, 0,
    //     0, 0, 0, 0, 0, 0, 1, 1, 1, 0,
    //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //     0, 0, 0, 0, 0, 0, 0, 0, 0, 5
    // ]

    userInfo[indexOfFreeConnection].board = boardTestZero

    socket.on('generate', (shipId, length) => {
        generate_server(userInfo[indexOfFreeConnection].board, shipId, length)
        socket.emit('boardTest', userInfo[indexOfFreeConnection].board)
    })

    socket.on('clean', () => {
        clean_server(userInfo[indexOfFreeConnection].board)
        socket.emit('boardTest', userInfo[indexOfFreeConnection].board)
    })

    socket.on('fire', (sqId) => {
        //console.log(sqId, userInfo[indexOfFreeConnection + tempIndOponent].board);
        if (userInfo[indexOfFreeConnection + tempIndOponent].board[sqId] > 9 && userInfo[indexOfFreeConnection + tempIndOponent].board[sqId].toString()[0] == 2) {
            // if (isShipDead_server()) {
            //     checkShipDead_server(socket.emit('fireAnswer', sqId, 5))
            // } else {
            socket.emit('fireAnswer', sqId, 4)
            //}
        } else {
            //socket.emit
            socket.emit('fireAnswer', sqId, 3);
            userInfo[indexOfFreeConnection].isPlayerTurn = !userInfo[indexOfFreeConnection].isPlayerTurn

            //turnArr[indexOfFreeConnection] = !turnArr[indexOfFreeConnection]
            //console.log(userInfo[indexOfFreeConnection].isPlayerTurn);
            io.in(roomName).emit('nextTurn');
        }

        //io.in('room').emit('nextTurn');
        //socket.emit('fireAnswer', sqId, 3);
    })



    socket.on('disconnect', () => {
        socket.leave(roomName);
        console.log(`Player${indexOfFreeConnection} disconnected from Room${gamesArrWaitIndex}`);
        gamesArr[gamesArrWaitIndex] = false
        connections[indexOfFreeConnection] = undefined
        userInfo[indexOfFreeConnection] = undefined;
        //turnArr[indexOfFreeConnection] = undefined
        //console.log("\n\n", socket.adapter.rooms, "\n\n");
    })











    function clean_server(GridSquares) {
        for (let i = 0; i < GridSquares.length; i++) {
            GridSquares[i] = 0
        }
    }

    function generate_server(GridSquares, shipId, shipByIdChildCount) {
        //let shipById = document.querySelector(`[id="${shipId}"]`);
        let randomStart = Math.abs(Math.floor(Math.random() * GridSquares.length));
        let randomDirection = Math.round(Math.random());

        let shipStartY
        let shipEndY
        let step

        //console.log(randomStart, randomDirection, shipByIdChildCount);
        if (randomDirection === 0) {
            step = 1
            shipStartY = Math.floor(randomStart / 10)
            shipEndY = Math.floor((randomStart + shipByIdChildCount) / 10)

            for (let i = randomStart; i < (randomStart + shipByIdChildCount); i++) {
                if (GridSquares[i] !== 0 || shipStartY != shipEndY || randomStart + shipByIdChildCount > GridSquares.length - 1) {
                    generate_server(GridSquares, shipId, shipByIdChildCount)
                    return
                }
            }
        }
        if (randomDirection === 1) {
            step = 10

            for (let i = randomStart; i < (randomStart + shipByIdChildCount * step); i += step) {
                if (GridSquares[i] !== 0 || randomStart + shipByIdChildCount * step - 10 > GridSquares.length - 1) {
                    generate_server(GridSquares, shipId, shipByIdChildCount)
                    return
                }
            }
        }
        for (let i = randomStart; i < (randomStart + shipByIdChildCount * step); i += step) {
            GridSquares[i] = 2 * 10 + shipId;
            //GridSquares[i].classList.add(`${shipId}`);
        }
        for (let i = 0; i < 100; i++) {
            for (let k = -10; k <= 10; k += 10) {
                for (let g = -1; g <= 1; g++) {

                    if (i + k + g >= 0 && i + k + g < 100) {

                        if (Math.floor(i / 10) === Math.floor((i + g) / 10)) {

                            if (GridSquares[i + k + g].toString()[0] == 2 && GridSquares[i].toString()[0] != 2) {

                                GridSquares[i] = 1;
                            }
                        }
                    }
                }
            }
        }
    }





    // for (let i = 1; i <= countShips; i++) {
    //     //generate(squares, shipIdGenerator(i))
    // }












    //TODO Warnings:
    // All users MUST leave the room if one of them leaved !! (Because new connection will always create a "2" playerNum )

    //io.in('room').emit('event', data);


    //====================================================

    // let boardTest2 = [
    //     'square', 'miss', 'square', 'square', 'square', 'square', 'square', 'square', 'square', 'square',
    //     'square', 'taken', 'taken', 'taken', 'square', 'square', 'square', 'square', 'square', 'square',
    //     'square', 'taken', 'takenByShip', 'taken', 'square', 'square', 'square', 'square', 'square', 'square',
    //     'square', 'taken', 'taken', 'taken', 'square', 'square', 'square', 'square', 'square', 'square',
    //     'square', 'miss', 'square', 'square', 'square', 'square', 'square', 'square', 'square', 'square',
    //     'square', 'boom', 'square', 'square', 'square', 'square', 'square', 'square', 'square', 'square',
    //     'square', 'boom', 'square', 'square', 'square', 'square', 'miss', 'miss', 'miss', 'square',
    //     'square', 'boom', 'square', 'square', 'square', 'square', 'miss', 'dead', 'miss', 'square',
    //     'square', 'takenByShip', 'square', 'square', 'square', 'square', 'miss', 'miss', 'miss', 'square',
    //     'square', 'square', 'square', 'square', 'square', 'square', 'square', 'square', 'square', 'square',
    // ]
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