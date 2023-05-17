console.log("main.js is connected!)");

//TODO MobileDragDrop
// MobileDragDrop.polyfill({
//     dragImageTranslateOverride: MobileDragDrop.scrollBehaviourDragImageTranslateOverride
// });
// window.addEventListener('touchmove', function () { }, { passive: false });

const turnDisplay = document.querySelector('#whose-go')
const userGrid = document.querySelector('.user-grid')
const enemyGrid = document.querySelector('.enemy-grid')
const userShipsArea = document.querySelector('.user-ships')
const enemyShipsArea = document.querySelector('.enemy-ships')
const ships = document.querySelectorAll('.ship')
const allSquares = document.querySelectorAll('.square')
const firstWindowSec = document.getElementById('firstWindow')

const startG = document.querySelector("#playGame");
const randForMe = document.querySelector("#randForMe");
const cleanMe = document.querySelector("#cleanMe");
const restartBtn = document.querySelector("#restart");

var userSquares = []
var enemySquares = []
const width = 10
const countShips = 10
let isGameOver = false;
let isMyTurn = true;
let sqSelector;
let gamemode = ""

let boardArr = null;
// const randForEnemy = document.querySelector("#randForEnemy").addEventListener("click", () => createShips(enemySquares));;
// const CleanEnemy = document.querySelector("#cleanEnemy").addEventListener("click", () => cleanBoard(enemySquares));


//TODO Buttons
document.addEventListener("DOMContentLoaded", function () {
    startG.disabled = true//true //TODO TESTS ONLY
    randForMe.disabled = true
    dragDropBtn.disabled = true
    //startG.setAttribute("disabled", "disabled")
    rotateBtn.disabled = true
    cleanMe.disabled = true
    restartBtn.disabled = true
    //restartBtn.classList.add("invisible")
    turnDisplay.classList.add("invisible");
    //firstWindowSec.classList.add("invisible");
})

//startG.addEventListener("click", playGameBtn);
//randForMe.addEventListener("click", () => createShips(userSquares));
//cleanMe.addEventListener("click", () => cleanBoard(userSquares));
//restartBtn.addEventListener("click", restart);

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
createBoard(enemyGrid, enemySquares)

//TODO SINGLE GenerateReady     //generate(userSquares, "ship10"); //server +-orig
// function generate(GridSquares, shipId) {
//     let randomDirection = Math.round(Math.random());
//     let shipById = document.querySelector(`[id="${shipId}"]`);
//     let randomStart = Math.abs(Math.floor(Math.random() * GridSquares.length));
//     let shipStartY
//     let shipEndY
//     let step

//     if (randomDirection === 0) {
//         step = 1
//         shipStartY = Math.floor(randomStart / 10)
//         shipEndY = Math.floor((randomStart + shipById.childElementCount - 1) / 10)

//         for (let i = randomStart; i < (randomStart + shipById.childElementCount); i++) {
//             if (GridSquares[i].classList.contains("taken") || shipStartY != shipEndY || randomStart + shipById.childElementCount > GridSquares.length - 1) {
//                 generate(GridSquares, shipId)
//                 return
//             }
//         }
//     }
//     if (randomDirection === 1) {
//         step = 10

//         for (let i = randomStart; i < (randomStart + shipById.childElementCount * step); i += step) {
//             if (GridSquares[i].classList.contains("taken") || randomStart + shipById.childElementCount * step - 10 > GridSquares.length - 1) {
//                 generate(GridSquares, shipId)
//                 return
//             }
//         }
//     }
//     for (let i = randomStart; i < (randomStart + shipById.childElementCount * step); i += step) {
//         GridSquares[i].classList.add('takenByShip');
//         GridSquares[i].classList.add(`${shipId}`);
//     }
//     for (let i = 0; i < 100; i++) {
//         for (let k = -1; k <= 1; k++) {
//             for (let g = -1; g <= 1; g++) {
//                 if (i + k * 10 + g >= 0 && i + k * 10 + g < 100) {
//                     if (Math.floor(i / 10) === Math.floor((i + g) / 10)) {
//                         if (GridSquares[i + k * 10 + g].classList.contains('takenByShip')) {
//                             GridSquares[i].classList.add('taken');
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }

