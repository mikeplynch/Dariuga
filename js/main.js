/*
    main.js
    Created by Michael Lynch - 2016
    Singleton controller class
*/

'use strict';

var app = app || {};

app.main = {
    // properties
    WIDTH: 1200,
    HEIGHT: 600,
    canvas: undefined,
    ctx: undefined,
    lastTime: 0,
    animationID: 0,
    debug: true,
    paused: false,
    player: undefined,
    playerMode: undefined,
    stars: new Array(),
    bullets: new Array(),
    enemies: new Array(),
    
    init : function () {
        console.log("app.main.init() called");
        
        // initialize some properties
        this.canvas = document.querySelector('canvas');
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.ctx = this.canvas.getContext('2d');
        
        this.playerMode = 'light';
        this.player = this.makePlayer();
        this.makeStars(200);
        
        // for testing collisions;
        
        window.onkeydown = this.checkKeyboard.bind(this);
        
        // start the game loop
        this.update();
    },
    
    update : function () {
        // 1 - LOOP
        this.animationID = requestAnimationFrame(this.update.bind(this));
        
        // 2 - PAUSED?
        // TODO
        
        // 3 - Calulate dt
        var dt = this.calculateDeltaTime();
        
        // 4 - Update
        this.updatePlayer(dt);
        
        // 5 - DRAW
        // draw background
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
        
        // draw and update stars
        this.drawStars(this.ctx);
        
        // draw player
        this.player.draw(this.ctx);
        this.updateBullets(this.ctx, dt);
        
        
        // draw debug info
		if (this.debug) {
			// draw dt in bottom right corner
			this.fillText(this.ctx, "dt: " + dt.toFixed(3), this.WIDTH - 80, this.HEIGHT - 10, "12pt lucida sans", "white");
		}
    },
    
    fillText: function (ctx, string, x, y, css, color) {
        ctx.save();
        // https://developer.mozilla.org/en-US/docs/Web/CSS/font
        ctx.font = css;
        ctx.fillStyle = color;
        ctx.fillText(string, x, y);
        ctx.restore();
	},
    
    calculateDeltaTime: function () {
		var now, fps;
		now = (+new Date);
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 12, 60);
		this.lastTime = now;
		return 1 / fps;
    },
    
    makePlayer: function () {        
        var drawPlayer = function(ctx){
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + 40, this.y + 20);
            ctx.lineTo(this.x, this.y + 40);
            ctx.closePath();
            ctx.fillStyle = (this.playerMode == 'light' ? '#29B6F6' : 'black');
            ctx.strokeStyle = (this.playerMode == 'light' ? 'white' : '#C70039');            
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        };
        
        var movePlayer = function(delta){ // changes the y position of the player
            player.y += delta;
        }
        
        var player = {};
        
        player.x = this.WIDTH / 10;
        player.y = (this.HEIGHT / 2) - 20;
        
        player.draw = drawPlayer;
        player.move = movePlayer;
        
        return player;
    },
        
    updatePlayer : function (dt) {
        this.player.playerMode = this.playerMode;
        
    },
    
    makeBullet: function () {
        var b = {};        
        b.x = this.player.x + 20;
        b.y = this.player.y + 20;
        b.mode = this.player.playerMode;
        b.fillStyle = (this.playerMode == 'light' ? '#29B6F6' : 'black');
        b.strokeStyle = (this.playerMode == 'light' ? 'white' : '#C70039');
        this.bullets.push(b);
    },
    
    updateBullets: function(ctx, dt){
        if (this.bullets.length > 0){
            for(var i = 0; i < this.bullets.length; i++){
                ctx.save();
                ctx.beginPath();
                var x = this.bullets[i].x += 500 * dt;
                var y = this.bullets[i].y;           
                ctx.arc(x, y, 6, Math.PI *2, false);
                ctx.closePath();
                ctx.fillStyle = this.bullets[i].fillStyle;
                ctx.strokeStyle = this.bullets[i].strokeStyle;
                ctx.fill();
                ctx.stroke();
                ctx.restore();
                if (x > this.WIDTH){
                    this.bullets.splice(i, 1);
                }
            }
        }
    },  
    
    checkKeyboard: function(e){    
        var key = e.keyCode;
        if(key == 38 || key == 87){
            //console.log("up");
            this.player.move(-10);
        }
        if(key == 40 || key == 83){
            //console.log("down");
            this.player.move(10);
        }
        if(key == 32){
            //console.log("space pressed, firing");
            this.makeBullet();
        }
        if(key == 81){  //q
            // toggle playermode
            this.playerMode = (this.playerMode == 'light' ? 'dark' : 'light');
            
            //console.log("q pressed, switch mode")
        }
    },
    
    makeStars: function(numStars){
        for(var i = 0; i < numStars; i++){
            var s = {};
            s.x = Math.random() * this.WIDTH;
            s.y = Math.random() * this.HEIGHT;
            s.fillStyle = "rgba(250,250,250,"+ Math.random() +")";
            this.stars.push(s);
        }
    },
    
    drawStars: function(ctx){
        var s;
        for(s in this.stars){
            
            ctx.save();
            ctx.shadowColor = "#FAFAFA";
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 10;
            ctx.fillStyle = this.stars[s].fillStyle;
            
            //move the stars
            var x = this.stars[s].x -= 0.5;
            if(this.stars[s].x <= 0){
                this.stars[s].x = this.WIDTH;
            }
            var y = this.stars[s].y;
            ctx.fillRect(x, y, 3, 3);
            ctx.restore();
        }
    },
    
    makeEnemies: function(){
        // static for now for testing
        // enemy one - light
        var l = {};
        l.x = 1050;
        l.y = 200;
        l.mode = 'light';
        l.hits = 0;
        
        // enemy two - dark
        var d = {};
        d.x = 1050;
        d.y = 400;
        d.mode = 'dark';
        d.hits = 0;
    },
    
    drawEnemies: function(ctx, dt){
        
    },
    
    checkForCollision: function(){
        if (this.bullets.length > 0){
            for(var i = 0; i < this.bullets.length; i++){
                var b = this.bullets[i];
                if(this.enemies > 0){
                    for (var j = 0; j < this.enemies.length; j++){
                        var e = this.enemies[j];
                        if(b.type == e.type){
                            
                        }
                    }
                }
            }
        }
    }
};