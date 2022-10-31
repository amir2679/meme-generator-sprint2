'use strict'

renderSearchBar()

function renderImgs() {
    let imgs = getImgs()
    var strHTMLS = imgs.map((img) =>
        `
        <img onclick="onImgSelect(this)" class="grid-item" src="${img.url}"  data-imgId="${img.id}">
        `
    )
    document.querySelector('.grid-container').innerHTML = strHTMLS.join('')


}

function renderSavedMemes() {
    const savedMemes = getSavedMemes()

    var strHTMLS = savedMemes.map((meme, idx) =>
        `
        <img onclick="onSavedMemeSelect(this)" class="grid-item" src="${meme.imgUrl}"  data-memeIdx="${idx}">
        `
    )
    document.querySelector('.grid-container').innerHTML = strHTMLS.join('')
}

function onSavedMemeSelect(elImg) {
    setGMeme(getSavedMemes()[elImg.dataset.memeidx])

    renderCanvas()
    renderMeme()
    renderEditBtns()

    toggleGalleryEditor('editor')

}

function onImgSelect(elImg) {
    // console.log('hi')
    // document.querySelector('.txt-edit').value = ''
    setImg(elImg.dataset.imgid)
    // resizeCanvas()
    // renderCanvas()
    renderMeme()
    renderEditBtns()

    toggleGalleryEditor('editor')
}

function onOpenGallery() {
    renderImgs()

    toggleGalleryEditor('gallery')
}

function onGenerateRandMeme() {
    createRandMeme()
    renderMeme()
    renderEditBtns()

    toggleGalleryEditor('editor')
}

function onOpenSavedMemes() {
    // loadSavedMemes()
    // _savedMemesInit()
    console.log(gSavedMemes)
    if (!getSavedMemes() || !getSavedMemes().length) return

    toggleGalleryEditor('gallery')
    renderSavedMemes()
}


function toggleGalleryEditor(show) {
    switch (show) {
        case 'gallery':
            document.querySelector('.editor-container').classList.add('hide')
            document.querySelector('.gallery-container').classList.remove('hide')
            break;

        case 'editor':
            document.querySelector('.editor-container').classList.remove('hide')
            document.querySelector('.gallery-container').classList.add('hide')
            break;
    }
}

function renderKeywords(keywordSearchCountMap) {
    let strKeywords = ''
    for (const keyword in keywordSearchCountMap) {
        let size = keywordSearchCountMap[keyword]
        strKeywords += `
        <span onclick="onKeywordsClick(this)" class="keyword" style="font-size:${size * 0.3 + 16}px">${keyword}</span>`
    }
    // console.log(strKeywords)
    let elKeywords = document.querySelector('.key-words')
    elKeywords.innerHTML = strKeywords
    elKeywords.style.fontSize = ``
}

function onSaveImg(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    document.querySelector('.save-modal').classList.remove('hide-save-modal')
    setTimeout(() => {
        document.querySelector('.save-modal').classList.add('hide-save-modal')
    }, 1000)
    // console.log(imgContent)
    setImgContent(imgContent)
}

function onSetImgFilter(txt) {
    setImgFilter(txt)
    renderKeywords(getKeywordSearchCountMap())
    renderImgs()
}

function onKeywordsClick(elKeyword) {
    const fontNumSize = +elKeyword.style.fontSize.split('px')[0]
    gFilterByTxt = elKeyword.innerText
    renderImgs()
    if(fontNumSize > 45)    return
    elKeyword.style.fontSize = `${fontNumSize * 1.1}px`
}

function renderSearchBar() {
    let strHTMLS = ''
    for (const key in gKeywordSearchCountMap) {
        strHTMLS += `<option value="${key}">`
    }


    console.log(strHTMLS)
    document.querySelector('.search-options').innerHTML = strHTMLS
}