function clickedTile(game) {
    $('.js-card').click(function () {
        var row = $(this).attr('data-row')
        var col = $(this).attr('data-col')
        game.updateOnClick(row, col)
    })
}

function loadGameGUI(game) {
    if (game == undefined)
        numPics = 3
    else numPics = game.numPics
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
                    ' tile-square-wrapper col-2 text-center'
            })
            let tile = $('<canvas />', {
                'class': 'tile-square'
            })


            if (numPics == 4) {
                col = $('<div />', {
                    'class': 'js-col-' + j.toString() +
                        ' tile-square-wrapper  js-tile-square-wrapper-4 col-1 text-center'
                })
                tile.addClass('js-4-tiles-per-row')
            } else if (numPics != 4) {
                col = $('<div />', {
                    'class': 'js-col-' + j.toString() +
                        ' tile-square-wrapper col-2 text-center'
                })
                tile.removeClass('js-4-tiles-per-row')
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
                    tile.attr('id', "js-basis-image-" + j.toString())
            } else {
                if (j == numPics)
                    tile.attr('id', "js-starting-image-" + (i - 1).toString())
                else if (j == numPics + 1)
                    tile.attr('id', "js-user-image-" + (i - 1).toString())
                else {
                    tile.addClass('js-card')
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
        $(this).toggleClass('js-is-flipped');
    });
}