let timeOut
let counter = 0

function clickedTile(game) {
    debugger
    if (!game.solved) {
        let ray
        $('.js-card').parent().click(function () {
            let row = $(this).children(0).attr('data-row')
            let col = $(this).children(0).attr('data-col')
            ray = $('<div class="light-rays horizontal-rays hor-light-ray-' + col + '"></div>')
            ray.addClass('js-hor-light-ray-' + col + '-' + game.numPics)
            if (!($(this).children(0).next().length))
                ray.insertAfter($(this).children(0))
            $(this).children(0).next().toggleClass('show-rays')
            game.updateOnClick(row, col)
            counter++
        })
    }
}

function unbindTile() {
    $('.js-card').parent().prop('onclick', null).off('click')
}

function setStars(game) {
    for (let i = 1; i <= game.stars; i++) {
        let star = '#' + i.toString() + '-star'
        $(star).toggleClass('checked')
    }
}

function resetStars(game) {
    for (let i = 1; i <= game.stars; i++) {
        let star = '#' + i.toString() + '-star'
        $(star).attr('class', 'fa fa-star')
    }
}

function resetChange() {
    $('#btn-change-lvl').css('background-color', '#2996b7')
}

function setScoreAndTime(game) {
    $('#js-game-score').html("TOTAL SCORE " + game.totalScore.toString().padStart(5, 0))
    $('#js-game-timer').html("LEVEL TIMER 00:" + (game.level.time / 1000))
    $('#js-game-score-menu').html("SCORE " + game.levelScore.toString().padStart(3, 0))
    $('#js-game-timer-menu').html("TIME 00:" + (Math.floor((game.timeNeeded / 1000))))
}

function resetScoreAndTime(game) {
    $('#js-game-score').html("TOTAL SCORE " + game.totalScore.toString().padStart(5, 0))
    $('#js-game-timer').html("LEVEL TIME: 00:" + (game.level.time / 1000))
    $('#js-game-score-menu').html("SCORE 000")
    $('#js-game-timer-menu').html("TIME 00:00")
}

function showFailedMenu(game) {
    let failed = $('#fail-menu-container')
    $(failed).toggleClass('hide-box')
}

function showMenu() {
    $('#menu-container').toggleClass('hide-box')
}

function clearGUI(game) {
    $('#js-current-lvl').html((game.levelNumber + 1).toString())
    $('#time-bar').css('width', '100%')
    $('#btn-next-lvl').css('background-color', 'darkgrey')

    if (game.failed)
        $('#fail-menu-container').toggleClass('hide-box')
    else $('#menu-container').toggleClass('hide-box')
}

function changeButtonBackground() {
    $('#btn-next-lvl').css('background-color', '#4CAF50')
    $('#btn-change-lvl').css('background-color', 'lightgrey')
}

function updateFuseBar(game) {
    //replaces progress() 
}

function progress(timeleft, timetotal, timeBar, clickMax, clickCount) {
    let progressBarWidth = timeleft * timeBar.width() / timetotal
    timeBar.children(0).animate({
        width: progressBarWidth
    }, 0.02).html()
    if (clickCount == counter - 1)
        clickCount++
        //TODO replace all these statements with the equation
        if (clickCount > clickMax)
            timeleft -= 0.02
    if (clickCount > clickMax + 1)
        timeleft -= 0.03
    if (clickCount > clickMax + 2)
        timeleft -= 0.04
    if (clickCount > clickMax + 3)
        timeleft -= 0.05
    if (timeleft < 0)
        timeleft = 0.02
    if (timeleft > 0) {
        timeOut = setTimeout(function () {
            progress(timeleft - 0.02, timetotal, timeBar, clickMax, clickCount)
        }, 20)
    }
}

function stopTimer() {
    clearTimeout(timeOut)
}

/*
 * Yeah you might wonder why this server-side code is on the frontend - well
 * I am sorry we didn't had the time to start learning Node.js since we had to
 * implement new features on a weekly basis without the time to do things properly :(
 * 
 */
function setBackgroundImg() {
    let images = [
        'back_1.png', 'back_2.jpg',
        'back_3.jpg', 'back_4.jpg', 'back_5.jpg',
        'back_6.jpg', 'back_7.jpg'
    ]
    let i = Math.floor(Math.random() * images.length) + 0
    let url = 'img/background/' + images[i]
    $('#game-container').css('background-image', 'url(' + url + ')')
}

/*
 * Hey there, I am so sorry that you have to deal with this mess of code.
 * If, who ever you might be are in this miserable situation that you have to
 * add new features to this GUI then I would suggest you do everthing in/from scratch.
 * 
 * This function dynamically creates the HTML for a N * N game field and uses the iterators to
 * number all cols and rows. These numbers are neccessary, since they will be used in the GameEngine
 * to determine, which exact tile was clicked.
 */
