'use strict'
let gElCanvas
let gCtx
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

function onInit() {
    gElCanvas = document.querySelector('.my-canvas')
    gCtx = gElCanvas.getContext('2d')
    addListeners()
    renderImgs()
}

function renderMeme(txt = 'HELLO') {
    let meme = getMeme()
    const imgUrl = getImgs().find((img) => img.id === meme.selectedImgId).url
    const img = new Image()
    img.src = imgUrl
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        drawText()
    }
}



function drawText() {
    gCtx.lineWidth = 2
    const memeLines = getMeme().lines
    // const {size, txt, posX, posY, color} = memeLines[0]
    // console.log(size , txt , posX , posY , color)

    memeLines.forEach(({ size, txt, posX, posY, color }, idx) => {
        // console.log(size, txt, posX, posY, color)
        // console.log(posX + gCtx.measureText(txt).width)
        // if (posX + gCtx.measureText(txt).width >= gElCanvas.width) {
        //     memeLines[idx].posY += (size + 10)
        // }

        gCtx.strokeStyle = color
        gCtx.fillStyle = color
        gCtx.font = `${size}px Arial`
        gCtx.fillText(txt, posX, posY ,gElCanvas.width - posX - size)
        gCtx.strokeText(txt, posX, posY , gElCanvas.width - posX - size)

        if (idx === getMeme().selectedLineIdx) {
            markTxtLIne(memeLines[idx])
        }

    })



}

function onSetLineTxt(txt) {
    setLineTxt(txt)
    renderMeme()
}

function onSetTextColor(color) {
    setColor(color)
}

function onSetFontSize(multiplier) {
    setFontSize(multiplier)
    renderMeme()
}

function onSwitchLine() {
    switchLine()
    const currMeme = getMeme()
    const currMemeLine = currMeme.lines[currMeme.selectedLineIdx]
    // markTxtLIne(currMemeLine)
    document.querySelector('.txt-edit').value = currMemeLine.txt
    document.querySelector('.color-edit').value = currMemeLine.color


    renderMeme()
}

function markTxtLIne({ posX, posY, txt, size }) {
    gCtx.strokeStyle = 'black'
    // const distance = Math.sqrt((pos.x - clickedPos.x) ** 2 + (pos.y - clickedPos.y) ** 2)
    // console.log(posX, posY, gCtx.measureText(txt).width, gCtx.measureText(txt).height)


    // if (posX + gCtx.measureText(txt).width >= gElCanvas.width) {
    //     gCtx.strokeRect(posX - 5, posY - size, gCtx.measureText(txt).width + 10, (size + 10) * 2)
    //     // getMeme().lines[getMeme().selectedLineIdx].posY *= 2
    // }
    // else 
    gCtx.strokeRect(posX - 5, posY - size, gCtx.measureText(txt).width + 10, size + 10)
}

// function renderNewLine() {
//     if (posX + gCtx.measureText(txt).width >= gElCanvas.width) {
//         console.log(getMeme.lines[getMeme.selectedLineIdx].posX)
//     }
// }

function onAddLine() {
    addLine()

    renderMeme()
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addListeners() {
    addMouseListeners()

    window.addEventListener('resize', () => {
        resizeCanvas()
        renderCanvas()
    })
}

function onDown(ev) {
    //Get the ev pos from mouse or touch
    const pos = getEvPos(ev)

    isLineClicked(pos)
    renderMeme()

    // gStartPos = pos
}

function onMove(ev) {
    // const { isDrag } = getShape()
    // if (!isDrag) return
    // const pos = getEvPos(ev)

    // const speedX = ev.movementX
    // const speedY = ev.movementY
    // const maxSpeed = Math.max(speedX, speedY) + 10

    // // gStartPos = pos
    // draw(pos.x, pos.y, maxSpeed, getShape().color)
    // //The canvas is render again after every move
    // // renderCanvas()
}

function onUp() {
    // setShapeDrag(false)
    // gCtx.beginPath()
}

function getEvPos(ev) {

    //Gets the offset pos , the default pos
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    // Check if its a touch ev
    if (TOUCH_EVS.includes(ev.type)) {
        //soo we will not trigger the mouse ev
        ev.preventDefault()
        //Gets the first touch point
        ev = ev.changedTouches[0]
        //Calc the right pos according to the touch screen
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

function renderCanvas() {
    gCtx.fillStyle = "white"

    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)

    // need render?
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}