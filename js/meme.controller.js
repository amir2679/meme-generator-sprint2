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
        gCtx.strokeStyle = color
        gCtx.fillStyle = color
        gCtx.font = `${size}px Arial`
        gCtx.fillText(txt, posX, posY)
        gCtx.strokeText(txt, posX, posY)

        if (idx === getMeme().selectedLineIdx) {
            markTxtLIne(memeLines[idx])
        }
    });


    // if (!lineIdx) {
    //     gCtx.font = `${size}px Arial`
    //     gCtx.fillText(text, x, y)
    //     gCtx.strokeText(text, x, y)
    //     markTxtLIne(x, y, text, size)
    // }
    // else {
    //     gCtx.font = `${size}px Arial`
    //     gCtx.fillText(text, x, gElCanvas.height - size)
    //     gCtx.strokeText(text, x, gElCanvas.height - size)
    // }

    // markTxtLIne(x , y ,text , size)
}

function onSetLineTxt(txt) {
    setLineTxt(txt)
    renderMeme()
}

function onSetTextColor(color) {
    // console.log(color)
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
    gCtx.strokeRect(posX - 5, posY - size, gCtx.measureText(txt).width + 10, size + 10)
}

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