function loadGameGUI(game) {
    setBackgroundImg()
    //toggleLvlCompleteBox()
    let numPics = defineNumPics(game)
    let area = clearGame()
    for (let i = 0; i < numPics + 1; i++) {
        let row = createRow(i, numPics)
        for (let j = 0; j < numPics + 3; j++) {
            let col = createCol(j)
            let tile = createTile()
            if (numPics == 3)
                col = create3x3Cols(j, tile)
            else if (numPics == 4)
                col = create4x4Cols(j, tile)
            else if (numPics == 5)
                col = create5x5Cols(j, tile)
            if (i == 0) {
                if (j < numPics)
                    tile.attr('id', 'js-basis-image-' + j.toString()) //basis images at the top
                else if (j == numPics)
                    tile = createScoreTile()
                else if (j == numPics + 1)
                    tile = createTimeTile()
                else if (j == numPics + 2)
                    tile = createEmptyTile()
            } else {
                if (j == numPics)
                    tile.attr('id', 'js-user-image-' + (i - 1).toString()) //user images at the second col from the right
                else if (j == numPics + 1)
                    tile.attr('id', 'js-starting-image-' + (i - 1).toString()) //starting images at the far right col
                else if (j == numPics + 2)
                    tile = createValidationTile(i, col)
                else {
                    tile = createGlassTile(i, j)
                }
            }
            col.append(tile)
            row.append(col)
        }
        area.append(row)
    }
    addVerticalRays(numPics)
    addImageFrame()
    preventImageDragging()
    handleGlassClicks()
}

function defineNumPics(game) {
    let numPics
    if (game == undefined) {
        let lv = new Level(0) //always first Level
        numPics = lv.numPics
    } else numPics = game.numPics
    return numPics
}

function clearGame() {
    let area = $('#js-game-wrapper')
    area.html('')
    return area
}

function createRow(i, numPics) {
    let row = $('<div />', {
        'class': 'js-row-' + i.toString() +
            ' row justify-content-between align-items-center tile-row' +
            ' tile-row-' + numPics + ' no-select'
    })
    return row
}

function createCol(j) {
    let col = $('<div />', {
        'class': 'js-col-' + j.toString() +
            ' tile-square-wrapper no-select'
    })
    return col
}

function create3x3Cols(j, tile) {
    let col = $('<div />', {
        'class': 'js-col-' + j.toString() +
            ' tile-square-wrapper js-tile-square-wrapper-3 no-select'
    })
    return col
}

function create4x4Cols(j, tile) {
    let col = $('<div />', {
        'class': 'js-col-' + j.toString() +
            ' tile-square-wrapper  js-tile-square-wrapper-4 no-select'
    })
    tile.addClass('js-4-tiles-per-row')
    return col
}

function create5x5Cols(j, tile) {
    let col = $('<div />', {
        'class': 'js-col-' + j.toString() +
            ' tile-square-wrapper  js-tile-square-wrapper-5 no-select'
    })
    tile.addClass('js-5-tiles-per-row')
    return col
}

function createTile() {
    let tile = $('<canvas />', {
        'class': 'tile-square no-select'
    })
    return tile
}

function createTimeTile() {
    let tile = $('<div />', {
        'class': ' tile-square hide-shadow no-select'
    })
    tile.attr('id', 'js-game-timer')
    tile.html('LEVEL TIMER')
    return tile
}

function createScoreTile() {
    let tile = $('<div />', {
        'class': ' tile-square hide-shadow no-select'
    })
    tile.attr('id', 'js-game-score')
    tile.html('TOTAL SCORE 00000')
    return tile
}

function createEmptyTile() {
    let tile = $('<div />', {
        'class': ' tile-square hide-shadow no-select'
    })
    tile.attr('id', 'js-empty-tile')
    tile.html('')
    return tile
}

function createGlassTile(i, j) {
    let tile = $('<img src="" />', {
        'class': 'tile-square no-select'
    })
    tile.addClass('js-card')
    let src_tile = 'img/glas-screw.png'
    tile.attr("src", src_tile);
    tile.attr('data-row', (i - 1).toString())
    tile.attr('data-col', (j).toString())
    return tile
}

function createValidationTile(i, col) {
    col.addClass('tile-validation-wrapper')
    let tile = $('<img src="" />', {
        'class': 'tile-square no-select'
    })
    tile.attr('id', 'js-validation-image-' + (i - 1).toString())
    tile.addClass('js-validation')
    let invalid = 'img/invalid.png'
    //let valid = 'img/valid.png'
    tile.attr("src", invalid)
    return tile
}

function addVerticalRays(numPics) {
    let currentRay
    for (let i = 0; i < numPics; i++) {
        currentRay = '<div class="light-rays no-select js-vert-light-ray-' + numPics + '"' + 'id="light-ray-' + i.toString() + '"></div>'
        $(currentRay).insertAfter('#js-basis-image-' + i.toString())
    }
}

function addImageFrame() {
    let frame = '<img class="frame-overlay no-select" src="img/bilderrahmen.png" alt="Bilderrahmen">'
    $(frame).insertAfter('.tile-square')
}

function preventImageDragging() {
    $('img').on('dragstart', function (event) {
        event.preventDefault()
    })
}

function handleGlassClicks() {
    $('.js-card').parent().click(function () {
        $(this).children().toggleClass('js-is-flipped')
    })
    $('.js-card').parent().hover(function () {
        $(this).css('cursor', 'pointer')
    })
}