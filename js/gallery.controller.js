'use strict'

function renderImgs() {
    let imgs = getImgs()
    var strHTMLS = imgs.map((img) =>
        `
        <img onclick="onImgSelect(this)" class="grid-item" src="${img.url}"  data-imgId="${img.id}">
        `
    )
    // console.log(strHTMLS)
    document.querySelector('.grid-container').innerHTML = strHTMLS.join('')
    // console.log(document.querySelector('.gallery-container'))

}

function onImgSelect(elImg){
    // console.log('hi')
    document.querySelector('.txt-edit').value = ''
    setImg(elImg.dataset.imgid)
    renderMeme()

    document.querySelector('.editor-container').classList.remove('hide')
    document.querySelector('.gallery-container').classList.add('hide')
}

function onOpenGallery() {
    document.querySelector('.editor-container').classList.add('hide')
    document.querySelector('.gallery-container').classList.remove('hide')
}