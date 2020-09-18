var trex, trex_running,ground,g2,ig1,cloudimg,ob1,ob2,ob3,ob4,ob5,ob6,ObstaclesGroup,CloudsGroup,gameOver,restart,go,rs,trex_collided;
var PLAY=1;
var END=0;
var gameState=PLAY;
var count=0;
localStorage["HI"]=0


function preload(){
  trex_running=loadAnimation("trex1.png","trex3.png","trex4.png")
  g2=loadImage("ground2.png");
  cloudimg=loadImage("cloud.png");
  ob1=loadImage("obstacle1.png");
   ob2=loadImage("obstacle2.png");
   ob3=loadImage("obstacle3.png");
   ob4=loadImage("obstacle4.png");
   ob5=loadImage("obstacle5.png");
   ob6=loadImage("obstacle6.png");
  go=loadImage("gameOver.png");
  rs=loadImage("restart.png");
  trex_collided=loadAnimation("trex_collided.png")
}

function setup() {
  createCanvas(600, 200);
  trex=createSprite (40,160,30,50);
  trex.addAnimation("trex_running", trex_running)
  trex.scale=0.5
  trex.addAnimation("trex_collided",trex_collided)
  
  ground=createSprite(300,180,600,5);
 ground.addImage ("ground",g2);
  
  ig1=createSprite(300,190,600,5);
  ig1.visible=false;
  
  CloudsGroup=new Group();
  ObstaclesGroup=new Group();
  
  gameOver=createSprite(270,120,10,10);
  restart=createSprite(270,160,10,10);
  gameOver.addImage ("game",go);
  gameOver.scale=0.7;
    restart.addImage ("games",rs);
  restart.scale=0.7;
  gameOver.visible=false;
  restart.visible=false;
  
  trex.setCollider("circle",0,0,42);
  trex.debug=true;
}

function draw() {
  background(180);
  drawSprites();

text("HI:"+localStorage["HI"],310,50);

  //display score
  text("Score: "+ count, 410, 50);
  //console.log(gameState);
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(6 + 2*count/100);
    //scoring
    count =count+ Math.round(World.frameRate/60);
    
    if (count>0 && count%100 === 0){
     // playSound("checkPoint.mp3");
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 164){
      trex.velocityY = -12 ;
    //  playSound("jump.mp3");
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
   spawnObstacles();
    
    //End the game when trex is touching the obstacle
   if(ObstaclesGroup.isTouching(trex)){
     // playSound("jump.mp3");
      gameState = END;
    //  playSound("die.mp3");
     
    }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
   CloudsGroup.setVelocityXEach(0);
    
    
    
   
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    trex.changeAnimation("trex_collided");
    
  }
  
 if(mousePressedOver(restart)) {
   reset();
  }
  
  //console.log(trex.y);
  
  //stop trex from falling down
 trex.collide(ig1);
  
}
function spawnClouds() {
  //write code here to spawn the clouds
  if (World.frameCount % 60 === 0) {
    var cloud = createSprite(600,40,40,10);
   cloud.y = Math.round(random (20,80));
    cloud.addImage("cloud",cloudimg);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 210;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    CloudsGroup.add(cloud);
  }
  
}
function spawnObstacles() {
  if(World.frameCount % 60 === 0) {
    var obstacle = createSprite(600,170,10,40);
    obstacle.velocityX = - (6 + 2*count/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch (rand){
      case 1: obstacle.addImage(ob1);
           break;
      case 2: obstacle.addImage(ob2);
           break;
      case 3: obstacle.addImage(ob3);
           break;    
      case 4: obstacle.addImage(ob4);
           break;   
      case 5: obstacle.addImage(ob5);
           break;      
      case 6: obstacle.addImage(ob6);
           break;
           default:break;
    }
           
           
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 200;
    //add each obstacle to the group
   ObstaclesGroup.add(obstacle);
  }
}
function reset(){
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  trex.changeAnimation("trex_running");
  if(localStorage["HI"]<count){
    localStorage["HI"]=count;
  }
  count=0;

}

