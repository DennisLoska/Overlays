/*
 * Autoren: Dennis Loska, Luisa Kurth
 */

/*
 * global variables, which we try to keep at a minimum
 * timeOut is needed for the updateFuseBar function
 * counter also is needed for updateFuseBar and tracks the amount of clicks using clickedTile function
 * points  is equivalent to the current level-score
 */
let timeOut
let counter = 0
let points

/*
 * Thats the main function of this file. It uses almost every other function in this file.
 * When a level is loaded also this function gets called.
 * It sets the background, clears the game-area, creates the rows, columns and tiles and also
 * generates the lightrays.
 * KISS: It generates a huge block of HTML depending on numPics.
 * 
*/
function loadGameGUI(game, levelNo) {
    setBackgroundImg(levelNo)
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

/*
 * This function server 2 purposes. The first one is to calculate the points/score of the current level,
 * which depends on the clicks and time used.
 * The second is to display the fusebar correctly, depending on how much points are left.
 * When the points <= , then the falied-menu is shown.
 * 
*/
function updateFuseBar(optimum, timeOver, timeMax, fuse, clickMax, clickCount) {
    if (clickCount == counter - 1) {
        clickCount++
    }

    points = ((2 * optimum - clickCount) / optimum) * 50 + 50 * ((2 * timeMax - timeOver) / timeMax)
    //Xs' = Xs - 200-p/200 * 100%
    let progressBarPosition = -(200 - points) / 200 * 81 * 0.7

    fuse.animate({
        //width: progressBarPosition,
        'left': progressBarPosition + '%'
    }, 0.02).html()

    if (points < 0 && progressBarPosition <= -56.73) {
        unbindTile()
        showFailedMenu()
        stopTimer()
    } else {
        timeOut = setTimeout(function () {
            updateFuseBar(optimum, timeOver + 0.02, timeMax, fuse, clickMax, clickCount)
        }, 20)
    }
}

/*
 * This function tracks the current clicked tile and is used to show/hide the lightrays.
 * Each time a tile is clicked also updateOnClick() of the class GameEngine is called.
 * 
 */
function clickedTile(game) {
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

/*
 * If the player failed and the failed-menu shows up, this function is called
 * and disables all tiles form being clickable
 */
function unbindTile() {
    $('.js-card').parent().prop('onclick', null).off('click')
}


/*
 * Resets the stars, if the next level is loaded.
 * This function is called in GameEngine.
 * 
 */
function setStars(game) {
    for (let i = 1; i <= game.stars; i++) {
        let star = '#' + i.toString() + '-star'
        $(star).toggleClass('checked')
    }
}

/*
 * Resets the stars, if the next level is loaded.
 * This function is called in GameEngine.
 * 
 */
function resetStars(game) {
    for (let i = 1; i <= game.stars; i++) {
        let star = '#' + i.toString() + '-star'
        $(star).attr('class', 'fa fa-star')
    }
}

/*
 * Resets the change button, which got removed.
 * 
 */
function resetChange() {
    $('#btn-change-lvl').css('background-color', '#2996b7')
}

/*
 * Sets the score and time when a level is successfully completed. Also the displayed
 * time is formatted correctly by this function to display minutes and seconds correctly
 * in a 60 second interval.
 * 
*/
function setScoreAndTime(game) {
    //$('#js-game-score').html("TOTAL SCORE " + game.totalScore.toString().padStart(5, 0))
    $('#js-game-score').html("TOTAL SCORE")
    $('#js-game-timer').html(game.totalScore.toString().padStart(5, 0))
    //$('#js-game-timer').html("LEVEL TIMER 00:" + (game.level.time / 1000))
    $('#js-game-score-menu').html("SCORE " + game.levelScore.toString().padStart(3, 0))

    let seconds = Math.floor(game.timeNeeded / 1000)
    //console.log("Seconds: " + seconds)
    let minutes = 0
    for (let i = 0; i < seconds; i++) {
        if (i != 0 && (i % 60 == 0)) {
            minutes++
            seconds -= 60
        }
    }
    let preMinutes = "0" // add zero before minutes
    if (minutes > 9) {
        preMinutes = ""
    }
    let preSeconds = "0" // add zero before seconds
    if (seconds > 9) {
        preSeconds = ""
    }
    let time = preMinutes + minutes.toString() + ":" + preSeconds + seconds.toString()
    $('#js-game-timer-menu').html("TIME " + time)
}


/*
 * Resets the score and time on the game-area and updates the total score in the game-area.
 * 
*/
function resetScoreAndTime(game) {
    $('#js-game-score').html("TOTAL SCORE ")
    $('#js-game-timer').html(game.totalScore.toString().padStart(5, 0))
    $('#js-game-score-menu').html("SCORE 000")
    $('#js-game-timer-menu').html("TIME 00:00")
}

/*
 * Shows a different menu, when the player failed a level.
 * 
 */
function showFailedMenu() {
    let failed = $('#fail-menu-container')
    $(failed).toggleClass('hide-box')
    $('#tnt-container').toggleClass('hide-box')
}


/*
 * Shows the menu, if the player won.
 * 
 */
function showMenu() {
    $('#menu-container').toggleClass('hide-box')
    $('#tnt-container').toggleClass('hide-box')
}

/*
 * Resets the menu and tnt-bar, when a new level is loaded.
 * 
 */
function clearGUI(game) {
    $('#js-current-lvl').html((game.levelNumber + 1).toString())
    $('#time-bar').css('width', '100%')
    $('#btn-next-lvl').css('background-color', 'darkgrey')

    if (game.failed)
        $('#fail-menu-container').toggleClass('hide-box')
    else $('#menu-container').toggleClass('hide-box')
    $('#tnt-container').toggleClass('hide-box')
}

/*
 * Changes the Background of the change and next button.
 * 
 */
function changeButtonBackground() {
    $('#btn-next-lvl').css('background-color', '#4CAF50')
    $('#btn-change-lvl').css('background-color', 'lightgrey')
}

function getPoints() {
    return Math.floor(points)
}

/*
 * Utility function for the updateFuseBar() function to stop the fusebar
 * 
 */
function stopTimer() {
    clearTimeout(timeOut)
}

/*
 * Sets a specific background image of the game area for a specific level depending on the levelNumber.
 */
function setBackgroundImg(levelNum) {
    let images = [
        'background-1.jpg', 'background-2.jpg',
        'background-3.jpg', 'background-4.jpg', 'background-5.jpg',
        'background-6.jpg', 'background-7.jpg',
        'background-8.jpg', 'background-9.jpg',
        'background-10.jpg', 'background-11.jpg', 'background-12.jpg',
        'background-13.jpg', 'background-14.jpg',
        'background-15.jpg', 'background-16.jpg',
        'background-17.jpg', 'background-18.jpg', 'background-19.jpg',
        'background-20.jpg', 'background-21.jpg',
        'background-22.jpg'
    ]
    //let index = Math.floor(Math.random() * images.length) + 0
    let index = levelNum
    let url = 'img/background/' + images[index]
    $('#game-container').css('background-image', 'url(' + url + ')')
}

/*
 * Defines an initial value for numPics if the game is undefined. This happens because
 * we use the View.js before the actual game is initialized at some point in the Game.js.
 * 
 */
function defineNumPics(game) {
    let numPics
    if (game == undefined) {
        let lv = new Level(0) //always first Level
        numPics = lv.numPics
    } else numPics = game.numPics
    return numPics
}

/*
 * This function completely clears the game area.
 * 
 */
function clearGame() {
    let area = $('#js-game-wrapper')
    area.html('')
    return area
}

/*
 * This function creates all rows of the game-area.
 * 
 */
function createRow(i, numPics) {
    let row = $('<div />', {
        'class': 'js-row-' + i.toString() +
            ' row justify-content-between align-items-center tile-row' +
            ' tile-row-' + numPics + ' no-select'
    })
    return row
}

/*
 * The following 4 functions create all columns. Depending on how many image are used numPics 3,4,5 etc.
 * You could refactor all these into one single function and for example pass 3,4 and 5 as parameters to
 * determine the amount of columns.
 */

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

/*
 * The following 6 functions create all tiles in the respected columns and rows.
 * Depending on the use of the tile at position x a different tile is created
 * For example the tiles for the score, validation, glasses etc.
 * 
 */

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
    tile.html('00000')
    return tile
}

function createScoreTile() {
    let tile = $('<div />', {
        'class': ' tile-square hide-shadow no-select'
    })
    tile.attr('id', 'js-game-score')
    tile.html('TOTAL SCORE')
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

/*
 * Creates all vertical lightrays depending on the amount of images used (numPics).
 * 
 */
function addVerticalRays(numPics) {
    let currentRay
    for (let i = 0; i < numPics; i++) {
        currentRay = '<div class="light-rays no-select js-vert-light-ray-' + numPics + '"' + 'id="light-ray-' + i.toString() + '"></div>'
        $(currentRay).insertAfter('#js-basis-image-' + i.toString())
    }
}

/*
 * inserts the frames around the canvas-images.
 * 
 */
function addImageFrame() {
    let frame = '<img class="frame-overlay no-select" src="img/frame-5.png" alt="Bilderrahmen">'
    $(frame).insertAfter('.tile-square')
}

/*
 * Images cannot be dragged anymore
 * 
 */
function preventImageDragging() {
    $('img').on('dragstart', function (event) {
        event.preventDefault()
    })
}

/*
 * Flips the clicked glass tile and changes the mouse cursor.
 * 
 */
function handleGlassClicks() {
    $('.js-card').parent().click(function () {
        $(this).children().toggleClass('js-is-flipped')
    })
    $('.js-card').parent().hover(function () {
        $(this).css('cursor', 'pointer')
    })
}