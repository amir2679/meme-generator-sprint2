'use strict'

const SAVED_MEMES_STORAGE_KEY = 'memesDB'
let gSavedMemes
let gImgs = []
let gMeme
let gFilterByTxt
let gKeywordSearchCountMap = { 'baby': 30, 'president': 2, 'woman': 40, 'man': 1, 'animel': 5, 'movie': 3, 'kiss': 2 }
const imgsKeywords = [
    ['woman'], ['president', 'man'], ['animel'], ['baby', 'animel'],
    ['baby'], ['animel'], ['man'], ['baby'],
    ['movie'], ['movie'], ['movie', 'man'], ['movie', 'man'],
    ['baby'], ['president', 'man'], ['baby'],
    ['animel'], ['president', 'man'], ['kiss'], ['movie'],
    ['movie'], ['movie'], ['movie'], ['movie'],
    ['president', 'man'], ['movie']
]



_createImgs()
_savedMemesInit()

function _createImgs() {
    let imgs = []
    for (var i = 0; i < 24; i++) {
        // let imgRatio = 
        const img = { id: i + 1, url: `./meme-imgs (various aspect ratios)/${i + 1}.jpg`, keywords: imgsKeywords[i] }
        imgs.push(img)
    }

    gImgs = imgs
}

function _savedMemesInit() {
    let savedMemes = loadFromStorage(SAVED_MEMES_STORAGE_KEY)
    console.log(savedMemes)
    if (!savedMemes || !savedMemes.length) {
        console.log('hi')
        savedMemes = []
    }
    // console.log(gSavedMemes)
    gSavedMemes = savedMemes
    // console.log(gSavedMemes)
    saveToStorage(SAVED_MEMES_STORAGE_KEY, gSavedMemes)
}


function getImgs() {
    if (!gFilterByTxt) return gImgs

    const imgsToRender = gImgs.filter(img => (img.keywords.some(word => word.includes(gFilterByTxt))))
    return imgsToRender
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
                txt: 'FALAFEL!',
                size: getRandomIntInclusive(20, 30),
                align: 'left',
                color: '#f00f0f',
                posX: 100,
                posY: 200,
                isDrag: false,
                font: 'impact',
                lineFrame: {
                }
            },
            {
                txt: 'SHUARMA?',
                size: getRandomIntInclusive(30, 40),
                align: 'left',
                color: '#f00f0f',
                posX: 230,
                posY: 130,
                isDrag: false,
                font: 'impact',
                lineFrame: {
                }
            }
        ]
    }

    gMeme = currMeme
}

function setLineFrame(x = getSelectedLine().posX, width = gCtx.measureText(getSelectedLine().txt).width) {
    getSelectedLine().lineFrame.posX = x + 10
    getSelectedLine().lineFrame.width = width - 20
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
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
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1)
        gMeme.selectedLineIdx = 0
    else
        gMeme.selectedLineIdx++

    // setIsClicked(true)
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
        posX: getRandomIntInclusive(20, 500 - 50),
        posY: getRandomIntInclusive(20, 500 - 50),
        isDrag: false,
        font: 'impact',
        lineFrame: {
        }
    }

}

function setIsClicked(isClicked) {
    gMeme.lines[gMeme.selectedLineIdx].isClicked = isClicked
}

function isLineClicked(pos) {
    let isClicked = false
    gMeme.lines.forEach((line, idx) => {
        if (pos.y > line.posY - line.size && pos.y < line.posY + line.size + 10) {
            gMeme.selectedLineIdx = idx
            isClicked = true
        }
    })

    return isClicked
}

function setLineDrag(isDrag) {
    // console.log(gMeme.lines[idx])
    gMeme.lines[gMeme.selectedLineIdx].isDrag = isDrag
}

function moveLine(dx, dy) {
    const selectedLine = getSelectedLine()
    selectedLine.posX += dx
    selectedLine.posY += dy
    // moveLineMark(dx)
}

function moveLineMark(dx) {
    getSelectedLine().lineFrame.posX += dx
    getSelectedLine().lineFrame.width += dx
}

function txtResize(dx, { side }) {
    //gCircles[0].x

    if (side === 'right') {
        if (getSelectedLine().size < 10 && dx < 0) {
            return
        }
        getSelectedLine().size += dx
    }

    if (side === 'left') {
        if (getSelectedLine().size < 10 && dx > 0) {
            return
        }
        getSelectedLine().size -= dx
    }
}


function createRandMeme() {
    const selectedImgId = getRandomIntInclusive(1, 18)
    const selectedLineIdx = 0
    const lineNum = getRandomIntInclusive(1, 2)
    const lines = []
    for (var i = 0; i < lineNum; i++) {
        const line = {}
        line.txt = getRandomText()
        line.size = getRandomIntInclusive(15, 30)
        line.align = 'left'
        line.color = getRandomColor()
        line.posX = getRandomIntInclusive(20, 200)
        line.posY = getRandomIntInclusive(50, 200)
        line.font = 'impact',
            line.isDrag = false,
            line.lineFrame = {}

        lines.push(line)
    }

    gMeme = {
        selectedImgId, selectedLineIdx, lines
    }
}

function setImgContent(imgContent) {
    // delete gMeme.selectedImgId
    gMeme.imgUrl = imgContent
    saveMeme()
}


function saveMeme() {
    console.log(gSavedMemes)
    gSavedMemes.unshift(gMeme)
    saveToStorage(SAVED_MEMES_STORAGE_KEY, gSavedMemes)
}

function loadSavedMemes() {
    gSavedMemes = loadFromStorage(SAVED_MEMES_STORAGE_KEY)
}

function getSavedMemes() {
    return gSavedMemes
}

function setGMeme(meme) {
    gMeme = meme
}

function deleteLine() {
    let deletedLine = gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    if (gMeme.selectedLineIdx <= gMeme.lines.length && gMeme.selectedLineIdx > 0) {
        gMeme.selectedLineIdx--
        console.log('last line', gMeme.selectedLineIdx)
    }
    return deletedLine
}

function locateLine(direction) {
    switch (direction) {
        case 'left':
            getSelectedLine().posX = 10
            break;
        case 'right':
            getSelectedLine().posX = gElCanvas.width - gCtx.measureText(getSelectedLine().txt).width - 10
            break;
        case 'middle':
            getSelectedLine().posX = (gElCanvas.width - gCtx.measureText(getSelectedLine().txt).width) / 2    
            break;
    }
}

function changeFont(font) {
    gMeme.lines[gMeme.selectedLineIdx].font = font
}

function setImgFilter(txt) {
    gFilterByTxt = txt.toLowerCase().trim()
    const keyword = imgsKeywords.find(imgKeyword => imgKeyword.includes(gFilterByTxt))
    if (keyword) {
        if (gKeywordSearchCountMap[gFilterByTxt]) gKeywordSearchCountMap[gFilterByTxt]++
        else gKeywordSearchCountMap[gFilterByTxt] = 1
    }
}

function getKeywordSearchCountMap() {
    return gKeywordSearchCountMap
}

function createCustomMeme() {
    const customMeme = {
        selectedLineIdx: 0,
        selectedImgId: -1,
        lines: [
            {
                txt: 'YOUR MEME!',
                size: getRandomIntInclusive(20, 30),
                align: 'left',
                color: '#f00f0f',
                posX: 100,
                posY: 50,
                isDrag: false,
                font: 'impact',
                lineFrame: {
                }
            }
        ]
    }
    gMeme = customMeme
}

function getSelectedLine() {
    return gMeme.lines[gMeme.selectedLineIdx]
}
