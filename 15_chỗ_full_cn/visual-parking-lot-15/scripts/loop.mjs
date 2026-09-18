'use strict'

import {config} from './config.mjs'
import {pathObject} from './path-object.mjs'
import {SpaceInitializer} from './space-initializer.mjs'
import {RoutePlotter} from './routing/route-plotter.mjs'
import {CollisionBoxHandler} from './collision-box-handler.mjs'
import {Overlay} from './overlay.mjs'
import {ParkingLot} from './parking-lot.mjs'
import * as animation from './animation/index.mjs'

//
//      Known Bugs:
// Cars update collisionBox dynamically during anims, but
// the inaccuracy of the box can also block nearby cars checking if
// they can leave their space.

// Car's roadArea and destinationArea boxes are slightly off near
// front of car. Doesn't affect performance.

//
//      Potential Improvements:
// Let user initialize lot with normal vs test sets of spaces in GUI.

// Display stat of interval time for each iteration a car is stuck
// while attempting to leave space to quantify efficiency.

// Slight randomization on assignedSpaces by 1-2 ranks to space out cars

// Variable car speed/functional stopping distance.

// Improve reenteredRoadClear

function initializeSimulation(config, loop) {
    let spaceInitializer = new SpaceInitializer(pathObject)
    let unrankedSpaceList = spaceInitializer.initParkingSpaces()
    let rankedSpaceList = spaceInitializer.rankSpaces(unrankedSpaceList)
    // Test limited space sets.
    // let testUnrankedSpaceList = spaceInitializer.returnTestExceptionSpacesSets()
    // let rankedSpaceList = spaceInitializer.rankSpaces(testUnrankedSpaceList)
    //
    spaceInitializer.setHandicapSpaces(rankedSpaceList)

    let routePlotter = new RoutePlotter(pathObject)

    let animationHandler = new animation.AnimationHandler(
        animation.animationTypes
    )

    let overlay = new Overlay()
    overlay.createSpaceOverlay(rankedSpaceList)
    overlay.createPathsOverlay(pathObject)
    overlay.addGuiListeners()

    let parkingLot = new ParkingLot(
        config,
        loop,
        pathObject,
        routePlotter,
        overlay,
        animationHandler,
        rankedSpaceList
    )
    parkingLot.collisionBoxHandler = new CollisionBoxHandler(parkingLot)
    parkingLot.initializeSelf()

    return parkingLot
}

let loop = {
    LOOP_SPEED: config.LOOP_SPEED,
    running: false,
    // Luu id cua setInterval de co the huy dung khi dung mo phong.
    // (BAN GOC: stopLoop() dung "this.running === false" - chi la phep
    // so sanh, khong phai phep gan, nen KHONG he dung duoc vong lap.
    // Da sua lai dung bang clearInterval() ben duoi.)
    intervalId: null,

    startLoop: function (parkingLot) {
        if (loop.running === false) {
            console.log('Loop starting.')
            loop.running = true
            loop.intervalId = setInterval(function () {
                loop.iterate(parkingLot)
            }, loop.LOOP_SPEED)
        } else {
            console.log('Loop already running.')
        }
    },

    stopLoop: function () {
        if (loop.running === true) {
            console.log('Loop stopping.')
            clearInterval(loop.intervalId)
            loop.intervalId = null
            loop.running = false
            console.log('Loop stopped.')
        } else {
            console.log('Loop already stopped.')
        }
    },

    // Bat/tat mo phong. Ngoai viec dung vong lap chinh (spawn xe + di
    // chuyen), cung tam dung/tiep tuc cac animation CSS dang chay
    // (xe dang quay dau, dang lui vao cho...) bang Web Animations API
    // de xe khong "dong bang giua chung" mot cach ky la.
    togglePause: function (parkingLot) {
        if (loop.running) {
            loop.stopLoop()
            if (document.getAnimations) {
                document.getAnimations().forEach((anim) => anim.pause())
            }
        } else {
            loop.startLoop(parkingLot)
            if (document.getAnimations) {
                document.getAnimations().forEach((anim) => anim.play())
            }
        }
        return loop.running
    },

    iterate: function (parkingLot) {
        parkingLot.simulate()
    },
}

let parkingLot = initializeSimulation(config, loop)
loop.startLoop(parkingLot)

// ---------------------------------------------------------------------
// GUI: nut Dung/Tiep tuc + 2 nut dieu khien chu dong (cho xe vao / ra).
// ---------------------------------------------------------------------
let pauseButton = document.getElementById('pause-button')
if (pauseButton) {
    pauseButton.addEventListener('click', function () {
        let running = loop.togglePause(parkingLot)
        pauseButton.value = running ? 'Dung mo phong' : 'Tiep tuc mo phong'
    })
}

let manualInButton = document.getElementById('manual-in-button')
if (manualInButton) {
    manualInButton.addEventListener('click', function () {
        let ok = parkingLot.manualSpawnCar()
        if (!ok) {
            console.log('Khong the cho xe vao luc nay (cong dang ban hoac bai da day).')
        }
    })
}

let manualOutButton = document.getElementById('manual-out-button')
if (manualOutButton) {
    manualOutButton.addEventListener('click', function () {
        let ok = parkingLot.forceCarToLeave()
        if (!ok) {
            console.log('Khong co xe nao dang do de cho ra.')
        }
    })
}
