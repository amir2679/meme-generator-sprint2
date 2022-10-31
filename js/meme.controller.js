'use strict'
let gElCanvas
let gCtx
let gStartPos
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']
let gTotalMovementX = 0
let gCircles = []
// let gLineFrame

function onInit() {
    gElCanvas = document.querySelector('.my-canvas')
    gCtx = gElCanvas.getContext('2d')

    addListeners()
    resizeCanvas()
    renderImgs()
    renderKeywords(getKeywordSearchCountMap())
}

function renderMeme() {
    let meme = getMeme()
    let imgUrl
    imgUrl = gMeme.customImgUrl
    if(!imgUrl) imgUrl = getImgs().find((img) => img.id === meme.selectedImgId).url
    const img = new Image()
    img.src = imgUrl
    img.ratio = img.width / img.height
    img.onload = () => {
        gElCanvas.width = gElCanvas.height * img.ratio
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        drawText()
    }
}


function drawText() {
    gCtx.lineWidth = 2
    const memeLines = getMeme().lines
    if (!memeLines || !memeLines.length) return
    // const {size, txt, posX, posY, color} = memeLines[0]
    // console.log(memeLines)

    memeLines.forEach(({ size, txt, posX, posY, color, font }, idx) => {

        // let wrappedText = wrapText(gCtx, txt, posX, posY, (gElCanvas.width - posX), size)
        // // console.log(wrappedText)

        // wrappedText.forEach(function (item) {
        //     // item[0] is the text
        //     // item[1] is the x coordinate to fill the text at
        //     // item[2] is the y coordinate to fill the text at
        //     gCtx.strokeStyle = color
        //     gCtx.fillStyle = color
        //     gCtx.fillText(item[0], item[1], item[2]);
        //     // gCtx.strokeText(item[0], item[1], item[2])
        // })

        gCtx.font = `${size}px ${font}`
        gCtx.strokeStyle = color
        gCtx.fillStyle = color
        gCtx.fillText(txt, posX, posY, gElCanvas.width - posX - 20)
        // console.log(gCtx.measureText(txt).width + posX)

        if (idx === getMeme().selectedLineIdx) {
            markTxtLIne(memeLines[idx])
            // 3, gElCanvas.width - 10
        }
    })
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    // First, start by splitting all of our text into words, but splitting it into an array split by spaces
    let words = text.split(' ');
    let line = ''; // This will store the text of the current line
    let testLine = ''; // This will store the text when we add a word, to test if it's too long
    let lineArray = []; // This is an array of lines, which the function will return

    // Lets iterate over each word
    for (var n = 0; n < words.length; n++) {
        // Create a test line, and measure it..
        testLine += `${words[n]} `;
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        // If the width of this test line is more than the max width
        if (testWidth > maxWidth && n > 0) {
            // Then the line is finished, push the current line into "lineArray"
            lineArray.push([line, x, y]);
            // Increase the line height, so a new line is started
            y += lineHeight;
            // Update line and test line to use this word as the first word on the next line
            line = `${words[n]} `;
            testLine = `${words[n]} `;
        }
        else {
            // If the test line is still less than the max width, then add the word to the current line
            line += `${words[n]} `;
        }
        // If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something
        if (n === words.length - 1) {
            lineArray.push([line, x, y]);
        }
    }
    // Return the line array
    return lineArray;
}


//checks if text reached end of line
function isLineFinish(memeLines, idx, txt, size) {
    if (memeLines[idx].posX + gCtx.measureText(txt).width + 15 + size >= gElCanvas.width) {
        return true
    }
    return false
}

function onSetLineTxt(txt) {
    setLineTxt(txt)

    renderMeme()
}

function onSetTextColor(color) {
    setColor(color)

    renderMeme()
    renderEditBtns()
}

function onSetFontSize(multiplier) {
    setFontSize(multiplier)
    renderMeme()
}

function onSwitchLine() {
    switchLine()
    renderMeme()
    renderEditBtns()
}

function markTxtLIne({ posY, size, posX, txt }, startX = getSelectedLine().lineFrame.posX, width = getSelectedLine().lineFrame.width) {
    gCtx.strokeStyle = 'black'
    gCtx.strokeRect(posX, posY - size, gCtx.measureText(txt).width, size + 10)

    drawCircle(posX, posY - size, 'left')
    drawCircle(posX, posY + 10, 'left')
    drawCircle(posX + gCtx.measureText(txt).width, posY + 10, 'right')
    drawCircle(posX + gCtx.measureText(txt).width, posY - size, 'right')
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

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()

    window.addEventListener('resize', () => {
        resizeCanvas()
        renderCanvas()
        renderMeme()
    })
}

function onDown(ev) {
    const pos = getEvPos(ev)
    if (!isLineClicked(pos)) return

    // setLineDrag(true, getSelectedLine())
    // if (!Object.keys(getSelectedLine().lineFrame).length) {
    //     setLineFrame()
    // }
    gStartPos = pos
    // if (isCursorOnEndge(pos, getSelectedLine())) {
    //     getSelectedLine().isResize = true
    // }
    if (isCursorOnCircle(pos)) {
        getSelectedLine().isResize = true
        document.body.style.cursor = 'ne-resize'
        return
    }


    if (isCursorInPath(pos, getSelectedLine())) {
        getSelectedLine().isDrag = true
    }

    renderMeme()
    renderEditBtns()
}

