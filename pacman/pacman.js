var canvas = document.getElementById("myCanvas");
var lose_text = document.getElementById("lose text");
var ctx = canvas.getContext("2d");
var updateloop;
let velocity = 5;
var pacman;
var ghost;
var dots = [];
var win = false;
var gameover = false;

document.addEventListener('keydown', function(event){
    if (event.key == "w"){
        pacman.direction = "up";
    }

    else if (event.key == "a"){
        pacman.direction = "left";
    }

    else if (event.key == "s"){
        pacman.direction = "down";
    }

    else if (event.key == "d"){
        pacman.direction = "right";
    }
});

restart();

function update(){
    clear();
    update_pacman();
    update_ghost();
    update_dots();
    if (gameover){
        clearInterval(updateloop);
    }
}

function update_pacman(){
    move(pacman);
    if (didCollide(pacman, ghost)){
        gameover = true;
        lose_text.innerHTML = "You lose!";
    }
    fill(pacman);
}

function update_ghost(){
    var distances = [];
    var x_dist, y_dist;
    var min_distance = Infinity;
    //0 = up, 1 = down, 2 = left, 3 = right
    var min_index;
    var position_increase;

    position_increase = velocity;
    x_dist = Math.abs(ghost.x - pacman.x);
    for (i = 0; i < 2; i++){
    //up and down
        y_dist = Math.abs(ghost.y - position_increase - pacman.y);
        distances.push(Math.sqrt(Math.pow(x_dist, 2) + Math.pow(y_dist, 2)));
        position_increase = -velocity;
    }

    position_increase = velocity;
    y_dist = Math.abs(ghost.y - pacman.y);
    for (i = 0; i < 2; i++){
        // left and right
        x_dist = Math.abs(ghost.x - position_increase - pacman.x);
        distances.push(Math.sqrt(Math.pow(x_dist, 2) + Math.pow(y_dist,2)));
        position_increase = -velocity;
    }

   for(i = 0; i < 4; i++){
        if (distances[i] < min_distance){
            min_distance = distances[i];
            min_index = i;
        }
   }
   if (min_index == 0){
       ghost.direction = "up";
   }
   else if (min_index == 1){
       ghost.direction = "down";
   }
   else if (min_index == 2){
       ghost.direction = "left";
   }
   else if (min_index == 3){
       ghost.direction = "right";
   }
    move(ghost);
    fill(ghost);
}

function move(obj){
    if (obj.direction == "up" && obj.y > 0){
        obj.y -= velocity;
    }
    else if (obj.direction == "down" &&
             obj.y < canvas.height - obj.height) {
        obj.y += velocity;
        
    }
    else if (obj.direction == "left" && obj.x >= 0) {
        obj.x -= velocity; 
    }
    else if (obj.direction == "right" &&
             obj.x < canvas.width - obj.width) {
        obj.x += velocity; 
    }
}

function restart(){
    pacman = (function(){
        var height = 50;
        return {
            width: 50,
            height: height,
            x: 20,
            y: canvas.height-height,
            score: 0,
            is_moving: false,
            direction: "right",
        }
    })();

    ghost = (function(){
        var width = 50;
        return {
            width: width,
            height: 50,
            x: canvas.width - width,
            y: 0,
            direction: "left"
        }
    })();
    create_dots();
    clearInterval(updateloop);
    updateloop = setInterval(update, 20);
}

function create_dots(){
    var curr_x, curr_y = 0;
    dot_distance = 50;
    while (curr_y  < canvas.height){
        curr_x = 0; 
        while (curr_x < canvas.width){
            var new_dot = {
                x: curr_x,
                y: curr_y,
                width: 5,
                height: 5,
                enabled: true,
            }
            dots.push(new_dot);
            curr_x += dot_distance;
        }
        curr_y += dot_distance;
    } 
}

function update_dots(){
    for (i = 0; i < dots.length; i++){
        if (didCollide(pacman, dots[i])){
            dots[i].enabled = false;
        }
        if (dots[i].enabled){
            fill(dots[i]);
        }
    }
    dots_copy = [];
    for (i = 0; i < dots.length; i++){
        if (dots[i].enabled){
            dots_copy.push(dots[i]);
        }
    }
    dots = dots_copy; 
    if (dots.length == 0){
        win = true;
    } 
}

function didCollide(obj1, obj2){
    if (obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y) {
            return true;
        }
    return false;
}

function fill(obj){
    if (typeof obj !== "undefined"){
        ctx.fillStyle = "red";
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
   } 
}

function clear(){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