function showMyShips(squares) { //client
    squares.forEach(square => {
        if (square.classList.contains("takenByShip")) {
            square.classList.add("MyShips")
        }
    })
}

function shipIdGenerator(numSq, numShip) { //client
    return `${((numSq) ? 'enemyS' : 's') + 'hip' + numShip}`
}

function shipSectionIdGenerator(numSq, numShip) { //client
    let step = { 0: 1, 1: 2, 2: 2, 3: 3, 4: 3, 5: 3, 6: 4, 7: 4, 8: 4, 9: 4 }[numShip]; //ship:section
    return `${((numSq) ? 'e' : '') + 'ship-section' + step}`
}

// function createShips(squares) { //server
//     sqSelector = (squares !== userSquares);
//     cleanBoard(squares);

//     for (let i = 0; i < countShips; i++) {
//         let ships = { 0: 4, 1: 3, 2: 3, 3: 2, 4: 2, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 }[i]
//         socket.emit('generate', i, ships[i])
//         redrawBoard()
//     }
//     if (!sqSelector) {
//         showMyShips(squares)
//         startG.disabled = false
//         turnDisplay.innerHTML = 'Натисніть Старт';
//         //turnDisplay.innerHTML = 'Press Start';
//     }
//     shipChecker(squares);
//     rotateBtn.disabled = true
// }

function cleanBoard(squares) { //server +- orig
    sqSelector = (squares !== userSquares); //because it can be press after another createShips pressed

    //if (gamemode == 'singlePlayer') {
    squares.forEach(square => {
        square.className = ""
        square.classList.add('square')
    })
    //}

    removeShipChecker(squares);
    if (!sqSelector || gamemode == 'multiPlayer') {
        cleanBoardFromObj()
        turnDisplay.innerHTML = 'Розставте кораблі';
        removeDragDrop()
    }

    cleanMe.disabled = true
    rotateBtn.disabled = true
    startG.disabled = true
    //turnDisplay.innerHTML = 'Place Ships';
}

