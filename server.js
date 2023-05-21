const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

//const path = require('path');
const PORT = process.env.PORT || 3000;

//TODO Set static folder
//app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(__dirname + '/public/'));
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

            console.log("myTurn", userInfo[indexOfFreeConnection].isPlayerTurn);
            console.log("enTurn", userInfo[indexOfFreeConnection + tempIndOponent].isPlayerTurn);
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
        1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
        1, 20, 20, 20, 20, 1, 0, 0, 0, 0,
        1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]
    let boardTestFull = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 3, 3, 4, 4, 2, 0, 0, 0, 0,
        0, 3, 0, 0, 0, 0, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 1, 5, 1, 0,
        0, 0, 0, 0, 0, 0, 1, 5, 1, 0,
        0, 0, 0, 0, 0, 0, 1, 5, 1, 0,
        0, 0, 0, 0, 0, 0, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 5
    ]

    userInfo[indexOfFreeConnection].board = boardTest //boardTestZero//TODO TESTS ONLY

    socket.on('generate', (shipId, length) => {
        generate_server(userInfo[indexOfFreeConnection].board, shipId, length)
        socket.emit('boardTest', userInfo[indexOfFreeConnection].board)
    })

    socket.on('clean', () => {
        clean_server(userInfo[indexOfFreeConnection].board)
        socket.emit('boardTest', userInfo[indexOfFreeConnection].board)
    })

    socket.on('fire', (sqId) => {
        // if (userInfo[indexOfFreeConnection].isPlayerTurn == false) {
        //     return //TODO NOT WORKING SECOND PLAYERS IN BOTH GAMES
        // }
        //sqId = Number(sqId) //01-09 not working
        enemyBoard = userInfo[indexOfFreeConnection + tempIndOponent].board
        sqShipId = enemyBoard[sqId] % 10
        console.log(sqShipId);
        if (enemyBoard[sqId] >= 20 && enemyBoard[sqId].toString()[0] == 2) {
            //console.log("dead", isShipDead_server(enemyBoard, sqShipId), enemyBoard[sqId]);
            if (isShipDead_server(enemyBoard, sqShipId)) {
                console.log('ShipDead', sqShipId);
                io.in(roomName).emit('shipCheackerByIdDead', playerNumber, sqShipId)
                for (let i = 0; i < enemyBoard.length; i++) {
                    if ((enemyBoard[i].toString()[0] == 4 || enemyBoard[i].toString()[0] == 2) && enemyBoard[i].toString()[1] == sqShipId) {
                        enemyBoard[i] = 50 + enemyBoard[i] % 10
                        io.in(roomName).emit('fireAnswer', i, 50 + enemyBoard[i] % 10);
                        //socket.emit('fireAnswer', i, 50 + enemyBoard[i] % 10)
                    }
                }

                //io.in(roomName).emit('createMissAroundDeadSquares', enemyBoard);
                for (let i = 0; i < 100; i++) {
                    aroundPainter(i)
                }

                function aroundPainter(i) {
                    for (let k = -10; k <= 10; k += 10) {
                        for (let g = -1; g <= 1; g++) {
                            if (i + k + g >= 0 && i + k + g < 100) {
                                if (Math.floor(i / 10) === Math.floor((i + g) / 10)) {
                                    if (enemyBoard[i + k + g].toString()[0] == 5 && enemyBoard[i].toString()[0] != 5) {
                                        enemyBoard[i] = 30;
                                        io.in(roomName).emit('fireAnswer', i, 30);
                                        return
                                        //socket.emit('fireAnswer', i, 30)
                                    }
                                }
                            }
                        }
                    }
                }

                if (isGameOver(enemyBoard)) {
                    console.log('GameOver');
                    userInfo[indexOfFreeConnection + tempIndOponent].board[sqId] = enemyBoard[sqId]
                    io.in(roomName).emit('gameOver');
                    socket.to(roomName).emit('showAliveShips', userInfo[indexOfFreeConnection].board);
                    return
                }

            }
            else {
                console.log('4');
                enemyBoard[sqId] = 40 + enemyBoard[sqId] % 10
                io.in(roomName).emit('fireAnswer', sqId, 40 + enemyBoard[sqId] % 10);
                //socket.emit('fireAnswer', sqId, 40 + enemyBoard[sqId] % 10)
            }
        }
        else {
            console.log('3');
            console.log("fA", sqId);

            //socket.to(roomName).emit('fireAnswer', sqId, 30);
            //io.in(roomName).emit('fireAnswer', 99, 30);

            //userInfo[indexOfFreeConnection].isPlayerTurn = !userInfo[indexOfFreeConnection].isPlayerTurn
            //userInfo[indexOfFreeConnection + tempIndOponent].isPlayerTurn = !userInfo[indexOfFreeConnection + tempIndOponent].isPlayerTurn
            io.in(roomName).emit('fireAnswer', sqId, 30);
            io.in(roomName).emit('nextTurn');
        }

        //io.in('room').emit('nextTurn');
        //socket.emit('fireAnswer', sqId, 3);
        userInfo[indexOfFreeConnection + tempIndOponent].board[sqId] = enemyBoard[sqId]
    })

    // socket.on('shipCheckerToEnemy', () => {
    //     socket.to(roomName).emit('shipCheckerToEnemyAnswer');
    // })
    socket.on('DragDropByHand', (MyBoard) => {
        console.log('DragDropByHand');

        userInfo[indexOfFreeConnection].board = MyBoard
    })

    function enemyDisconnect() {
        if (userInfo[indexOfFreeConnection + tempIndOponent].statusInfo.conn == true) {
            console.log('enemyDisconnect');
            userInfo[indexOfFreeConnection].statusInfo = { conn: false, ready: false }
            socket.to(roomName).emit('check-player-answer', userInfo[indexOfFreeConnection], userInfo[indexOfFreeConnection + tempIndOponent].statusInfo)
            io.in(roomName).disconnectSockets(true);
        }
    }

    socket.on('enemyDisconnect', () => {
        enemyDisconnect()
    })

    socket.on('disconnect', () => {
        //socket.leave(roomName);//TODO keep raim ONLY if enemyDisconnect() exist.
        enemyDisconnect()
        console.log(`Player${indexOfFreeConnection} disconnected from Room${gamesArrWaitIndex}`);
        gamesArr[gamesArrWaitIndex] = false
        connections[indexOfFreeConnection] = undefined
        userInfo[indexOfFreeConnection] = undefined;
        //turnArr[indexOfFreeConnection] = undefined
        //console.log("\n\n", socket.adapter.rooms, "\n\n");
    })


    function isShipDead_server(GridSquares, sqShipIndNum) {
        //console.log(GridSquares);
        //console.log("sqShipIndNum", sqShipIndNum);
        let alivePalubCounter = 0
        for (let i = 0; i < GridSquares.length; i++) {
            // if (1) {

            //     console.log(GridSquares[i] % 10);
            // }
            // return false
            if (GridSquares[i].toString()[1] == sqShipIndNum && GridSquares[i].toString()[0] == 2) {
                //console.log(GridSquares[i]);
                alivePalubCounter += 1
            }
        }
        console.log("alivePalubCounter", alivePalubCounter);
        if (alivePalubCounter <= 1) {
            return true
        } else {
            return false
        }
    }



    function isGameOver(GridSquares) {
        for (let i = 0; i < GridSquares.length; i++) {
            if (GridSquares[i].toString()[0] == 2) {
                return false
            }
        }
        return true
    }




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
    // https://socket.io/docs/v4/emit-cheatsheet/
    // io.in('room').emit('event', data);

    // // basic emit back to sender
    // socket.emit(/* ... */);
    //
    // // to all clients in the current namespace except the sender
    // socket.broadcast.emit(/* ... */);
    //
    // // to all clients in room1 except the sender
    // socket.to("room1").emit(/* ... */);
    //
    // // to all clients in room1 and/or room2 except the sender
    // socket.to(["room1", "room2"]).emit(/* ... */);
    //
    // // to all clients in room1
    // io.in("room1").emit(/* ... */);


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