function onMove(ev) {
    // console.log(ev)
    if (!getSelectedLine()) return
    const pos = getEvPos(ev)
    const { isDrag, isResize } = getSelectedLine()

    if (!isDrag && !isResize) {
        if (isCursorOnCircle(pos)) document.body.style.cursor = 'ne-resize'
        else document.body.style.cursor = 'context-menu'
        return
    }

    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y

    // if (pos.x >= gElCanvas.width || pos.y >= gElCanvas.height) return

    if (isResize) {
        txtResize(dx, getClickedCircle(), ev)
        gStartPos = pos

        renderMeme()
        return
    }

    // document.body.style.cursor = 'grabbing'
    moveLine(dx, dy)
    gStartPos = pos

    renderMeme()
}

function getClickedCircle() {
    return gCircles.find(circle => circle.isClicked)
}

function onUp() {
    setLineDrag(false)
    getSelectedLine().isResize = false
    gCircles = []
    document.body.style.cursor = 'context-menu'

    // gCtx.beginPath()
}

function isCursorOnCircle(pos) {
    let isOnCircle = false
    gCircles.forEach((circle, idx) => {
        const distance = Math.sqrt((circle.x - pos.x) ** 2 + (circle.y - pos.y) ** 2)
        // getSelectedLine().isResize = (distance <= circle.size) ? true : false
        if (distance <= circle.size) {
            isOnCircle = true
            gCircles[idx].isClicked = true
        }
    })

    return isOnCircle
}

function isCursorInPath(pos, { posY, size, posX, txt, font }) {
    gCtx.rect(posX, posY - size, gCtx.measureText(txt).width + posX, size + 10)
    return gCtx.isPointInPath(pos.x, pos.y)
}




function renderCursorOnEndge(pos, { posY, size, posX, txt, font }) {
    gCtx.rect(posX, posY - size, gCtx.measureText(txt).width + posX, size + 10)
    gCtx.font = `${size}px ${font}`

    if (gCtx.isPointInStroke(pos.x, pos.y)) {
        document.body.style.cursor = 'col-resize'
        // console.log('hi')
        return true
    }
    // else if (gCtx.isPointInStroke(pos.x, pos.y) && gCtx.measureText(txt).width + posX <= pos.x + 1 &&  gCtx.measureText(txt).width >= pos.x - 1) {
    //     document.body.style.cursor = 'col-resize'
    //     return true
    // }
    else {
        document.body.style.cursor = 'context-menu'
        return false
    }
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
    console.log('hi')
    gCtx.fillStyle = "white"

    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)

    // need render?
}

function resizeCanvas(ratio = '') {
    const elCanvasContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elCanvasContainer.offsetWidth
    console.log(gElCanvas.width)
    gElCanvas.width = elCanvasContainer.offsetheight
    const elBody = document.querySelector('body')
}

function resizeCanvasByRatio(ratio) {
    const elCanvasContainer = document.querySelector('.canvas-container')
    let containerWidth = elCanvasContainer.offsetWidth
    const containerHeight = elCanvasContainer.offsetHeight
    // console.log(elCanvasContainer.style.width)
    // console.log(containerWidth , containerHeight)
    containerWidth = containerHeight * ratio
    elCanvasContainer.style.width = `${containerWidth}px`
    // console.log(elCanvasContainer.style.width)
}

function onSaveMeme() {
    saveMeme()
}

function onUpload() {
    document.querySelector('.share-modal').classList.remove('hide-modal')
    uploadImg()
}

function onCloseShareModal() {
    document.querySelector('.share-modal').classList.add('hide-modal')
}

function onDownload(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}

function onDeleteLine() {
    deleteLine()
    renderMeme()
    renderEditBtns()
}

function onLocateLine(direction) {
    locateLine(direction)
    renderMeme()
    renderEditBtns()
}

function renderEditBtns() {
    const meme = getMeme().lines[getMeme().selectedLineIdx]
    document.querySelector('.txt-edit').placeholder = meme.txt
    document.querySelector('.txt-edit').value = ''

    document.querySelector('.color-edit').value = meme.color
    document.querySelector('.color-lbl').style.color = meme.color

}


function onChangeFont(font) {
    changeFont(font)
    renderMeme()
}

function onCreateCustomMeme(ev) {
    // debugger
    createCustomMeme()
    loadImageFromInput(ev, setCustomImgContent)
}

function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()
    // After we read the file
    reader.onload = function (event) {
        let img = new Image() // Create a new html img element
        img.src = event.target.result // Set the img src to the img file we read
        // Run the callBack func, To render the img on the canvas
        img.onload = onImageReady.bind(null, img)
        // Can also do it this way:
        // img.onload = () => onImageReady(img)
    }
    reader.readAsDataURL(ev.target.files[0]) // Read the file we picked
}


function renderImg() {
    renderCanvas()
    renderMeme()
    toggleGalleryEditor('editor')
}

function setCustomImgContent(imgContent) {
    // console.log(imgContent.src)
    // imgContent = imgContent.split('"')[1]
    // console.log(imgContent)
    const meme = getMeme()
    meme.customImgUrl = imgContent.src
    renderMeme()
    toggleGalleryEditor('editor')
}

function drawCircle(x, y, side, size = 3, color = 'black') {
    gCtx.beginPath()
    gCtx.lineWidth = '6'
    gCtx.arc(x, y, size, 0, 2 * Math.PI)
    gCtx.strokeStyle = 'white'
    gCtx.stroke()
    gCtx.fillStyle = color
    gCtx.fill()
    gCircles.push({ x, y, size, isClicked: false, side })
}

function onAddEmoji(elEmoji) {
    addLine()
    getMeme().lines[getMeme().lines.length - 1].txt = elEmoji.innerText

    console.log(getMeme().lines[getMeme().lines.length - 1].txt)

    renderMeme()
}