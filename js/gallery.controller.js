'use strict'

function renderImgs() {
    let imgs = getImgs()
    var strHTMLS = imgs.map((img) =>
        `
        <img onclick="onImgSelect(this)" class="grid-item" src="${img.url}"  data-imgId="${img.id}">
        `
    )
    // console.log(strHTMLS)
    document.querySelector('.gallery-container').innerHTML = strHTMLS.join('')
    // console.log(document.querySelector('.gallery-container'))

}

function onImgSelect(elImg){
    // console.log('hi')
    document.querySelector('.txt-edit').value = ''
    setImg(elImg.dataset.imgid)
    renderMeme()
}