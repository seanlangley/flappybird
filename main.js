/* Author: Sean Langley */
/* Date: March 15 2020   */

var canvas          = document.getElementById("myCanvas");
var score_text      = document.getElementById("score");
var high_score_text = document.getElementById("High score");
var lose_text       = document.getElementById("lose text");
var restart_button  = document.getElementById("restart button");
var flappy          = document.getElementById("flappy")
var background      = document.getElementById("background");
var pipe_top        = document.getElementById("pipe top");
var pipe_body       = document.getElementById("pipe body");
var top_pipe_head   = document.getElementById("top pipe head");
var top_pipe_body   = document.getElementById("top pipe body");
var high_score = 0;
var ctx = canvas.getContext("2d");
var hitbox = false;
var gameover = false;
var pipes = [];
var player;
var updateloop;

document.addEventListener('keydown', function(event) {
    if (event.key == " ") {
        player.vel = 10;
        player.angular_momentum = 10;
        player.has_jumped = true;
        player.is_jumping = true;
    }
    if (event.key == "r"){
        restart();
    }
});

restart();

function update(){
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    update_player();
    update_pipes();
    if (gameover){
        clearInterval(updateloop);
        if (player.score > high_score){
            high_score = player.score;
            high_score_text.innerHTML = "High score: " + high_score;
        }
        lose_text.innerHTML = "You lose!";
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
    pipes.length = 0;
    gameover = false;

    newPipePair();
    player = (function(){
        var height = 50;
        return {
            width: 50,
            height: height,
            angular_momentum: 0,
            angle: 0,
            x: 20,
            y: canvas.height-height,
            vel: 0,
            score: 0,
            has_jumped: false,
            is_jumping: false,
        }
    })();
    clearInterval(updateloop);
    updateloop = setInterval(update, 20);
}

function update_player(){
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
        if (player.is_jumping){
            if (degrees(player.angle) > degrees(30)){
                player.angle = 30;
                player.angular_momentum = 0;
                player.is_jumping = false;
            }
            else {
                player.angular_momentum -= 1;
            }
        }
        player.angle -= player.angular_momentum;
    }
    var translate_x = player.x + player.width/2;
    var translate_y = player.y + player.height/2;
    ctx.translate(translate_x, translate_y);
    ctx.rotate(degrees(player.angle));
    ctx.translate(-translate_x, -translate_y);
    if (hitbox){
        ctx.fillStyle = "red";
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }
    ctx.drawImage(flappy, player.x-15, player.y-15, 88, 88);
    ctx.translate(translate_x, translate_y);
    ctx.rotate(degrees(-player.angle));
    ctx.translate(-translate_x, -translate_y);
}

function update_pipes(){
    for (i = 0; i < pipes.length; i++){
        curr_pipe = pipes[i];
        curr_pipe.x -= 10;
        if (hitbox){
            fill(curr_pipe);
        }
        if (curr_pipe.bottom){
            ctx.drawImage(pipe_top, curr_pipe.x-20, curr_pipe.y-15,
                pipe_top.width, pipe_top.height);
                var y_offset = pipe_top.height;
                while (y_offset < canvas.height){
                    ctx.drawImage(pipe_body, curr_pipe.x-20, curr_pipe.y-31 + y_offset,
                        pipe_body.width, pipe_body.height);
                        y_offset += 39;
                }
        }
        else{
            ctx.drawImage(top_pipe_head, curr_pipe.x-15,
                curr_pipe.height-top_pipe_head.height+15,
                top_pipe_head.width, top_pipe_head.height);
            var y_offset = top_pipe_head.height+20;
            while (y_offset < curr_pipe.height + top_pipe_body.height) {
                ctx.drawImage(top_pipe_body, curr_pipe.x-15,
                    curr_pipe.height-y_offset,
                    top_pipe_body.width, top_pipe_body.height);
                y_offset += top_pipe_body.height-43;
            }
        }
        if (didCollide(player, curr_pipe)) {
            gameover = true;
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

function fill(obj){
    if (typeof obj !== "undefined"){
        ctx.fillStyle = "red";
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    }
}

function RandomInRange(min, max){
    return Math.floor(Math.random() * (max - min) ) + min;
}

function degrees(angle){
    return angle*Math.PI/180;
}