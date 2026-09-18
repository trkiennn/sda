'use strict'

import * as td from './type-defs.mjs'

let SpaceInitializer = function (pathObject) {
    this.pathObject = pathObject
}

/**
 * @method
 * @returns {Object} unrankedSpaceList
 */
SpaceInitializer.prototype.initParkingSpaces = function () {
    let unrankedSpaceList = {}
    let refPoint

    // ---------------------------------------------------------------
    // TINH GIAN: bo cac o do o 2 cot doc trai/phai (row0col0, row1col0,
    // row2col0, row0col2, row1col2, row2col2). Cac cot nay gio CHI con
    // la lan duong di (entrance/exit), khong con la noi do xe nua -
    // dung khop voi hinh bai do 15 cho (3 hang x 5 o, khong co o o
    // 2 ben duong). Toan bo he thong duong di/lan xe (pathObject) giu
    // nguyen, chi bot danh sach o do o 2 cot do.
    // ---------------------------------------------------------------

    // row0 horizontal section's top spaces
    refPoint = {
        x: 190,
        y: 28,
    }
    unrankedSpaceList.row0col1 = this.createSpacesRow(
        refPoint,
        [100, 100, 100, 100, 98],
        212,
        this.pathObject.sections.horizontal.row0col1,
        'north'
    )
    // row0 horizontal section's bottom spaces
    refPoint = {
        x: 190,
        y: 395,
    }
    let row0col1BottomSpaces = this.createSpacesRow(
        refPoint,
        [100, 100, 100, 100, 98],
        210,
        this.pathObject.sections.horizontal.row0col1,
        'south'
    )
    for (let space of row0col1BottomSpaces) {
        unrankedSpaceList.row0col1.push(space)
    }
    // row1 horizontal section's bottom spaces
    refPoint = {
        x: 190,
        y: 786,
    }
    unrankedSpaceList.row1col1 = this.createSpacesRow(
        refPoint,
        [100, 100, 100, 100, 98],
        210,
        this.pathObject.sections.horizontal.row1col1,
        'south'
    )

    return unrankedSpaceList
}

SpaceInitializer.prototype.createSpacesColumn = function (
    refPoint,
    spaces,
    length,
    section,
    facing
) {
    let column = []
    for (let i = 0; i < spaces.length; i++) {
        let space = {}
        space.x = refPoint.x
        space.y = refPoint.y
        space.width = length
        space.height = spaces[i]
        space.facing = facing
        space.section = section

        column.push(space)

        refPoint.y += space.height + 10
    }
    return column
}
SpaceInitializer.prototype.createSpacesRow = function (
    refPoint,
    spaces,
    length,
    section,
    entranceSide
) {
    let row = []
    for (let i = 0; i < spaces.length; i++) {
        let space = {}
        space.x = refPoint.x
        space.y = refPoint.y
        space.height = length
        space.width = spaces[i]
        space.facing = entranceSide
        space.section = section

        row.push(space)

        refPoint.x += space.width + 10
    }
    return row
}

/**
 * @method
 * @param {Object} unrankedSpaceList
 * @returns {Array} rankedSpaceList
 */
SpaceInitializer.prototype.rankSpaces = function (unrankedSpaceList) {
    let rankedSpaceList = []

    for (let line in unrankedSpaceList) {
        for (let space of unrankedSpaceList[line]) {
            space.score = space.x * 0.4 + space.y
            rankedSpaceList.push(space)
        }
    }

    rankedSpaceList.sort((a, b) => a.score - b.score)
    for (let i = 0; i < rankedSpaceList.length; i++) {
        rankedSpaceList[i].rank = i
    }

    return rankedSpaceList
}
SpaceInitializer.prototype.setHandicapSpaces = function (spaceList) {
    // Bai 15 cho chi con 1 o khuyet tat, dung vi tri o dau hang tren
    // cung (khop voi icon xe lan trong goc tren-trai cua hinh mau).
    for (let space of spaceList) {
        if (space.x === 423 && space.y === 28) {
            space.handicap = true
        }
    }
}

