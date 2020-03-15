/* Author: Sean Langley */
/* Date: March 7 2020   */

var flag = true;
var canvas = document.getElementById("myCanvas");
var score_text = document.getElementById("score");
var ctx = canvas.getContext("2d");
var pipes = [];
var player = (function(){
    var height = 50;
    return {
        width: height,
        height: height,
        x: 20,
        y: canvas.height-height,
        vel: 0,
        score: 0
    }
})();

newPipePair();

document.addEventListener('keydown', function(event) {
    if (event.key == " ") {
        player.vel = 10;
    }
});

var updateloop = setInterval(update, 20);

function update(){
    fill(player, "white");
    player.y -= player.vel;
    player.vel -= 1;
    if (player.y > canvas.height - player.height){
        player.vel = 0;
        player.y = canvas.height - player.height;
    }
    fill(player, "red");

    for (i = 0; i < pipes.length; i++){
        fill(pipes[i], "white");
        pipes[i].x -= 10;
        fill(pipes[i], "red");
        if (didCollide(player, pipes[i])) {
            clearInterval(updateloop);
            score_text.insertAdjacentHTML("afterend", "<p>You lose</p>");
        }
    }

    if (pipes.length > 0 && pipes[0].x + pipes[0].width < 0){
        pipes.shift();
        pipes.shift();
    }
    last_pipe = pipes[pipes.length -1];

    if (last_pipe.x + last_pipe.width < canvas.width - 200){
        newPipePair();
    }
}

function fill(obj, color){
    ctx.fillStyle = color;
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function didCollide(player, pipe){
    if (player.x < pipe.x + pipe.width &&
        player.x + player.width > pipe.x &&
        player.y < pipe.y + pipe.height &&
        player.y + player.height > pipe.y) {
            return true;
        }
    if (player.x < pipe.x + pipe.width &&
        player.x + player.width > pipe.x &&
        pipe.scored == false &&
        pipe.bottom == true ){
            player.score += 1;
            score_text.innerHTML = "Score: " + player.score;
            pipe.scored = true;
        }
        
    return false;
}

function newPipePair(){
    var total_pipe_length = canvas.height - 200;
    var top_pipe_height = RandomInRange(50, total_pipe_length - 50);
    pipes.push(newPipe("top", top_pipe_height));
    pipes.push(newPipe("bottom", total_pipe_length - top_pipe_height));
}

function newPipe(orientation, height){
    var width = 60;
    var x = canvas.width - width, y;

    y = (orientation == "top") ? 0 : canvas.height - height;
    return {
        width: width,
        height: height,
        x: x,
        y: y,
        scored: false,
        bottom: (orientation == "top") ? false : true,
    }
}

function RandomInRange(min, max){
    return Math.floor(Math.random() * (max - min) ) + min;
}