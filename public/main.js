console.log("main.js is connected!)");

//TODO 
// MobileDragDrop.polyfill({
//     dragImageTranslateOverride: MobileDragDrop.scrollBehaviourDragImageTranslateOverride
// });
// window.addEventListener('touchmove', function () { }, { passive: false });

const turnDisplay = document.querySelector('#whose-go')
const userGrid = document.querySelector('.user-grid')
const computerGrid = document.querySelector('.computer-grid')
const userShipsArea = document.querySelector('.user-ships')
const computerShipsArea = document.querySelector('.computer-ships')
const ships = document.querySelectorAll('.ship')
const AllSquares = document.querySelectorAll('.square')

const startG = document.querySelector("#playGame");
const randForMe = document.querySelector("#randForMe");
const CleanMe = document.querySelector("#cleanMe");
const restartBtn = document.querySelector("#restart");

var userSquares = []
var computerSquares = []
const width = 10
const countShips = 10
let isGameOver = false;
let isPlayer1 = true;
let sqSelector;
let gamemode = ""

// const randForEnemy = document.querySelector("#randForEnemy").addEventListener("click", () => createShips(computerSquares));;
// const CleanEnemy = document.querySelector("#cleanEnemy").addEventListener("click", () => cleanBoard(computerSquares));


//TODO Buttons
document.addEventListener("DOMContentLoaded", function () {
    startG.disabled = true
    //startG.setAttribute("disabled", "disabled")
    rotateBtn.disabled = true
    CleanMe.disabled = true
    restartBtn.classList.add("invisible")
})

//startG.addEventListener("click", playGameBtn);
randForMe.addEventListener("click", () => createShips(userSquares));
CleanMe.addEventListener("click", () => cleanBoard(userSquares));
restartBtn.addEventListener("click", restart);

//TODO Create Board
function createBoard(grid, squares) {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < width; j++) {
            const square = document.createElement('div')
            square.dataset.y = i
            square.dataset.x = j
            square.classList.add("square")
            grid.appendChild(square)
            squares.push(square)
        }
    }
}
createBoard(userGrid, userSquares)
createBoard(computerGrid, computerSquares)


//TODO Generate     //generate(userSquares, "ship10");
function generate(GridSquares, shipId) {
    let randomDirection = Math.round(Math.random());
    let shipById = document.querySelector(`[id="${shipId}"]`);
    let randomStart = Math.abs(Math.floor(Math.random() * GridSquares.length));
    let shipStartY
    let shipEndY
    let step

    if (randomDirection === 0) {
        step = 1
        shipStartY = Math.floor(randomStart / 10)
        shipEndY = Math.floor((randomStart + shipById.childElementCount - 1) / 10)

        for (let i = randomStart; i < (randomStart + shipById.childElementCount); i++) {
            if (GridSquares[i].classList.contains("taken") || shipStartY != shipEndY || randomStart + shipById.childElementCount > GridSquares.length - 1) {
                generate(GridSquares, shipId)
                return
            }
        }
    }
    if (randomDirection === 1) {
        step = 10

        for (let i = randomStart; i < (randomStart + shipById.childElementCount * step); i += step) {
            if (GridSquares[i].classList.contains("taken") || randomStart + shipById.childElementCount * step - 10 > GridSquares.length - 1) {
                generate(GridSquares, shipId)
                return
            }
        }
    }
    for (let i = randomStart; i < (randomStart + shipById.childElementCount * step); i += step) {
        GridSquares[i].classList.add('takenByShip');
        GridSquares[i].classList.add(`${shipId}`);
    }
    for (let i = 0; i < 100; i++) {
        for (let k = -1; k <= 1; k++) {
            for (let g = -1; g <= 1; g++) {
                if (i + k * 10 + g >= 0 && i + k * 10 + g < 100) {
                    if (Math.floor(i / 10) === Math.floor((i + g) / 10)) {
                        if (GridSquares[i + k * 10 + g].classList.contains('takenByShip')) {
                            GridSquares[i].classList.add('taken');
                        }
                    }
                }
            }
        }
    }
}

