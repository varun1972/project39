var PLAY=1;
var END=0;
var WIN=2;

var kng,kng_running,kng_collided;
var jungle,invisibleJungle;
var jungleImg;
var obstaclesGroup,obstacle;
var shrubsGroup;
var shrub1, shrub2, shrub3;
var score=0;
var gameOver,restart;
var gameOverImg;
var gameState=PLAY;
var restartImg;

function preload() {
    kng_running=loadAnimation("images/kangaroo1.png","images/kangaroo2.png","images/kangaroo3.png");
    kng_collided=loadAnimation("images/kangaroo1.png");
    jungleImg=loadAnimation("images/bg.png");
    obstacle=loadAnimation("images/stone.png");
    shrub1=loadAnimation("images/shrub1.png");
    shrub2=loadAnimation("images/shrub2.png");
    shrub3=loadAnimation("images/shrub3.png");
    gameOverImg=loadAnimation("images/gameOver.png");
    restartImg=loadAnimation("images/restart.png");

}

function setup(){
    var canvas = createCanvas(800,400);
     jungle=createSprite(400,100,400,20);
     jungle.addAnimation("jungle",jungleImg);
     jungle.scale=0.3;
     jungle.x=width/2;

     kng=createSprite(50,200,20,50);
     kng.addAnimation("running",kng_running);
     kng.addAnimation("collided",kng_collided);
     kng.scale=0.15;
     kng.setCollider("circle",0,0,300);
    
     invisibleJungle=createSprite(400,350,1600,10);
     invisibleJungle.visible=false;

     shrubsGroup=new Group();
     obstaclesGroup=new Group();

  
}

function draw(){
    background(355);
    kng.x=camera.x-270;
    if(gameState===PLAY){
        jungle.velocityx=-3;
        if(jungle.x<100){
         jungle.x=400;
        }
        console.log(kng.y);
        if(keyDown("space") && kng.y>270){
            kng.velocityY=-16;
        }
        kng.velocityY=kng.velocityY+0.8;
        spawnShrubs();
        spawnObstacles();
        kng.collide(invisibleJungle);

        if(obstaclesGroup.isTouching(kng)){
            gameState=END;
        }
        if(shrubsGroup.isTouching(kng)){
            shrubsGroup.destroyEach();
            score=score+1;
        }
    }
    
    else if(gameState===END){
        gameOver.x=camera.position.x;
        restart.x=camera.position.x;
        gameOver.visible=true;
        restart.visible=true;
        kng.velocityY=0;
        jungle.velocityx=0;
        obstaclesGroup.setVelocityXEach(0);
        shrubsGroup.setVelocityXEach(0);
        kng.changeAnimation("collided",kng_collided);
        obstaclesGroup.setLifeTimeEach(-1);
        shrubsGroup.setLifeTimeEach(-1);
        if(mousePressedOver(restart)){
            reset();
        }
    }
    else if(gameState===WIN){
        jungle.velocityX=0;
        kng.velocityY=0;
        obstaclesGroup.setVelocityXEach(0);
        shrubsGroup.setVelocityXEach(0);
        kng.changeAnimation("collided",kng_collided);
        obstaclesGroup.setLifeTimeEach(-1);
        shrubsGroup.setLifeTimeEach(-1);
    }
    drawSprites();
    textSize(20);
    stroke(3);
    fill("black");
    text("Score : "+score,camera.position.x,50);
    if(score>=5){
        kng.visible=false;
        textSize(30);
    stroke(3);
    fill("black");
    text("congratulations! You win the game! ",70,200);

    }
}

function spawnShrubs(){
    if(frameCount%150===0){
        var shrub=createSprite(camera.position.x+500,330,40,10);
        shrub.velocityX=-(6+3*score/100);
        shrub.scale=0.6;
        var rand=Math.round(random(1,3));
        switch(rand){
            case 1:shrub.addImage(shrub1);
                   break;
            case 2:shrub.addImage(shrub2);
                   break;
            case 3:shrub.addImage(shrub3);
                   break;
            default:break;       
        }
        shrub.scale=0.05;
        shrub.lifetime=400;
        shrub.setCollider("reactangle",0,0,shrub.width/2,shrub.height/2);
        shrubsGroup.add(shrub);
    }
}

function spawnObstacles(){
    if(frameCount%120===0){
        var obstacle=createSprite(camera.position.x+400,330,40,40);
        obstacle.velocityX=-(6+3*score/100);
        obstacle.scale=0.15;      
        obstacle.lifetime=400;
        obstacle.setCollider("rectangle",0,0,200,200);
        obstaclesGroup.add(obstacle);
    }

}

function reset(){
    gameState=PLAY;
    gameOver.visible=false;
    restart.visible=false;
    kng.visible=true;
    kng.changeAnimation("running",kng_running);
    obstaclesGroup.destroyEach();
    shrubsGroup.destroyEach();
    score=0;
}