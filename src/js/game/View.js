function clickedTile(game) {
    $('.js-card').click(function () {
        var row = $(this).attr('data-row')
        var col = $(this).attr('data-col')
        game.updateOnClick(row, col)
    })
}

/*
 * Generates the box after a level is completed. It is positioned fixed on the screen
 */
function loadLvlCompleteBox(game) {
    let box = '<div id="level-finished-wrapper"><div id="level-finished-box"><h3 id="js-finished-lvl">LEVEL COMPLETED!</h3><div id="star-wrapper"><span id="1-star" class="fa fa-star"></span><span id="2-star" class="fa fa-star"></span><span id="3-star" class="fa fa-star"></span></div><div id="finished-data-wrapper"><div id="js-finished-score">SCORE: </div><div id="js-finished-time">TIME:</div></div><button id="btn-next-lvl">NEXT LEVEL</button></div></div>'

    $('#js-level-finished-box').html(box)
    $('#js-finished-lvl').html('LEVEL ' + game.levelNumber + ' COMPLETED!')

    for (let i = 1; i <= game.stars; i++) {
        let star = '#' + i.toString() + '-star'
        $(star).toggleClass('checked')
    }
    $('#js-finished-score').html('Score: ' + game.levelScore.toString())
    $('#js-finished-time').html('Time: ' + (game.timeNeeded / 1000) + 's')
}

function clickedNextLvl(game) {
    $('#btn-next-lvl').click(function () {
        var row = $(this).attr('data-row')
        var col = $(this).attr('data-col')
        game.updateOnClick(row, col)
    })
}

function toggleLvlCompleteBox() {
    $('#level-finished-wrapper').toggleClass('hide-box')
}

function clearGUI(game) {
    $('.js-card').each(function () {
        $(game).removeClass('js-is-flipped')
    })
    $('#level-headline').html('Level ' + (game.levelNumber + 1).toString())
    toggleLvlCompleteBox()
}

/*
 * Yeah you might wonder why this server-side code is on the frontend - well
 * I am sorry we didn't had the time to start learning Node.js since we had to
 * implement new features on a weekly basis without the time to do things properly :(
 * 
 */
function setBackgroundImg() {
    let images = [
        'back_0.jpg', 'back_1.png', 'back_2.jpg',
        'back_3.png', 'back_4.jpg', 'back_5.jpg',
        'back_6.jpg', 'back_7.jpg', 'back_8.jpg',
        'back_9.jpg'
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
    toggleLvlCompleteBox()
    if (game == undefined) {
        let lv = new Level(0) //always first Level
        numPics = lv.numPics
    } else numPics = game.numPics
    let area = $('#js-game-wrapper')
    area.html('')
    for (let i = 0; i < numPics + 1; i++) {
        let row = $('<div />', {
            'class': 'js-row-' + i.toString() +
                ' row justify-content-center align-items-center tile-row'
        })
        for (let j = 0; j < numPics + 2; j++) {
            let col = $('<div />', {
                'class': 'js-col-' + j.toString() +
                    ' tile-square-wrapper'
            })
            let tile = $('<canvas />', {
                'class': 'tile-square'
            })
            if (numPics == 4) {
                col = $('<div />', {
                    'class': 'js-col-' + j.toString() +
                        ' tile-square-wrapper  js-tile-square-wrapper-4'
                })
                tile.addClass('js-4-tiles-per-row')
            } else if (numPics != 4) {
                if (numPics != 5) {
                    col = $('<div />', {
                        'class': 'js-col-' + j.toString() +
                            ' tile-square-wrapper'
                    })
                }
                tile.removeClass('js-4-tiles-per-row')
            }
            if (numPics == 5) {
                col = $('<div />', {
                    'class': 'js-col-' + j.toString() +
                        ' tile-square-wrapper  js-tile-square-wrapper-5'
                })
                tile.addClass('js-5-tiles-per-row')
            } else if (numPics != 5) {
                if (numPics != 4) {
                    col = $('<div />', {
                        'class': 'js-col-' + j.toString() +
                            ' tile-square-wrapper'
                    })
                }
                tile.removeClass('js-5-tiles-per-row')
            }
            if (i == 0) {
                if (j == numPics + 1) {
                    tile = $('<div />', {
                        'class': ' tile-square hide-shadow'
                    })
                    tile.attr('id', 'js-game-timer')
                    tile.html('Zeit:')
                } else if (j == numPics) {
                    tile = $('<div />', {
                        'class': ' tile-square hide-shadow'
                    })
                    tile.attr('id', 'js-game-score')
                    tile.html('Score:')
                } else if (j < numPics)
                    tile.attr('id', 'js-basis-image-' + j.toString())
            } else {
                if (j == numPics)
                    tile.attr('id', 'js-user-image-' + (i - 1).toString())
                else if (j == numPics + 1)
                    tile.attr('id', 'js-starting-image-' + (i - 1).toString())
                else {
                    tile = $('<img src="" />', {
                        'class': 'tile-square'
                    })
                    tile.addClass('js-card')
                    let src_tile = 'img/green-glass.png'
                    tile.attr("src", src_tile);
                    tile.attr('data-row', (i - 1).toString())
                    tile.attr('data-col', (j).toString())
                }
            }
            col.append(tile)
            row.append(col)
        }
        area.append(row)
    }
    $('.js-card').click(function () {
        $(this).toggleClass('js-is-flipped')
    })
}