function showMyShips(squares) {
    squares.forEach(square => {
        if (square.classList.contains("takenByShip")) {
            square.classList.add("MyShips")
        }
    })
}

function shipIdGenerator(numSq, numShip) {
    return `${(numSq ? 'enemyS' : 's') + 'hip' + numShip}`
}

function shipSectionIdGenerator(numSq, numShip) {
    let step = { 1: 1, 2: 2, 3: 2, 4: 3, 5: 3, 6: 3, 7: 4, 8: 4, 9: 4, 10: 4 }[numShip]; //ship:section
    return `${(numSq ? 'e' : '') + 'ship-section' + step}`
}

function createShips(squares) {
    sqSelector = (squares !== userSquares);
    cleanBoard(squares);

    for (let i = 1; i <= countShips; i++) {
        generate(squares, shipIdGenerator(sqSelector, i))
    }
    if (!sqSelector) {
        showMyShips(squares)
        startG.disabled = false
        turnDisplay.innerHTML = 'Натисніть Старт';
        //turnDisplay.innerHTML = 'Press Start';
    }

    shipChecker(squares);
    rotateBtn.disabled = true
}


//TODO Clean
function cleanBoard(squares) {
    sqSelector = (squares !== userSquares); //because it can be press after another createShips pressed
    squares.forEach(square => {
        square.className = ""
        square.classList.add('square')
    })
    removeShipChecker(squares);

    if (!sqSelector) {
        cleanBoardFromObj()
        turnDisplay.innerHTML = 'Розставте кораблі';
        removeDragDrop()
    }
    CleanMe.disabled = true
    rotateBtn.disabled = true
    startG.disabled = true
    //turnDisplay.innerHTML = 'Place Ships';
}

function cleanBoardFromObj() {
    let section
    for (let i = 1; i <= countShips; i++) {
        shipById = document.querySelector(`[id="${shipIdGenerator(0, i)}"]`)
        section = document.querySelector(`.${shipSectionIdGenerator(0, i)}`)
        console.log('section', section);
        section.append(shipById)
    }
    myShips.forEach(ship => {
        ship.classList.remove('ship-vertical');
    });
    myShipSection.forEach(sec => {
        sec.classList.remove('ship-section-vertical');
    });
    userShipsArea.classList.remove('user-ships-vertical');
    isHorizontal = true
}


//TODO Checkers
function shipChecker(squares) { //squares
    sqSelector = (squares !== userSquares);
    for (let i = 1; i <= countShips; i++) {
        shipById = document.querySelector(`[id="${shipIdGenerator(sqSelector, i)}"]`)
        shipById.classList.add('ship-checker')
    }
}

function removeShipChecker(squares) { //squares
    sqSelector = (squares !== userSquares);
    for (let i = 1; i <= countShips; i++) {
        shipById = document.querySelector(`[id="${shipIdGenerator(sqSelector, i)}"]`)
        shipById.classList.remove('ship-checker')
        shipById.classList.remove('ship-checker-dead')
    }
}

