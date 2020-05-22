var canvas = document.getElementById("myCanvas");
var lose_text = document.getElementById("lose text");
var ctx = canvas.getContext("2d");
var updateloop;
let velocity = 5;
var pacman;
var ghost;
var dots = [];
var maze = [];
var win = false;
var gameover = false;


function main(){
    restart();
}

main();

function update(){
    clear();
    draw_maze();
    update_pacman();
    update_ghost();
    update_dots();
    if (gameover){
        clearInterval(updateloop);
    }
}

function update_pacman(){
    collided = false;
    for (let i = 0; i < maze.length; i++){
        if (willCollide(pacman, maze[i])){
            collided = true;
        }
    }
    if (!collided){
        pacman.move();
    }
    if (didCollide(pacman, ghost)){
        gameover = true;
        lose_text.innerHTML = "You lose!";
    }
    fill(pacman);
}

function draw_maze(){
    maze.forEach(fill);
}

function create_maze(){
    var line = (function(){
        var x = pacman.width;
        var width = canvas.width - 2*x;
        var height = pacman.height;
        var y = 100;
        return {
            x: x,
            y: y,
            width: width,
            height: height,
        }
    })();
    maze.push(line);
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
    if (min_index == 0) {
        ghost.direction = "up";
    }
    else if (min_index == 1) {
        ghost.direction = "down";
    }
    else if (min_index == 2) {
        ghost.direction = "left";
    }
    else if (min_index == 3) {
        ghost.direction = "right";
    }
    ghost.move();
    fill(ghost);
}



function restart(){
    var height = 50, width = 50;
    pacman = new Movable(20, canvas.height-height, 50, height, false, "up");
    ghost = new Movable(canvas.width - width, 0, width, height, true, "left");
    create_dots();
    create_maze();
    clearInterval(updateloop);
    updateloop = setInterval(update, 20);
}

function create_dots(){
    var curr_x, curr_y = 0;
    dot_distance = 50;
    while (curr_y  < canvas.height){
        curr_x = 0; 
        while (curr_x < canvas.width){
            dots.push(new Dot(curr_x, curr_y, 5, 5));
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

function willCollide(obj1, obj2){
    var obj1_copy = Object.assign({}, obj1);
    if (obj1.direction == "up"){
        obj1_copy.y -= velocity;
        if (didCollide(obj1_copy, obj2)){
            return true;
        }
    }
    else if(obj1.direction == "down"){
        obj1_copy.y += velocity;
        if (didCollide(obj1_copy, obj2)){
            return true;
        }
    }
    else if(obj1.direction == "left"){
        obj1_copy.x -= velocity;
        if (didCollide(obj1_copy, obj2)){
            return true;
        }
    }
    else if(obj1.direction == "right"){
        obj1_copy.x += velocity;
        if (didCollide(obj1_copy, obj2)){
            return true;
        }
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
