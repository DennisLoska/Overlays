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

function start() {
    var game = new Game()
    clickedTile(game)
}


//with some debugging paramters to see the output in the console
function canvasDemo() {
    var img1 = new Images()
    img1.numImage = 3
    img1.folderImages
    //img1.generatedImages
    img1.targetPixels
    console.log("Debug InverseMatrix:")
    console.log(InverseMatrix.invert([
        [1, 1, 0],
        [1, 0, 1],
        [0, 1, 1]
    ]))
    console.log("Debug Level:")
    var level = new Level(0)
    console.log("\n")
}