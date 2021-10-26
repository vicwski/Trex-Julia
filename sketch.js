var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var trex, trex_correndo, trexCollided;
var solo, soloInvisivel, imagemSolo;
var nuvem, imagemNuvem, grupoNuvens;

var obstaculos, grupoObstaculos;
var obstaculos1, obstaculos2, obstaculos3, obstaculos4, obstaculos5, obstaculos6; 

var pontuacao;

var fimDeJogo, imgFimDeJogo;
var reiniciar, imgReiniciar;

var somCheckPoint, somDie, somJump;



function preload(){

  //imagens
  trex_correndo =  loadAnimation("trex1.png","trex3.png","trex4.png");
  trexCollided = loadImage("trex_collided.png");
  
  imagemSolo = loadImage("ground2.png");
  
  imagemNuvem = loadImage("cloud.png");
    
  obstaculos1 = loadImage("obstacle1.png");
  obstaculos2 = loadImage("obstacle2.png");
  obstaculos3 = loadImage("obstacle3.png");
  obstaculos4 = loadImage("obstacle4.png");
  obstaculos5 = loadImage("obstacle5.png");
  obstaculos6 = loadImage("obstacle6.png");
  
  imgFimDeJogo = loadImage("gameOver.png");
  imgReiniciar = loadImage("restart.png");
  
  //sons
  somCheckPoint = loadSound("checkPoint.mp3");
  somDie = loadSound("die.mp3");
  somJump = loadSound("jump.mp3");
    
}

function setup() {
  
 createCanvas(600, 200);

  //criar um sprite do trex
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided", trexCollided);
  trex.scale = 0.5;

  //criar um sprite do solo
  solo = createSprite(200,180,400,20);
  solo.addImage(imagemSolo);
  solo.x = solo.width /2;
  
  //solo invisível
  soloInvisivel = createSprite(200,195,650,20)
  soloInvisivel.visible = false
  
  //criar grupos
  grupoNuvens = createGroup();
  grupoObstaculos = createGroup();
  
  trex.setCollider("circle",0,0,40);
  trex.debug = false;
  
  fimDeJogo = createSprite(300,100);
  fimDeJogo.addImage(imgFimDeJogo);
  
  reiniciar = createSprite(300,140);
  reiniciar.addImage(imgReiniciar);
  reiniciar.scale = 0.6;
  
  pontuacao = 0;
   
}

function draw() {
  background("white");

  text("Pontuação: " + pontuacao,500,30);
    
  if (estadoJogo === JOGAR){
    solo.velocityX = -4;
    
    fimDeJogo.visible = false;
    reiniciar.visible = false;
    
    pontuacao = pontuacao + Math.round(getFrameRate()/60);
    
    if (pontuacao % 600 === 0 && pontuacao > 0){
      somCheckPoint.play();
    }
    
    
    if (solo.x<0){
      solo.x = solo.width/2;
    }

    //o trex pula quando a tecla espaço é acionada 
    if(keyDown("space") && trex.y >= 110) {
      trex.velocityY = -10;
      somJump.play();
    }
  
    //gravidade
    trex.velocityY = trex.velocityY + 0.8
   
    //funções
    gerarNuvens();
  
    gerarObstaculos();
    
    if (grupoObstaculos.isTouching(trex)){
      //trex.velocityY = -10;
      //somJump.play();
      estadoJogo = ENCERRAR;
      somDie.play();
      //mudar a animação
      trex.changeAnimation("collided", trexCollided);
    }
  }
    else if (estadoJogo === ENCERRAR){
      
      fimDeJogo.visible = true;
      reiniciar.visible = true;
      
      //parar os objetos
      solo.velocityX = 0;
      
      
      grupoObstaculos.setVelocityXEach(0);
      grupoNuvens.setVelocityXEach(0);
      
      //impedir que os objetos desapareçam
      grupoObstaculos.setLifetimeEach(-1);
      grupoNuvens.setLifetimeEach(-1);
          
      if (mousePressedOver(reiniciar)){
        reset();
      }
      
    }
   
  //impedir o trex de cair 
  trex.collide(soloInvisivel);
    
  drawSprites();
}

function gerarObstaculos(){
  if(frameCount % 60 === 0){
    obstaculos = createSprite(600,160,10,40);
    obstaculos.velocityX = -4;
    obstaculos.lifetime = 300;
    obstaculos.scale = 0.5;
    
    var aleatorio = Math.round(random(1,6));
    switch(aleatorio) {
      case 1: obstaculos.addImage(obstaculos1);
            break;
      case 2: obstaculos.addImage(obstaculos2);
            break;
      case 3: obstaculos.addImage(obstaculos3);
            break;
      case 4: obstaculos.addImage(obstaculos4);
            break;
      case 5: obstaculos.addImage(obstaculos5);
            break;
      case 6: obstaculos.addImage(obstaculos6);
            break;
        default: break;
   }
    
    //adicionar os obstaculos ao grupo de obstaculos
    grupoObstaculos.add(obstaculos);
  }
}

function gerarNuvens(){
  if (frameCount % 60 === 0){
    nuvem = createSprite(600,100,40,10);
    nuvem.addImage(imagemNuvem);
    nuvem.velocityX = -3;
    nuvem.y = Math.round(random(10,100));
    nuvem.lifetime = 220;
    
    //profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionar as nuvens ao grupo de nuvens
    grupoNuvens.add(nuvem);
       
  }
}