function cleanBoardFromObj() { //client
    console.log('cleanBoardFromObj');
    let section
    for (let i = 0; i < countShips; i++) {
        shipById = document.querySelector(`[id="${shipIdGenerator(0, i)}"]`)
        section = document.querySelector(`.${shipSectionIdGenerator(0, i)}`)
        //console.log('section', section);
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
function shipChecker(squares) { //client
    sqSelector = (squares !== userSquares);
    for (let i = 0; i < countShips; i++) {
        shipById = document.querySelector(`[id="${shipIdGenerator(sqSelector, i)}"]`)
        shipById.classList.add('ship-checker')
    }
}

function removeShipChecker(squares) { //client
    sqSelector = (squares !== userSquares);
    for (let i = 0; i < countShips; i++) {
        shipById = document.querySelector(`[id="${shipIdGenerator(sqSelector, i)}"]`)
        shipById.classList.remove('ship-checker')
        shipById.classList.remove('ship-checker-dead')
    }
}

function checkerDead(GridSquares) { //TODO SERVER checkerDead
    sqSelector = (GridSquares !== userSquares);
    for (let i = 0; i < countShips; i++) {
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

function isShipsOnField(GridSquares) {//TODO SERVER isShipsOnField
    for (let i = 0; i < GridSquares.length; i++) {
        if (GridSquares[i].classList.contains("takenByShip")) {
            return true;
        }
    }
    return false;
}


//TODO Game Start Logic
function playGameBtn(socket) { //TODO playGameBtn
    if (gamemode == "singlePlayer") {
        isMyTurn = true;
        createShips(enemySquares) //server
    }
    else {
        socket.on('fireAnswer', (sqId, sqStatus) => { //TODO bug: mess are getting more and more often (i++ like when u NASLAIVAT them)

            console.log("isMyTurn(m=e, !m=u)", isMyTurn);
            console.log(sqId, sqStatus);

            //let oneOfSquares
            if (isMyTurn) {
                //console.log("enemySquares", enemySquares[sqId]);
                boardArrToHTMLbySqStatus2(enemySquares, sqId, sqStatus)
                //oneOfSquares = enemySquares
            } else {
                //console.log("userSquares", userSquares[sqId]);
                //oneOfSquares = userSquares
                boardArrToHTMLbySqStatus2(userSquares, sqId, sqStatus)
            }

            //console.log("oneOfSquares", oneOfSquares);



        });
    }

    turnDisplay.innerHTML = (isMyTurn) ? 'Ваш Хід' : 'Хід Суперника';
    isGameOver = false

    // startG.disabled = true
    // randForMe.disabled = true
    // cleanMe.disabled = true
    // rotateBtn.disabled = true
    // dragDropBtn.disabled = true
    // restartBtn.disabled = false
    // restartBtn.innerHTML = "Здатися"

    myShips.forEach(ship => {
        ship.setAttribute('draggable', false);
    });

    if (!isShipsOnField(userSquares)) {
        createShips(userSquares) //server
    }

    cleanBoardFromObj() //sc
    showMyShips(userSquares) //client
    //shipChecker(userSquares) //client //TODO CanBeUnReim
    //socket.to("Room0").emit('shipCheckerToEnemy'); //TODO for 1 game
    //socket.emit('shipCheckerToEnemy');

    enemySquares.forEach(square => square.addEventListener('click', function (e) {
        playerGo(square, socket);
    }))
}

//TODO Game Move Logic
function playGame() {
    if (isGameOver) return

    turnDisplay.innerHTML = (isMyTurn) ? 'Ваш Хід' : 'Хід Суперника';

    if (gamemode == "singlePlayer" && !isMyTurn) {
        console.log('computerGo');
        setTimeout(computerGo, 500)
    }

    //turnDisplay.innerHTML = (isMyTurn)?'Your Move':'Enemy`s Move';
}

function playerGo(square, socket) {
    if (isGameOver ||
        !isMyTurn ||
        square.classList.contains('boom') ||
        square.classList.contains('miss')) {
        return
    } //client

    if (gamemode == 'singlePlayer') {
        if (square.classList.contains('takenByShip')) { //server
            square.classList.add('boom') //server
            checkerDead(enemySquares) //server
            checkGameOver() //server
            return
        } else {
            square.classList.add('miss') //server
        }
        isMyTurn = !isMyTurn//isMyTurn = false;
    } else {
        sqId = Number(square.dataset.y + square.dataset.x);//01-09 not working
        console.log(square.dataset.y, ' ', square.dataset.x, ' ', sqId);
        socket.emit('fire', sqId);
        // socket.emit('nextTurn', isMyTurn);
    }
    playGame();
}

function computerGo() { //sc orig
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
    isMyTurn = true;
    playGame()
}

function checkGameOver() { //server
    let userDeadShipsScore = 0
    let compDeadShipsScore = 0

    userSquares.forEach(sq => {
        if (sq.classList.contains('dead')) {
            userDeadShipsScore += 1
        }
    })

    enemySquares.forEach(sq => {
        if (sq.classList.contains('dead')) {
            compDeadShipsScore += 1
        }
    })

    if (userDeadShipsScore === 20 || compDeadShipsScore === 20) {
        //turnDisplay.innerHTML = userDeadShipsScore > compDeadShipsScore ? 'You Lose' : 'You Win';
        turnDisplay.innerHTML = (userDeadShipsScore > compDeadShipsScore) ? 'Ви Програли' : 'Ви Перемогли';

        isGameOver = true
        //restartBtn.classList.remove("invisible")

        let shipGOVision = document.querySelectorAll('.enemy-grid > .takenByShip')
        shipGOVision.forEach(ship => {
            if (!ship.classList.contains('boom')) {
                ship.classList.add("takenGOVision");
            }
        });
    }
}


//TODO ComputerAI
function computerAI(boomFirst) { //OPTIMIZED //can add "biggest" logic //sc orig
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
        step = { 0: -10, 1: 1, 2: 10, 3: -1 }[rand];
        if (AILogicIsCanBePlaced(boomFirst, step)) {
            return boomFirst + step;
        }
        else {
            return computerAI(boomFirst);
        }
    }

    directionTemp = (boomLast - boomFirst < 10) ? 1 : 10
    rand = Math.floor(Math.random() * 2);
    step = (rand) ? -1 * directionTemp : 1 * directionTemp;
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
    cleanMe.disabled = false
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
    cleanBoard(enemySquares)

    randForMe.disabled = false
    dragDropBtn.disabled = false

    //restartBtn.classList.add("invisible")
}

// generate(userSquares, "ship15");
// showMyShips(userSquares)

//TODO New
//let playerArr = []
const user1name = document.querySelector("#user1name");
const user2name = document.querySelector("#user2name");

const singlePlayerBtn = document.querySelector("#singlePlayerBtn");
const multiPlayerBtn = document.querySelector("#multiPlayerBtn");
//const adminBtn = document.querySelector("#adminBtn");

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
    console.log(gamemode);

    turnDisplay.classList.remove("invisible");
    firstWindowSec.classList.add("invisible");

    randForMe.disabled = false
    dragDropBtn.disabled = false

    startG.addEventListener("click", playGameBtn);
    randForMe.addEventListener("click", () => createShips(userSquares));
    cleanMe.addEventListener("click", () => cleanBoard(userSquares));
    restartBtn.addEventListener("click", restart);
}

function boardArrToHTMLbySqStatus2(GridSquares, SqIndex, SqStatus) { //client
    let SqStatusName = { 0: 'square', 1: 'taken', 2: 'takenByShip', 3: 'miss', 4: 'boom', 5: 'dead' }[SqStatus.toString()[0]];
    SqIndex = (SqIndex.toString()[0] == 0) ? SqIndex % 10 : SqIndex //TODO is it posible to get [0*]?
    GridSquares[SqIndex].classList.add(SqStatusName)
    if (SqStatus.toString()[0] == 2) {
        GridSquares[SqIndex].classList.add(`ship${SqStatus.toString()[1]}`)
    }
}

//adminBtn.addEventListener('click', testadmin)

// function testadmin() {
//     startMultiPlayer();
// }

function startMultiPlayer() {
    gamemode = 'multiPlayer'

    turnDisplay.classList.remove("invisible");
    firstWindowSec.classList.add("invisible");

    randForMe.disabled = false
    dragDropBtn.disabled = false
    // adminBtn.removeEventListener('click', testadmin)
    // adminBtn.addEventListener('click', () => {

    //     cleanBoard(userSquares)
    //     socket.emit('clean')
    //     for (let i = 0; i < countShips; i++) {
    //         let shipIdToLength = { 0: 4, 1: 3, 2: 3, 3: 2, 4: 2, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 }[i]
    //         socket.emit('generate', i, shipIdToLength)
    //     }
    //     showMyShips(userSquares)
    //     startG.disabled = false
    //     turnDisplay.innerHTML = 'Натисніть Старт';
    //     shipChecker(userSquares);
    //     rotateBtn.disabled = true
    //     cleanMe.disabled = false


    //     playerReady(playerNum)
    //     socket.emit('player-ready', playerNum)
    //     socket.on('start-game', () => {
    //         playMultiPlayerGame(socket)
    //     })

    // })

    startG.addEventListener("click", () => {

        //showMyShips(userSquares)//TODO TESTS ONLY
        MyBoard = gridSquaresToArrOfNumbers(userSquares)
        console.log(MyBoard);
        socket.emit('DragDropByHand', MyBoard)


        playerReady(playerNum)
        socket.emit('player-ready', playerNum)
        // socket.on('start-game', (isplayerTurn) => {
        //     isMyTurn = isplayerTurn
        //     playMultiPlayerGame(socket)
        // })
        socket.on('start-game', () => {
            playMultiPlayerGame(socket)
            return
        })
        turnDisplay.innerHTML = 'Очікуємо суперника';

        startG.disabled = true
        randForMe.disabled = true
        cleanMe.disabled = true
        rotateBtn.disabled = true
        dragDropBtn.disabled = true
        restartBtn.disabled = false
        restartBtn.innerHTML = "Здатися"
    });

    function gridSquaresToArrOfNumbers(GridSquares) {
        let arrOfNumbers = []
        for (let i = 0; i < GridSquares.length; i++) {
            if (GridSquares[i].classList.contains(`takenByShip`)) {
                let shipNumber

                function Element_getClassArgument(el, name) {
                    var classes = el.className.split(' ');
                    var prefix = name;
                    for (var i = classes.length; i-- > 0;)
                        if (classes[i].substring(0, prefix.length) == prefix)
                            return classes[i].substring(prefix.length);
                    return null;
                }
                shipNumber = Element_getClassArgument(GridSquares[i], 'ship');
                //+ Number(shipNumber)
                arrOfNumbers[i] = 20 + Number(shipNumber)
            }
            else if (GridSquares[i].classList.contains(`taken`)) {
                arrOfNumbers[i] = 1
            }
            else if (GridSquares[i].classList.contains(`square`)) {
                arrOfNumbers[i] = 0
            }

            // let SqStatusName = { 0: 'square', 1: 'taken', 2: 'takenByShip' }[SqStatus.toString()[0]];
            // SqIndex = (SqIndex.toString()[0] == 0) ? SqIndex % 10 : SqIndex //TODO is it posible to get [0*]?
            // GridSquares[SqIndex].classList.add(SqStatusName)
            // if (SqStatus.toString()[0] == 2) {
            //     GridSquares[SqIndex].classList.add(`ship${SqStatus.toString()[1]}`)
            // }
            //console.log(arrOfNumbers);

        }

        return arrOfNumbers
    }

    randForMe.addEventListener("click", () => {
        cleanBoard(userSquares)
        socket.emit('clean')

        //redrawBoard()

        for (let i = 0; i < countShips; i++) {
            let shipIdToLength = { 0: 4, 1: 3, 2: 3, 3: 2, 4: 2, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 }[i]
            //console.log(i, shipIdToLength);
            socket.emit('generate', i, shipIdToLength)
        }
        //redrawBoard()
        showMyShips(userSquares)
        startG.disabled = false
        turnDisplay.innerHTML = 'Натисніть Старт';

        shipChecker(userSquares);
        rotateBtn.disabled = true

        cleanMe.disabled = false
    })
    cleanMe.addEventListener("click", () => {
        console.log('clean');
        cleanBoard(userSquares)
        socket.emit('clean')
        //redrawBoard()
    })
    restartBtn.addEventListener("click", () => {
        console.log('restart');
        //enemy
        socket.emit('enemyDisconnect')
        location.reload()

        //cleanBoard(userSquares)
        //cleanBoard(enemySquares)

        // randForMe.disabled = false
        //dragDropBtn.disabled = false

        //restartBtn.classList.add("invisible")
        //socket.disconnect()
        //socket.connection()
        //socket.emit('disconnect')
        //socket.emit('connection', socket)
    });

    const socket = io();

    let currentUserName = document.querySelector("#currentUserName").value
    let playerNum
    let enemyNum

    socket.on('player-start', (plNum, isPlayerTurn) => {
        isMyTurn = Boolean(isPlayerTurn)
        console.log('player-start', 'isMyTurn', isMyTurn);
        playerNum = plNum
        enemyNum = (plNum == 1) ? 2 : 1
        document.getElementById("userInfo").classList.add(`p${plNum}`);
        document.getElementById("enemyInfo").classList.add(`p${enemyNum}`)

        document.getElementById("title").innerHTML = `Pl${plNum}`
        document.querySelector(`.p${plNum}`).style.fontWeight = 'bold'
        socket.emit('check-player', currentUserName)
    })

    socket.on('check-player-answer', (OponentInfo, MyStatus) => {
        console.log("check-player-answer", OponentInfo, MyStatus);
        user1name.innerHTML = (currentUserName == "") ? "YOU" : currentUserName //TODO can be rewrited to get name from seerver not from itself

        if (MyStatus.conn) {
            document.querySelector(`.p${playerNum} .connected span`).classList.add('green')
        }
        else {
            document.querySelector(`.p${playerNum} .connected span`).classList.remove('green')
        }

        // if (typeof OponentInfo != 'undefined') {console.log("OponentInfo  is not null", OponentInfo);}
        if (OponentInfo) { //Fixed was (player number == 2) null but not null: typeof OponentInfo == 'null' //probably can create some bugs...

            if (OponentInfo.statusInfo.conn) {
                settings((OponentInfo.name == "") ? "OPONENT" : OponentInfo.name)
                document.querySelector(`.p${enemyNum} .connected span`).classList.add('green')
            }
            else {
                document.querySelector(`.p${enemyNum} .connected span`).classList.remove('green')
            }
            if (OponentInfo.statusInfo.ready) {
                //document.querySelector(`.p${enemyNum} .ready span`).classList.add('green')
                playerReady(enemyNum)
                //document.querySelector(`.p${enemyNum} .ready span`).classList.add('green')
                //shipChecker(enemySquares)
            }
            else {
                document.querySelector(`.p${enemyNum} .ready span`).classList.remove('green')
            }

        }

    })

    socket.on('tell-another-player', (OponentInfo) => {
        console.log('tell-another-player', OponentInfo);
        settings((OponentInfo.name == "") ? "OPONENT" : OponentInfo.name)

        if (OponentInfo.statusInfo.conn) {
            document.querySelector(`.p${enemyNum} .connected span`).classList.add('green')
        }
    })

    // socket.on('shipCheckerToEnemyAnswer', () => {
    //     console.log('shipCheckerToEnemyAnswer');
    //     shipChecker(enemySquares)
    // })


    socket.on('player-ready-answer', (plN) => {
        playerReady(plN)
        //shipChecker(enemySquares)
    })

    function playMultiPlayerGame(socket) {
        console.log("START playMultiPlayerGame");
        playGameBtn(socket);
        //showMyShips(enemySquares)//TODO MUST BE DELETED (ONLY FOR TESTS)
        playGame()
    }

    function playerReady(playerNumber) {
        document.querySelector(`.p${playerNumber} .ready span`).classList.add('green')
        console.log(playerNumber);
        if (playerNumber == playerNum) {
            shipChecker(userSquares)
        } else {
            shipChecker(enemySquares)
        }
    }

    socket.on('boardTest', (boardTest) => {
        boardTest.forEach((el, index) => {
            boardArrToHTMLbySqStatus2(userSquares, index, el)
        })
        showMyShips(userSquares)
    })

    socket.on('nextTurn', () => {
        isMyTurn = !isMyTurn
        //console.log(isPlayerTurn, isMyTurn);
        playGame()
    })

    socket.on('shipCheackerByIdDead', (plNum, shipId) => {
        console.log('shipCheackerByIdDead', shipId);
        let sqSelector = (plNum == playerNum);
        //let sqSelector = (squares != userSquares);
        console.log("WTFISGOINGON(true = e): ", plNum, sqSelector, " ", shipIdGenerator(sqSelector, shipId));
        let shipById = document.querySelector(`[id="${shipIdGenerator(sqSelector, shipId)}"]`)
        shipById.classList.add('ship-checker-dead')
    })

    socket.on('gameOver', () => {
        console.log('gameOver');
        if (isMyTurn) {
            turnDisplay.innerHTML = 'Win';
        } else {
            turnDisplay.innerHTML = 'Lose';
        }
        isMyTurn = false
        restartBtn.innerHTML = "З Початку"
        //restartBtn.disabled = false
    })

    socket.on('showAliveShips', (enemyAliveBoard) => {
        console.log('showAliveShips');

        for (let i = 0; i < enemyAliveBoard.length; i++) {
            if (enemyAliveBoard[i].toString()[0] == 2) {
                enemySquares[i].classList.add('takenGOVision')
            }
        }
    })


    // socket.on('createMissAroundDeadSquares', GridBoard, () => {
    //     console.log('createMissAroundDeadSquares');

    //     for (let i = 0; i < 100; i++) {
    //         for (let k = -10; k <= 10; k += 10) {
    //             for (let g = -1; g <= 1; g++) {
    //                 if (i + k + g >= 0 && i + k + g < 100) {
    //                     if (Math.floor(i / 10) === Math.floor((i + g) / 10)) {
    //                         if (GridBoard[i + k + g].toString()[0] == 5 && GridBoard[i].toString()[0] != 5) {
    //                             GridBoard[i] = 30;
    //                             io.in(roomName).emit('fireAnswer', i, 30);
    //                             //socket.emit('fireAnswer', i, 30)
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // })
}