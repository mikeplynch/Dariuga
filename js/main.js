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
    
    init : function () {
        console.log("app.main.init() called");
        
        // initialize some properties
        this.canvas = document.querySelector('canvas');
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.ctx = this.canvas.getContext('2d');
        
        this.playerMode = 'light';
        this.player = this.makePlayer();
        
        
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
        this.checkKeyboard();
        //this.moveBullets(dt);
        this.updatePlayer(dt);
        
        // 5 - DRAW
        // draw background
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
        
        
        this.player.draw(this.ctx);
        
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
        

        
        /*document.addEventListener('keydown', function(event) {
            if(event.keyCode == 38 || event.keyCode == 87) {
                console.log('Up was pressed');
                //this.player.move(10);
                console.dir(this);
            }
            else if(event.keyCode == 40 || event.keyCode == 83) {
                console.log('Down was pressed');
                this.player.move(-10);
            }
        });
        */
    
    },
    
    makeBullet: function () {
        var drawBullet = function(ctx){
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.player.x, this.player.y, 10, Math.PI *2, false);
            ctx.closePath();
            ctx.fillStyle = (this.playerMode == 'light' ? '#29B6F6' : 'black');
            ctx.strokeStyle = (this.playerMode == 'light' ? 'white' : '#C70039');            
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
        
        var moveBullet = function(dt){
            this.x += 100 * dt;
        }
        
        var b = {};
        
        b.x = this.player.x + 20;
        b.y = this.player.y;
        b.type = this.player.playerMode;
        b.draw = drawBullet;
        b.move = moveBullet;
        
        return b;
    },
    
    checkKeyboard: function(){    
        window.onkeydown = function(e){
            var key = e.keyCode;
            if(key == 38 || key == 87){
                console.log("up");
                console.dir(this.this);
            }
            else if(key == 40 || key == 83){
                console.log("down");
            }
            else if(key == 32){
                console.log("space pressed, firing");
            }
            else if(key == 81){
                console.log("q pressed, switch mode")
            }
        }
    }
};