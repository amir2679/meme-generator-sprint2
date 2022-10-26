'use strict'

const IMGS_STORAGE_KEY = 'imgsDB'
let gImgs = []
let gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I sometimes eat Falafel',
            size: 20,
            align: 'left',
            color: 'red'
        }
    ]
}



_createImgs()

function _createImgs() {
    let imgs = loadFromStorage(IMGS_STORAGE_KEY)
    if (!imgs || !imgs.length) {
        imgs = []
        for (var i = 0; i < 18; i++) {
            let img = { id: i + 1, url: `./meme-imgs (square)/${i + 1}.jpg` }
            imgs.push(img)
        }
    }

    gImgs = imgs
    saveToStorage(IMGS_STORAGE_KEY, gImgs)
}


function getImgs() {
    return gImgs
}

function getMeme() {
    return gMeme
}

function setMeme(id) {
    let currMeme = {
        selectedImgId: id,
        selectedLineIdx: 0,
        lines: [
            {
                txt: 'test1',
                size: getRandomIntInclusive(50, 70),
                align: 'left',
                color: '#f00f0f',
                posX: 50,
                posY: 50,
            },
            {
                txt: 'test2',
                size: getRandomIntInclusive(30, 40),
                align: 'left',
                color: '#f00f0f',
                posX: 130,
                posY: 130,
            }
        ]
    }

    gMeme = currMeme
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
    // if (gMeme.lines[gMeme.selectedLineIdx].posX + gCtx.measureText(txt).width >= gElCanvas.width) {
    //     gMeme.lines[gMeme.selectedLineIdx].posY += (gMeme.lines[gMeme.selectedLineIdx].size + 10) * 2
    // }
    // console.log(gMeme.lines[gMeme.selectedLineIdx].txt)
}

function setImg(imgId) {
    let memeImg = gImgs.find((img) => +imgId === img.id)
    setMeme(+imgId)
}

function setColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function setFontSize(multiplier) {
    gMeme.lines[gMeme.selectedLineIdx].size += multiplier * 5
}

function switchLine() {
    if (gMeme.selectedLineIdx >= gMeme.lines.length - 1)
        gMeme.selectedLineIdx = 0
    else
        gMeme.selectedLineIdx++


}

function addLine() {
    const newLine = createLine()
    gMeme.lines.push(newLine)
}

function createLine() {
    return {
        txt: 'New Line',
        size: 40,
        align: 'left',
        color: '#f00f0f',
        posX: 300,
        posY: 300,
        isClicked: false
    }
}

function setIsClicked(isClicked) {
    gMeme.lines[gMeme.selectedLineIdx].isClicked = isClicked
}

function isLineClicked({ x, y }) {
    gMeme.lines.forEach(({ posX, posY, txt, size }, idx) => {
        if (posX - 5 <= x && x <= posX + gCtx.measureText(txt).width + 10
            && y >= posY - size && y <= size + 10 + y)
            gMeme.selectedLineIdx = idx
    });
}

