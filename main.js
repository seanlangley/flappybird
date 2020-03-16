/* Author: Sean Langley */
/* Date: March 7 2020   */

var canvas = document.getElementById("myCanvas");
var score_text = document.getElementById("score");
var high_score_text = document.getElementById("High score");
var lose_text = document.getElementById("lose text");
var restart_button = document.getElementById("restart button");
var flappy = document.getElementById("flappy")
var high_score = 0;
var ctx = canvas.getContext("2d");
var hitbox = false;
var pipes = [];
var player;
var updateloop;

document.addEventListener('keydown', function(event) {
    if (event.key == " ") {
        player.vel = 10;
        player.angular_momentum = 20;
        player.has_jumped = true;
    }
});

restart();

function update(){
    update_player("disable");
    player.y -= player.vel;
    player.vel -= 1;

    if (player.y > canvas.height - player.height){
        player.vel = 0;
        player.y = canvas.height - player.height;
    }
    if (player.has_jumped){
        if (degrees(player.angle) < degrees(-30)){
            player.angular_momentum = -1;
        }
        player.angle -= player.angular_momentum;
        player.angular_momentum -= 1;
        if (degrees(player.angle) > degrees(30)){
            player.angular_momentum = 0;
        }
    }
    update_player("enable");

    for (i = 0; i < pipes.length; i++){
        clear(pipes[i]);
        pipes[i].x -= 10;
        fill(pipes[i]);
        if (didCollide(player, pipes[i])) {
            clearInterval(updateloop);
            if (player.score > high_score){
                high_score = player.score;
                high_score_text.innerHTML = "High score: " + high_score;
            }
            lose_text.innerHTML = "You lose!";
            break;
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

function restart(){
    restart_button.blur();
    lose_text.innerHTML = "";
    score_text.innerHTML = "Score: 0";
    high_score_text.innerHTML = "High score: " + high_score;
    for(var i = 0; i < pipes.length; i++){
        clear(pipes[i]);
    }
    pipes.length = 0;
    newPipePair();
    if (typeof player != "undefined"){
        update_player("disable");
    }
    player = (function(){
        var height = 50;
        return {
            width: height,
            height: height,
            angular_momentum: 0,
            angle: 0,
            x: 20,
            y: canvas.height-height,
            vel: 0,
            score: 0,
            has_jumped: false,
        }
    })();
    update_player("enable");
    clearInterval(updateloop);
    updateloop = setInterval(update, 20);
}

function update_player(new_state){
    ctx.translate(player.x, player.y);
    ctx.rotate(degrees(player.angle));
    ctx.translate(-player.x, -player.y);
    if (hitbox && new_state == "enable"){
        ctx.fillStyle = "red";
    }
    else if(new_state == "disable"){
        ctx.fillStyle = "White";
    }
    ctx.fillRect(player.x, player.y, player.width, player.height);
    if (new_state == "enable"){
        var scale = 1.75;
        var flappy_side = player.width * scale;
        ctx.drawImage(flappy, player.x-15, player.y-15, 
            player.width*scale, player.height*scale);
    }
    ctx.translate(player.x, player.y);
    ctx.rotate(degrees(-player.angle));
    ctx.translate(-player.x, -player.y);
}

function fill(obj){
    if (typeof obj !== "undefined"){
        ctx.fillStyle = "red";
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    }
}

function clear(obj){
    if (typeof obj !== "undefined"){
        ctx.fillStyle = "white";
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    }
}

function RandomInRange(min, max){
    return Math.floor(Math.random() * (max - min) ) + min;
}

function degrees(angle){
    return angle*Math.PI/180;
}