function checkerDead(GridSquares) {
    sqSelector = (GridSquares !== userSquares);

    for (let i = 1; i <= countShips; i++) {
        let JSchecker = true;
        GridSquares.forEach(sq => {
            if (sq.classList.contains(`${shipIdGenerator(sqSelector, i)}`)) {
                if (!sq.classList.contains('boom')) {
                    JSchecker = false
                }
            }
        })
        if (JSchecker) {
            GridSquares.forEach(sq => {
                if (sq.classList.contains(`${shipIdGenerator(sqSelector, i)}`)) {
                    sq.classList.add('dead')
                }
            })

            shipById = document.querySelector(`[id="${shipIdGenerator(sqSelector, i)}"]`)
            shipById.classList.add('ship-checker-dead')

            for (let i = 0; i < 100; i++) {
                for (let k = -1; k <= 1; k++) {
                    for (let g = -1; g <= 1; g++) {
                        if (i + k * 10 + g >= 0 && i + k * 10 + g < 100) {
                            if (Math.floor(i / 10) === Math.floor((i + g) / 10)) {
                                if (GridSquares[i + k * 10 + g].classList.contains('dead')) {
                                    GridSquares[i].classList.add('miss');
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return
}

function isShipsOnField(GridSquares) {
    for (let i = 0; i < GridSquares.length; i++) {
        if (GridSquares[i].classList.contains("takenByShip")) {
            return true;
        }
    }
    return false;
}


//TODO Game Start Logic
function playGameBtn() { //TODO playGameBtn
    gamemode = 'singlePlayer'
    //turnDisplay.innerHTML = 'Your Move';
    turnDisplay.innerHTML = 'Ваш Хід';
    isGameOver = false
    isPlayer1 = true

    randForMe.disabled = true
    CleanMe.disabled = true
    rotateBtn.disabled = true
    dragDropBtn.disabled = true

    myShips.forEach(ship => {
        ship.setAttribute('draggable', false);
    });

    if (!isShipsOnField(userSquares)) {
        createShips(userSquares)
    }
    if (!isShipsOnField(computerSquares)) {
        createShips(computerSquares)
    }

    cleanBoardFromObj()
    showMyShips(userSquares)
    shipChecker(userSquares)

    computerSquares.forEach(square => square.addEventListener('click', function (e) {
        playerGo(square);
    }))
}

//TODO Game Move Logic
function playGame() {
    if (isGameOver) return

    if (isPlayer1) {
        //turnDisplay.innerHTML = 'Your Move';
        turnDisplay.innerHTML = 'Ваш Хід';
    } else {
        //turnDisplay.innerHTML = 'Your Move';
        turnDisplay.innerHTML = 'Хід Суперника';
        setTimeout(computerGo, 500)
    }
}

function playerGo(square) {
    if (isGameOver ||
        !isPlayer1 ||
        square.classList.contains('boom') ||
        square.classList.contains('miss')) {
        return
    }
    if (square.classList.contains('takenByShip')) {
        square.classList.add('boom')
        checkerDead(computerSquares)
        checkGameOver()

        return
    } else {
        square.classList.add('miss')
    }

    isPlayer1 = false;
    playGame();
}

function computerGo() {
    if (isGameOver) return
    let coord = Math.floor(Math.random() * userSquares.length);
    let boom1
    let isAI = false
    for (let i = 0; i < 100; i++) {
        if (userSquares[i].classList.contains('boom') && !userSquares[i].classList.contains('dead')) {
            boom1 = i
            isAI = true
            break
        }
    }
    if (isAI) {
        coord = computerAI(boom1)
    }
    if (userSquares[coord].classList.contains('boom') || userSquares[coord].classList.contains('miss')) {
        return computerGo()
    } else {
        if (userSquares[coord].classList.contains('takenByShip')) {
            userSquares[coord].classList.add('boom')
            checkerDead(userSquares)
            checkGameOver()
            setTimeout(computerGo, 500)
            return
        } else {
            userSquares[coord].classList.add('miss')
        }
    }
    isPlayer1 = true;
    playGame()
}

function checkGameOver() {
    let userDeadShipsScore = 0
    let compDeadShipsScore = 0

    userSquares.forEach(sq => {
        if (sq.classList.contains('dead')) {
            userDeadShipsScore += 1
        }
    })

    computerSquares.forEach(sq => {
        if (sq.classList.contains('dead')) {
            compDeadShipsScore += 1
        }
    })

    if (userDeadShipsScore === 20 || compDeadShipsScore === 20) {
        //turnDisplay.innerHTML = userDeadShipsScore > compDeadShipsScore ? 'You Lose' : 'You Win';
        turnDisplay.innerHTML = userDeadShipsScore > compDeadShipsScore ? 'Ви Програли' : 'Ви Перемогли';

        isGameOver = true
        restartBtn.classList.remove("invisible")

        let shipGOVision = document.querySelectorAll('.computer-grid > .takenByShip')
        shipGOVision.forEach(ship => {
            if (!ship.classList.contains('boom')) {
                ship.classList.add("takenGOVision");
            }
        });
    }
}


//TODO ComputerAI
function computerAI(boomFirst) { //OPTIMIZED
    let boomLast
    let boom
    let directionTemp
    let rand
    let step

    for (let i = boomFirst + 1; i < 100; i++) {
        if (userSquares[i].classList.contains('boom') && !userSquares[i].classList.contains('dead')) {
            boomLast = i
        }
    }
    if (boomLast === undefined) {
        rand = Math.floor(Math.random() * 4);
        step = { 0: -10, 1: 1, 2: 10, 3: -1 }[rand]; // this is better then switch
        if (AILogicIsCanBePlaced(boomFirst, step)) {
            return boomFirst + step;
        }
        else {
            return computerAI(boomFirst);
        }
    }

    directionTemp = (boomLast - boomFirst < 10) ? 1 : 10
    rand = Math.floor(Math.random() * 2);
    step = rand ? -1 * directionTemp : 1 * directionTemp; // this is better then switch
    boom = (step > 0) ? boomLast : boomFirst;

    if (AILogicIsCanBePlaced(boom, step)) {
        return boom + step;
    }
    else {
        return computerAI(boomFirst);
    }
}

function AILogicIsCanBePlaced(boom, step) {
    return (boom + step >= 0 && boom + step < 100 &&
        !((boom % 10 === 0 && (boom + step) % 10 === 9) ||
            (boom % 10 === 9 && (boom + step) % 10 === 0)) &&
        !userSquares[boom + step].classList.contains('miss'))  //make faster can be deleted
}


//TODO DragDrop
const dragDropBtn = document.querySelector("#dragDrop");
dragDropBtn.addEventListener("click", dragDropFunc);

let draggedShip
let draggedShipLength
let currentSquare
let takingSectionId

let gameStart = false
let isHorizontal = true
//console.log(myShips);
let myShips = document.querySelectorAll('.user-ships > .ship-section > .ship')

function dragDropFunc() {
    cleanBoard(userSquares)
    rotateBtn.disabled = false

    console.log('dragDropFunc active');
    myShips.forEach(ship => {
        ship.setAttribute('draggable', true);
    });

    myShips.forEach(ship => {
        ship.addEventListener('dragstart', dragStart)
        ship.addEventListener('dragend', dragEnd)
        //ship.addEventListener('drag', drag)
    });

    userSquares.forEach(square => {
        square.addEventListener('dragenter', dragEnter)
        //square.addEventListener('dragleave', dragLeave)
        square.addEventListener('dragover', dragOver)
        square.addEventListener('drop', dragDrop)
    });

    ships.forEach(ship => ['touchstart', 'mousedown'].forEach(eventName => ship.addEventListener(eventName, (e) => {
        takingSectionId = parseInt(e.target.id.substr(-1))
        console.log("takingSection", takingSectionId)
    })))
}

function dragStart(e) {
    console.log('dragStart');

    draggedShip = this
    draggedShipLength = this.childElementCount
    this.classList.add("ship-active")
    e.dataTransfer.setData("ship", this.id);

    isHorizontal = !draggedShip.classList.contains('ship-vertical')
    console.log('isHorizontal', isHorizontal);

    for (let i = 0; i < 100; i++) {
        userSquares[i].classList.remove('taken')
        if (userSquares[i].classList.contains(`${this.id}`)) {
            userSquares[i].classList.remove('takenByShip')
            userSquares[i].classList.remove(`${this.id}`)
        }
    }

    for (let i = 0; i < 100; i++) {
        for (let k = -1; k <= 1; k++) {
            for (let g = -1; g <= 1; g++) {
                if (i + k * 10 + g >= 0 && i + k * 10 + g < 100) {
                    if (Math.floor(i / 10) === Math.floor((i + g) / 10)) {
                        if (userSquares[i + k * 10 + g].classList.contains('takenByShip')) {
                            userSquares[i].classList.add('taken');
                            userSquares[i].classList.add('MyTaken');
                        }
                    }
                }
            }
        }
    }
}

function dragEnter(e) {
    console.log('dragEnter');
    e.preventDefault();
    currentSquare = parseInt(this.dataset.y) * 10 + parseInt(this.dataset.x)
    // console.log("currentSquare", currentSquare)
}

// function dragLeave() {
//     console.log('dragLeave')
// }

function dragOver(e) {
    console.log('dragOver');
    e.preventDefault();
}

function dragDrop(e) {
    console.log('dragDrop', draggedShip);
    if (draggedShip !== undefined) {
        let step = (isHorizontal) ? 1 : 10;

        console.log('isHorizontal', isHorizontal)

        if (isHorizontal) {
            console.log(currentSquare, takingSectionId)
            let shipStartY = Math.floor((currentSquare - takingSectionId) / 10);
            let shipEndY = Math.floor((currentSquare - takingSectionId + draggedShipLength - 1) / 10);
            if (shipStartY !== shipEndY) {
                return;
            }
        }
        for (let i = currentSquare - takingSectionId * step; i < (currentSquare - (takingSectionId - draggedShipLength) * step); i += step) {
            if (userSquares[i].classList.contains("taken") || i > userSquares.length - 1) {
                console.log("return")
                return;
            }
        }

        let flag = e.dataTransfer.getData("ship");
        let ditem = document.querySelector(`[id="${flag}"]`)

        for (let i = currentSquare - takingSectionId * step; i < (currentSquare - (takingSectionId - draggedShipLength) * step); i += step) {
            console.log(currentSquare, takingSectionId, draggedShipLength, step)
            userSquares[i].classList.add("takenByShip")
            userSquares[i].classList.add(`${flag}`)
        }

        let y = Math.floor((currentSquare - takingSectionId * step) / 10);
        let x = (currentSquare - takingSectionId * step) % 10;

        let dsq = document.querySelector(`[data-y="${y}"][data-x="${x}"]`)
        dsq.append(ditem)

        if (document.querySelectorAll('.user-ships > .ship-section > .ship').length == 0) {
            startG.disabled = false
            //turnDisplay.innerHTML = 'Press Start';
            turnDisplay.innerHTML = 'Натисніть Старт';
            rotateBtn.disabled = true
        }
    }
    CleanMe.disabled = false
}

function dragEnd() {
    console.log('dragEnd');
    userSquares.forEach(square => {
        //square.className = ""
        square.classList.remove('MyTaken')
        draggedShip.classList.remove("ship-active")
    })
    draggedShip = undefined
}


//TODO Remove DragDrop
function removeDragDrop() {
    myShips.forEach(ship => {
        ship.setAttribute('draggable', false);
    });

    myShips.forEach(ship => {
        ship.removeEventListener('dragstart', dragStart)
        ship.removeEventListener('dragend', dragEnd)
        //ship.addEventListener('drag', drag)
    });

    userSquares.forEach(square => {
        square.removeEventListener('dragenter', dragEnter)
        //square.addEventListener('dragleave', dragLeave)
        square.removeEventListener('dragover', dragOver)
        square.removeEventListener('drop', dragDrop)
    });

    ships.forEach(ship => ship.removeEventListener('mousedown', (e) => {
        takingSectionId = parseInt(e.target.id.substr(-1))
        console.log("takingSection", takingSectionId)
    }))
}

//TODO Rotate
const rotateBtn = document.querySelector("#rotate");
rotateBtn.addEventListener("click", rotate);

let myShipSection = document.querySelectorAll('.user-ships > .ship-section')
let myShipsRotate

function rotate() {
    myShipsRotate = document.querySelectorAll('.user-ships > .ship-section > .ship')
    myShipsRotate.forEach(ship => {
        ship.classList.toggle('ship-vertical');
    });
    myShipSection.forEach(sec => {
        sec.classList.toggle('ship-section-vertical');
    });
    userShipsArea.classList.toggle('user-ships-vertical');
    //isHorizontal = !isHorizontal
}

//TODO Restart
function restart() {
    cleanBoard(userSquares)
    cleanBoard(computerSquares)

    randForMe.disabled = false
    dragDropBtn.disabled = false

    restartBtn.classList.add("invisible")
}

// generate(userSquares, "ship15");
// showMyShips(userSquares)



// con = [];
// console.log('con', con, con.length, con[0], con[1], con[2]);

// con[0] = 'hi'
// con.push('y')
// con[con.indexOf('hi')] = null
// //con.splice(con.indexOf('hi'), 1);

// console.log('con', con, con.length, con[0], con[1], con[2]);


//TODO New

//let playerArr = []
const user1name = document.querySelector("#user1name");
const user2name = document.querySelector("#user2name");

const singlePlayerBtn = document.querySelector("#singlePlayerBtn");
const multiPlayerBtn = document.querySelector("#multiPlayerBtn");

singlePlayerBtn.addEventListener('click', startSingleGame)
multiPlayerBtn.addEventListener('click', startMultiPlayer)


function settings(enemyName = "ENEMY") {
    //let currentUserName = document.querySelector("#currentUserName").value
    //user1name.innerHTML = currentUserName == "" ? "YOU" : currentUserName
    user2name.innerHTML = enemyName
}

function startSingleGame() {
    //settings("COMPUTER")

    gamemode = 'singlePlayer'
    startG.addEventListener("click", playGameBtn);
}

function playMultiPlayerGame() {
    console.log("START playMultiPlayerGame");
}

function playerReady(playerNumber) {
    //let player = `.p${parseInt(playerNumber)}`
    document.querySelector(`.p${playerNumber} .ready span`).classList.toggle('green')
}

function startMultiPlayer() {
    gamemode = 'multiPlayer'

    startG.addEventListener("click", () => {
        console.log("click", gamemode);
        playerReady(playerNum)
        socket.emit('player-ready', playerNum)
        playMultiPlayerGame()
    });

    const socket = io();

    let currentUserName = document.querySelector("#currentUserName").value
    let playerNum
    let enemyNum

    socket.on('player-start', (plNum) => {
        console.log('player-start');
        playerNum = plNum
        enemyNum = (plNum == 1) ? 2 : 1
        document.getElementById("title").innerHTML = `Pl${plNum}`
        document.querySelector(`.p${plNum}`).style.fontWeight = 'bold'
        socket.emit('check-player', currentUserName)
    })

    socket.on('check-player-answer', (OponentInfo, MyStatus) => {
        //console.log('check-player-answer');
        user1name.innerHTML = currentUserName == "" ? "YOU" : currentUserName //TODO can be rewrited to get name from seerver not from itself

        if (MyStatus.conn) {
            document.querySelector(`.p${playerNum} .connected span`).classList.add('green')
        }

        // if (typeof OponentInfo != 'undefined') {console.log("OponentInfo  is not null", OponentInfo);}

        if (OponentInfo) { //Fixed was (player number == 2) null but not null: typeof OponentInfo == 'null' //probably can create some bugs...

            if (OponentInfo.statusInfo.conn) {
                settings(OponentInfo.name == "" ? "OPONENT" : OponentInfo.name)
                document.querySelector(`.p${enemyNum} .connected span`).classList.add('green')
            }
            if (OponentInfo.statusInfo.ready) {
                document.querySelector(`.p${enemyNum} .ready span`).classList.add('green')
            }

        }

    })
    socket.on('tell-another-player', (OponentInfo) => {
        console.log('tell-another-player', OponentInfo);
        settings(OponentInfo.name == "" ? "OPONENT" : OponentInfo.name)

        if (OponentInfo.statusInfo.conn) {
            //console.log(playerNum, " ", document.querySelector(`.p${playerNum} .connected span`));
            document.querySelector(`.p${enemyNum} .connected span`).classList.add('green')
        }
    })

    socket.on('player-ready-answer', (plN) => {
        playerReady(plN)
    })














    //         //settings((InfoArr.enemy.name == undefined) ? `Player${InfoArr.enemy.num}` : InfoArr.enemy.name)


    //         socket.on('tell-another-player', (enemy) => {
    //             //settings((enemy.name == undefined) ? `Player${enemy.num}` : enemy.name)
    //             //console.log('enemy', enemy);
    //             playerTagName3(enemy.num, enemy.statusInfo)
    //         })

    //         function playerTagName(num, status) {
    //             let playerClass = `.p${(parseInt(num) % 2) + 1}`;
    //             console.log('pppppppp', `.p${(parseInt(num) % 2) + 1}`);
    //             document.querySelector(playerClass).style.fontWeight = 'bold'

    //             //console.log('status', status);

    //             if (status.conn == true) {
    //                 document.querySelector(`${playerClass} .connected span`).classList.toggle('green')
    //             }
    //             if (status.ready == true) {
    //                 document.querySelector(`${playerClass} .ready span`).classList.toggle('green')
    //             }
    //         }
    //         function playerTagName2(num, status) {
    //             let playerClass = `.p${parseInt(num) % 2 + 1}`

    //             if (status.conn == true) {
    //                 document.querySelector(`${playerClass} .connected span`).classList.toggle('green')
    //             }
    //             if (status.ready == true) {
    //                 document.querySelector(`${playerClass} .ready span`).classList.toggle('green')
    //             }
    //         }
    //         function playerTagName3(num, status) {
    //             let playerClass = `.p${parseInt(num) % 2 + 1}`

    //             if (status.conn == true) {
    //                 document.querySelector(`${playerClass} .connected span`).classList.toggle('green')
    //             }
    //             if (status.ready == true) {
    //                 document.querySelector(`${playerClass} .ready span`).classList.toggle('green')
    //             }
    //         }
    //     })

    // socket.on('check-players', (statuses) => {
    //     playersArr.forEach((p, i) => {
    //         if (p.con) {
    //             playerConnectedCheckerChanger(i)
    //         }
    //     })
    // })



























    // socket.on('player-number', (socketNum) => {
    //     document.getElementById("title").innerHTML = `Player ${socketNum}`
    //     playerNum = socketNum
    //     //console.log(playerNum);

    //     //playerConnectedCheckerChanger(socketNum)

    //     socket.emit('check-player')
    // })

    // socket.on('check-players', (playersArr) => {
    //     playersArr.forEach((p, i) => {
    //         if (p.con) {
    //             playerConnectedCheckerChanger(i)
    //         }
    //     })
    // })

    // //Another players info
    // socket.on('another-player-connection', (socketNum) => {
    //     document.getElementById("title").innerHTML += ` vs Player ${socketNum}`

    //     playerConnectedCheckerChanger(socketNum)
    // })

    // function playerConnectedCheckerChanger(num) {
    //     let playerClass = `.p${parseInt(num) + 1}`
    //     document.querySelector(`${playerClass} .connected span`).classList.toggle('green')
    //     if (parseInt(num) === playerNum) {
    //         document.querySelector(playerClass).style.fontWeight = 'bold'
    //     }
    // }

    // socket.on('another-player-ready', (plInd) => {
    //     playerReady(plInd)
    // })


    // startG.addEventListener("click", () => {
    //     console.log("click");
    //     playerReady(playerNum)
    //     socket.emit('player-ready')
    //     playMultiPlayerGame()
    // });

    // function playMultiPlayerGame() {

    // }

    // function playerReady(playerNumber) {
    //     let player = `.p${parseInt(playerNumber) + 1}`
    //     document.querySelector(`${player} .ready span`).classList.toggle('green')
    // }
}