/* Caching all ImageSets at first visit of the site
window.onload = function(){
    new Images().loadIntoCache(function(images,ctx,i,canvas) {
        ctx.drawImage(images[i], 0, 0, canvas.width, canvas.height)
      })
}
*/

function clickedTile(game) {
    $(".js-card").click(function () {
        var row = $(this).attr('data-row')
        var col = $(this).attr('data-col')
        game.engine.updateOnClick(row, col)
    })
}

window.onload = function() {
    var game = new Game()
    clickedTile(game)
}