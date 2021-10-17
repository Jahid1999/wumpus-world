class Agent {
    constructor(pos, world) {
        this.position = pos;
        // 0: up, 1: right, 2: down, 3: left
        this.direction = 1;
        this.world = world;
        this.alive = true;
        this.hasArrow = true;
        this.collectedGold = 0;
        world.showRoom(pos.x, pos.y);
        // world.showRoom(pos.x - 1, pos.y);
        // world.showRoom(pos.x, pos.y - 1);
        // world.showRoom(pos.x + 1, pos.y);
        // world.showRoom(pos.x, pos.y + 1);
    }

    display() {
        let img;
        switch (this.direction) {
            case 0:
                img = agent_up_image;
                break;
           case 1:
                img = agent_right_image;
                break;
           case 2:
                img = agent_down_image;
                break;
           case 3:
                img = agent_left_image;
                break;
        }
        if (this.alive) {
            var gap = this.world.roomSize/10
            image(img, this.position.x * this.world.roomSize + gap, this.position.y * this.world.roomSize + gap, this.world.roomSize - 2 * gap, this.world.roomSize - 2 * gap);
            if (this.hasArrow) {
                image(arrow_overlay_image, this.position.x * this.world.roomSize, this.position.y * this.world.roomSize, this.world.roomSize, this.world.roomSize);
            }
        }
    }

    getCurrentRoom() {
        return this.world.getRoom(this.position.x, this.position.y);
    }

    up() {
        if (this.alive && this.world.wumpus.alive) {
            if(isManualMode) {
                if (this.direction != 0) {
                    this.direction = 0;
                }
                else if (this.position.y > 0) {
                    this.position.y--;
                    this.world.showRoom(this.position.x, this.position.y);
                }
            }

            else {
                if (this.direction != 0) {
                    this.direction = 0;
                }
                if (this.position.y > 0) {
                    this.position.y--;
                    this.world.showRoom(this.position.x, this.position.y);
                }
            }
            this.checkCurrentRoom();
        }
    }

    right() {
        if (this.alive && this.world.wumpus.alive) {
            if(isManualMode) {
                if (this.direction != 1) {
                    this.direction = 1;
                }
                else if (this.position.x < this.world.roomsPerRow - 1) {
                    this.position.x++;
                    this.world.showRoom(this.position.x, this.position.y);
                }
            }

            else {
                if (this.direction != 1) {
                    this.direction = 1;
                }
                if (this.position.x < this.world.roomsPerRow - 1) {
                    this.position.x++;
                    this.world.showRoom(this.position.x, this.position.y);
                }
            }
            this.checkCurrentRoom();
        }
    }

    down() {
        if (this.alive && this.world.wumpus.alive) {
            if(isManualMode) {
                if (this.direction != 2) {
                    this.direction = 2;
                }
                else if (this.position.y < this.world.roomsPerRow - 1) {
                    this.position.y++;
                    this.world.showRoom(this.position.x, this.position.y);
                }
            }

            else {
                if (this.direction != 2) {
                    this.direction = 2;
                }
                if (this.position.y < this.world.roomsPerRow - 1) {
                    this.position.y++;
                    this.world.showRoom(this.position.x, this.position.y);
                }
            }
            this.checkCurrentRoom();
        }
    }

    left() {
        if (this.alive && this.world.wumpus.alive) {
            if(isManualMode) {
                if (this.direction != 3) {
                    this.direction = 3;
                }
                else if (this.position.x > 0) {
                    this.position.x--;
                    this.world.showRoom(this.position.x, this.position.y);
                }
            }

            else {
                if (this.direction != 3) {
                    this.direction = 3;
                }
                if (this.position.x > 0) {
                    this.position.x--;
                    this.world.showRoom(this.position.x, this.position.y);
                }
            }
            this.checkCurrentRoom();
        }
    } 

    checkCurrentRoom() {
        if (this.world.getRoom(this.position.x, this.position.y).containsWumpus() && this.world.wumpus.alive) {
            this.world.showAllRooms();
            this.kill();
        } else if (this.world.getRoom(this.position.x, this.position.y).containsPit()) {
            this.world.showAllRooms();
            this.kill();
        } else if (this.world.getRoom(this.position.x, this.position.y).containsGold()) {
            this.collectedGold += 1;
            goldCollected +=1;
            this.world.getRoom(this.position.x, this.position.y).objects.forEach(obj => {
                if (obj instanceof Gold) {
                    setTimeout(() => {
                        this.world.getRoom(this.position.x, this.position.y).removeAttribute("Glitter");
                        this.world.getRoom(this.position.x, this.position.y).objects.delete(obj);
                    }, 500);
                }
            });

            this.checkWin();
        }
        if (this.world.getRoom(this.position.x, this.position.y).containsArrow) {
            this.world.getRoom(this.position.x, this.position.y).removeArrow();
            this.hasArrow = true;
            bell_sound.play();
        }
    }

    checkWin() {
        if(this.collectedGold == this.world.totalGold) {
            clearInterval(interval);
            setTimeout(() => {
                console.log("Victory!");
                victory_sound.play();
                this.world.showAllRooms();
                Swal.fire({
                    title: 'Win!',
                    text: 'Congratulations!!',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                  }).then((result) => {  
                    if (result.isConfirmed) {    
                        restart();
                    }
                });
            }, 1000);
        }
    }

    kill() {
        clearInterval(interval);
        this.alive = false;
        defeat_sound.play();
        console.log("You died. Game over!")
    }

    shoot() {
        if (!this.hasArrow || !this.alive) {
            return;
        }
        var victory = false;
        switch (this.direction){
            case 0:
                var x = this.position.x;
                for (var y = this.position.y; y >= 0; y--) {
                    if (this.world.getRoom(x, y).containsWumpus()) {
                        victory = true;
                        break;
                    }
                }
                break;
            case 1:
                var y = this.position.y;
                for (var x = this.position.x; x < roomsPerRow; x++) {
                    if (this.world.getRoom(x, y).containsWumpus()) {
                        victory = true;
                        break;
                    }
                }
                break;
            case 2:
                var x = this.position.x;
                for (var y = this.position.y; y < roomsPerRow; y++) {
                    if (this.world.getRoom(x, y).containsWumpus()) {
                        victory = true;
                        break;
                    }
                }
                break;
            case 3:
                var y = this.position.y;
                for (var x = this.position.x; x >= 0; x--) {
                    if (this.world.getRoom(x, y).containsWumpus()) {
                        victory = true;
                        break;
                    }
                }
                break;
        }
        if (victory) {
            this.world.wumpus.kill();
            // console.log("Victory!");
            // victory_sound.play();
            this.world.showAllRooms();
            if (worldAutoIncrement) {
                setWorldSize(parseInt(roomsPerRow) + 1);
            }
        } else {

        }

        this.hasArrow = false;
    }

}