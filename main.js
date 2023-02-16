// 캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImg, spaceshipImg, bulletImg, enemyImg, gameoverImg;
let gameOver = false; // true이면 게임이 끝남, false이면 게임이 안끝남
let score = 0;

// 우주선 좌표
let spaceshipX = canvas.width/2-32;
let spaceshipY = canvas.height-64;

let bulletList = []//총알을 저장하는 리스트

//총알 좌표 
function Bullet(){
    this.x = 0; 
    this.y = 0;
    this.init = function(){
        this.x = spaceshipX + 20;
        this.y = spaceshipY;
        this.alive = true; //true면 살아있는 총알 false면 죽은 총알
        bulletList.push(this);
    };
    this.update = function() {
        this.y -= 7;
    };

    this.checkHit = function(){
        for(let i = 0; i < enemyList.length; i++){
            if(this.y <=enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x + 40){
                // 총알이 죽게됨. 적군이 사라지면서 점수 획득
                score++;
                this.alive = false; //죽은 총알
                enemyList.splice(i, 1);
            };
        };
    };
};

function generateRandomValue(min, max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min;
    return randomNum;
};

let enemyList = [];
function Enemy(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.y = 0;
        this.x=generateRandomValue(0, canvas.width-48);
        enemyList.push(this);
    };
    this.update = function(){
        this.y += 3; //적군의 속도 조절

        if(this.y >= canvas.height-48){
            gameOver = true;
            // console.log("gameOver");

        };
    };
};

function loadImg() {
    backgroundImg = new Image();
    backgroundImg.src ="img/background.png";

    spaceshipImg = new Image();
    spaceshipImg.src ="img/spaceshipImg.png";

    bulletImg = new Image();
    bulletImg.src ="img/bulletImg.png";

    enemyImg = new Image();
    enemyImg.src ="img/enemyImg.png";

    gameoverImg = new Image();
    gameoverImg.src ="img/game-over.webp";
};

let keysDown = {}
function setupKeyboardListener() {
    document.addEventListener("keydown", function(event){
        keysDown[event.key] = true;
        // console.log("키다운 객체에 들어간 값은?", keysDown);
        // console.log("무슨 키가 눌렸어?",event.key);
    });
    document.addEventListener("keyup", function(){
        delete keysDown[event.key];
        // console.log("버튼 클릭 후", keysDown);

        if(event.keyCode == 32){
            createBullet(); //총알 생성
        };
    });
};

function createBullet(){
    // console.log("총알 생성!");
    let b = new Bullet(); //총알 하나 생성
    b.init();
    // console.log("새로운 총알 리스트", bulletList);
};

function createEnemy(){
    const intarvar = setInterval(function(){
        let e = new Enemy();
        e.init();
    } ,1000);
};

function update(){
    if('ArrowRight' in keysDown){
        spaceshipX += 5; //우주선 속도
    };         //right

    if('ArrowLeft' in keysDown){
        spaceshipX -= 5; //우주선 속도
    };        //Left

    if(spaceshipX <= 0){
        spaceshipX = 0;
    };
    if(spaceshipX >= canvas.width-64){
        spaceshipX = canvas.width-64;
    };

    //총알의 y좌표 업데이트 하는 함수 호출
    for(let i = 0; i < bulletList.length; i++){
        if(bulletList[i].alive){
            bulletList[i].update();
            bulletList[i].checkHit();
        };
    };

    for(let i = 0; i < enemyList.length; i++){
        enemyList[i].update();
    };
};

function render() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImg, spaceshipX, spaceshipY);
    ctx.fillText(`Score : ${score}`, 20,20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    

    for(let i = 0; i < bulletList.length; i++){
        if(bulletList[i].alive){
            ctx.drawImage(bulletImg, bulletList[i].x, bulletList[i].y);
        };
    };

    for(let i = 0; i < enemyList.length; i++){
        ctx.drawImage(enemyImg, enemyList[i].x, enemyList[i].y);
    };
};

function main() {
    if(!gameOver){
        update(); //좌표값 업데이트
        render(); //그려주기
        // console.log("animation call main function");
        requestAnimationFrame(main);
    } else {
        ctx.drawImage(gameoverImg, 10, 160, 380, 380);
    };

};

loadImg();
setupKeyboardListener();
createEnemy();
main();

//방향키 누르면
//우주선의 xy좌표가 바뀌고
//다시 render 그려준다.

//총알 만들기 
//1. 스페이스바를 누르면 총알 발사
//2. 총알 발사 = 총알의 y값이 --, 총알의 x값은? 스페이스를 누른 순간의 우주선 x좌표
//3.발사된 총알들은 총알 배열에 저장을 한다.
//4. 총알들은 x,y 좌표값이 있어야 한다.
//5. 총알 베열을 가지고 render 그려준다.