// Sets of parking spaces for testing different animations.
SpaceInitializer.prototype.returnTestExceptionSpacesSets = function () {
    let spaces = {}
    let zTurn = [
        {
            x: 423,
            y: 28,
            width: 100,
            height: 212,
            facing: 'north',
            section: this.pathObject.sections.horizontal.row0col1,
        },
        {
            x: 1140,
            y: 18,
            width: 212,
            height: 100,
            facing: 'east',
            section: this.pathObject.sections.vertical.row0col2,
        },
        {
            x: 1140,
            y: 128,
            width: 212,
            height: 97,
            facing: 'east',
            section: this.pathObject.sections.vertical.row0col2,
        },
        {
            x: 1140,
            y: 235,
            width: 212,
            height: 100,
            facing: 'east',
            section: this.pathObject.sections.vertical.row0col2,
        },
        {
            x: 1140,
            y: 563,
            width: 212,
            height: 100,
            facing: 'east',
            section: this.pathObject.sections.vertical.row1col2,
        },
        {
            x: 1140,
            y: 673,
            width: 212,
            height: 100,
            facing: 'east',
            section: this.pathObject.sections.vertical.row2col2,
        },
        {
            x: 1140,
            y: 783,
            width: 212,
            height: 98,
            facing: 'east',
            section: this.pathObject.sections.vertical.row2col2,
        },
    ]
    let uTurn = [
        {
            x: 423,
            y: 395,
            width: 100,
            height: 210,
            facing: 'south',
            section: this.pathObject.sections.horizontal.row0col1,
        },
        {
            x: 422,
            y: 786,
            width: 100,
            height: 210,
            facing: 'south',
            section: this.pathObject.sections.horizontal.row1col1,
        },
    ]
    let rightAngleReverse = [
        // Left Column Sections
        {
            x: 20,
            y: 235,
            width: 208,
            height: 100,
            facing: 'west',
            section: this.pathObject.sections.vertical.row0col0,
        },
        {
            x: 20,
            y: 453,
            width: 208,
            height: 100,
            facing: 'west',
            section: this.pathObject.sections.vertical.row1col0,
        },
        {
            x: 20,
            y: 673,
            width: 208,
            height: 100,
            facing: 'west',
            section: this.pathObject.sections.vertical.row2col0,
        },
        // // Horizontals
        {
            x: 533,
            y: 28,
            width: 100,
            height: 212,
            facing: 'north',
            section: this.pathObject.sections.horizontal.row0col1,
        },
        {
            x: 533,
            y: 395,
            width: 100,
            height: 210,
            facing: 'south',
            section: this.pathObject.sections.horizontal.row0col1,
        },
        // Right column sections
        {
            x: 1140,
            y: 235,
            width: 212,
            height: 100,
            facing: 'east',
            section: this.pathObject.sections.vertical.row0col2,
        },
        {
            x: 1140,
            y: 453,
            width: 212,
            height: 100,
            facing: 'east',
            section: this.pathObject.sections.vertical.row1col2,
        },
        {
            x: 1140,
            y: 673,
            width: 212,
            height: 100,
            facing: 'east',
            section: this.pathObject.sections.vertical.row2col2,
        },
    ]
    let rightAngleFarReverse = [
        // Top two spaces, pulling out south
        {
            x: 20,
            y: 18,
            width: 208,
            height: 100,
            facing: 'west',
            section: this.pathObject.sections.vertical.row0col0,
        },
        {
            x: 20,
            y: 128,
            width: 208,
            height: 97,
            facing: 'west',
            section: this.pathObject.sections.vertical.row0col0,
        },
        // Bottom two spaces, pulling out north
        {
            x: 20,
            y: 783,
            width: 208,
            height: 98,
            facing: 'west',
            section: this.pathObject.sections.vertical.row2col0,
        },
        {
            x: 20,
            y: 891,
            width: 208,
            height: 100,
            facing: 'west',
            section: this.pathObject.sections.vertical.row2col0,
        },
    ]
    let threePointReverse = [
        // Top-right corner's two spaces.
        {
            x: 1140,
            y: 18,
            width: 212,
            height: 100,
            facing: 'east',
            section: this.pathObject.sections.vertical.row0col2,
        },
        {
            x: 1140,
            y: 128,
            width: 212,
            height: 97,
            facing: 'east',
            section: this.pathObject.sections.vertical.row0col2,
        },
    ]

    // spaces.zTurn = zTurn
    // spaces.uTurn = uTurn
    // spaces.rightAngleReverse = rightAngleReverse
    // spaces.rightAngleFarReverse = rightAngleFarReverse
    // spaces.threePointReverse = threePointReverse

    return spaces
}

export {SpaceInitializer}
