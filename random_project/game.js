const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var startButton = document.getElementById("startButton");
var restartButton = document.getElementById("restartButton");
var scoreEl = document.getElementById("scoreElement")
console.log(scoreEl)
var score = 0;

var colorArray = [
    '#264653',
    '#2a9d8f',
    '#e9c46a',
    '#f4a261',
    '#e76f51'
];

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
}

function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1
    const yDist = y2 - y1
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

var enemyArray = []

var projectilesArray = []

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}



var input_keyboard;
window.addEventListener("keydown", (event) => {
    input_keyboard = event.key

})


window.addEventListener("click", (event) =>{
    mouse.x = event.clientX
    mouse.y = event.clientY
    projectilesArray.push(new Projectile) 
})



class Player{
    constructor(){
        this.x = randomIntFromRange(25, innerWidth-25)
        this.y = randomIntFromRange(25, innerHeight-25)
        this.dx = 3
        this.dy = 3
        this.radius = 25
        this.color = 'white'
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.strokeStyle = 'rgba(0,0,0,0.1)'
        c.stroke()
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        }
    
    update() {
        this.draw()
        switch (input_keyboard) {
            case "s":
                this.y += this.dy
                break
            case "w":
                this.y -= this.dy
                break
            case "a":
                this.x -= this.dx
                break
            case "d":
                this.x += this.dx
                break
        }
    }
}


class Enemy{
    constructor(x, y, radius, dx, dy, colour){
        this.radius = radius
        this.x = x
        this.y = y
        this.angle = Math.atan2(player.y - y, player.x - x)
        this.dx = dx
        this.dy = dy
        this.color = colour
    }

        draw() {
            c.beginPath()
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
            c.strokeStyle = this.color
            c.stroke()
            c.fillStyle = this.color
            c.fill()
            c.closePath()
        }

        update(){ 
            this.draw()
            this.x = this.x + this.dx
            this.y = this.y + this.dy
        }
    
}


class Projectile{
    constructor() {
        this.radius = 9
        this.x = player.x
        this.y = player.y
        this.angle = Math.atan2(mouse.y - this.y, mouse.x - this.x)
        this.dx = Math.cos(this.angle) * 2
        this.dy = Math.sin(this.angle) * 2
        this.color = 'white'
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.strokeStyle = this.color
        c.stroke()
        c.closePath()
    }

    update() {
        this.draw()
        this.x = this.x + this.dx
        this.y = this.y + this.dy
        
    }


}


function spawnEnemies(){
    setInterval(() => {
        const randomSpeed = randomIntFromRange(1, 3)
        const radius = randomIntFromRange(10, 30)
        const x = Math.random() * (innerWidth - radius * 2) + radius
        const y = Math.random() * (innerHeight - radius * 2) + radius
        const angle = Math.atan2(player.y - y, player.x - x)
        const dx = Math.cos(angle) * randomSpeed
        const dy = Math.sin(angle) * randomSpeed
        const colour = colorArray[Math.floor(Math.random() * colorArray.length)]
        if (distance(x, y, player.x, player.y) > player.radius + radius + 50){
            enemyArray.push(new Enemy(x, y, radius, dx, dy, colour))
        }

    }, 1000)
    
}
 



function animate() {
    animationId = requestAnimationFrame(animate)
    projectile = new Projectile()
    c.fillStyle = 'rgba(0,0,0,0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    projectile.update()

    projectilesArray.forEach(projectile => {
        projectile.update()
    })

    enemyArray.forEach((enemy, enemy_index) => {
        enemy.update()
        if ((distance(enemy.x, enemy.y, player.x, player.y) < enemy.radius + player.radius) ||
         player.x  < 0 || player.x > innerWidth || player.y < 0 || player.y > innerHeight) {
            cancelAnimationFrame(animationId)
            restartButton.style.display = "block";
        }

        if(enemy.x < 0 || enemy.x > innerWidth || enemy.y < 0 || enemy.y > innerWidth){
            enemyArray.splice(enemy_index, 1)
        }

        projectilesArray.forEach((projectile, projectile_index) => {
            if(distance(enemy.x, enemy.y, projectile.x, projectile.y) < enemy.radius +  projectile.radius){
                projectilesArray.splice(projectile_index, 1)
                enemyArray.splice(enemy_index, 1)
                score += 50;
                scoreEl.innerHTML = score
            }

            if (projectile.x < 0 || projectile.x > innerWidth || projectile.y < 0 || projectile.y > innerWidth) {
                projectilesArray.splice(projectile_index, 1)
            }
            
        })
    })

}

function start() {
    startButton.style.display = "none";
    player = new Player()
    animate()
    spawnEnemies()
    console.log("Start:"+ enemyArray, projectilesArray, score)
}

function restart() {
    restartButton.style.display = "none";
    enemyArray = []
    projectilesArray = []
    scoreEl.innerHTML = 0
    console.log("Reset:" + enemyArray, projectilesArray, score)
    player.x = innerWidth / 2
    player.y = innerHeight / 2
    animate()

}
