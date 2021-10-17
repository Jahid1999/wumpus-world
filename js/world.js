class World {
    constructor(roomsPerRow, pitPercentage, totalGold) {
        this.roomsPerRow = roomsPerRow;
        this.pitPercentage = pitPercentage/100;
        this.totalGold = totalGold;
        this.roomSize = canvasSize / this.roomsPerRow;
        this.rooms = [];
        this.createRooms();
        this.agent;
        this.wumpus = null;
        this.gold = null;
        this.arrowPosition;
        this.spawnObjects();
        this.prevState = [];
    }

    createRooms() {
        for (var i = 0; i < this.roomsPerRow; i++) {
            this.rooms.push(new Array());
            for (var j = 0; j < this.roomsPerRow; j++) {
                this.rooms[i].push(new Room(createVector(i, j), this.roomSize));
            }
        }
    }

    spawnObjects() {
        var availableRooms = []
       
        for (var x = 0; x < this.roomsPerRow; x++) {
            for (var y = 0; y < this.roomsPerRow; y++) {
                availableRooms.push(x + " " + y);
            }
        }
        
        //Add Agent
        var agentX = 0;
        var agentY = 0;
        this.agent = new Agent(createVector(agentX, agentY), this);
        this.agent.getCurrentRoom().containsAgent = true;
        for (var x = -1; x <= 1; x++) {
            for (var y = -1; y <= 1; y++) {
                let posX = this.agent.position.x + x;
                let posY = this.agent.position.y + y;
                if (posX >= 0 || posX < this.roomsPerRow || posY >= 0 || posY < this.roomsPerRow) {
                    availableRooms.splice(availableRooms.indexOf(posX + " " + posY), 1);
                }
            }
        }


        if(!isFixedBoard) {
            // Add Wumpus
            var wumpusIndex = getRandomInt(availableRooms.length - 1);
            var wumpusX = parseInt(availableRooms[wumpusIndex].split(" ")[0]);
            var wumpusY = parseInt(availableRooms[wumpusIndex].split(" ")[1]);
            availableRooms.splice(wumpusIndex, 1);
            this.wumpus = new Wumpus(createVector(wumpusX, wumpusY), this);
            this.getRoom(wumpusX, wumpusY).addObject(this.wumpus);
            this.getRoom(wumpusX, wumpusY).addAttribute("Wumpus");
            for (var x = -1; x <= 1; x++) {
                for (var y = -1; y <= 1; y++) {
                    if ((x != 0 || y != 0) && Math.abs(x) + Math.abs(y) < 2) {
                        if (this.getRoom(wumpusX + x, wumpusY + y) != null) {
                            var stench = new Stench(createVector(wumpusX + x, wumpusY + y), this);
                            this.getRoom(wumpusX + x, wumpusY + y).addObject(stench);
                            this.getRoom(wumpusX + x, wumpusY + y).addAttribute("Stench");
                        }
                    }
                }
            }

            //Add Gold
            for(var i=0; i< this.totalGold; i++) {
                var goldIndex = getRandomInt(availableRooms.length);
                var goldX = parseInt(availableRooms[goldIndex].split(" ")[0]);
                var goldY = parseInt(availableRooms[goldIndex].split(" ")[1]);
                availableRooms.splice(goldIndex, 1);
                this.gold = new Gold(createVector(goldX, goldY), this);
                this.getRoom(goldX, goldY).addObject(this.gold);
                this.getRoom(goldX, goldY).addAttribute("Glitter");
            }
        
            // Add Pits
            for (var i = 0; i < Math.floor((this.roomsPerRow * this.roomsPerRow) * this.pitPercentage); i++) {
                var pitIndex = getRandomInt(availableRooms.length - 1);
                var pitX = parseInt(availableRooms[pitIndex].split(" ")[0]);
                var pitY = parseInt(availableRooms[pitIndex].split(" ")[1]);
                availableRooms.splice(pitIndex, 1);
                this.getRoom(pitX, pitY).addObject(new Pit(createVector(pitX, pitY), this));
                this.getRoom(pitX, pitY).addAttribute("Pit");
            
                for (var x = -1; x <= 1; x++) {
                    for (var y = -1; y <= 1; y++) {
                        if ((x != 0 || y != 0) && Math.abs(x) + Math.abs(y) < 2) {
                            if (this.getRoom(pitX + x, pitY + y) != null) {
                                if(!this.getRoom(pitX + x, pitY + y).attributes.has("Pit")){
                                    var breeze = new Breeze(createVector(pitX + x, pitY + y), this);
                                    this.getRoom(pitX + x, pitY + y).addObject(breeze);
                                }
                                this.getRoom(pitX + x, pitY + y).addAttribute("Breeze");
                            }
                        }
                    }
                }
            }
        }
        else {
            var wumpusX = 4;
            var wumpusY = 9;
            this.wumpus = new Wumpus(createVector(wumpusX, wumpusY), this);
            this.getRoom(wumpusX, wumpusY).addObject(this.wumpus);
            this.getRoom(wumpusX, wumpusY).addAttribute("Wumpus");
            for (var x = -1; x <= 1; x++) {
                for (var y = -1; y <= 1; y++) {
                    if ((x != 0 || y != 0) && Math.abs(x) + Math.abs(y) < 2) {
                        if (this.getRoom(wumpusX + x, wumpusY + y) != null) {
                            var stench = new Stench(createVector(wumpusX + x, wumpusY + y), this);
                            this.getRoom(wumpusX + x, wumpusY + y).addObject(stench);
                            this.getRoom(wumpusX + x, wumpusY + y).addAttribute("Stench");
                        }
                    }
                }
            }

            //Add Gold
            var golds = [[9,4],[0,7]];
            for(var i=0; i< golds.length; i++) {
                var goldX = golds[i][0];
                var goldY = golds[i][1];
                this.gold = new Gold(createVector(goldX, goldY), this);
                this.getRoom(goldX, goldY).addObject(this.gold);
                this.getRoom(goldX, goldY).addAttribute("Glitter");
            }
        
            // Add Pits
            var pits = [[1,2],[3,3],[5,2],[5,3],[6,0],[7,1],[8,1],[7,4],[8,6],[2,7],[5,5]];
            for (var i = 0; i < pits.length; i++) {
                var pitX = pits[i][0];
                var pitY = pits[i][1];
                this.getRoom(pitX, pitY).addObject(new Pit(createVector(pitX, pitY), this));
                this.getRoom(pitX, pitY).addAttribute("Pit");
            
                for (var x = -1; x <= 1; x++) {
                    for (var y = -1; y <= 1; y++) {
                        if ((x != 0 || y != 0) && Math.abs(x) + Math.abs(y) < 2) {
                            if (this.getRoom(pitX + x, pitY + y) != null) {
                                if(!this.getRoom(pitX + x, pitY + y).attributes.has("Pit")){
                                    var breeze = new Breeze(createVector(pitX + x, pitY + y), this);
                                    this.getRoom(pitX + x, pitY + y).addObject(breeze);
                                }
                                this.getRoom(pitX + x, pitY + y).addAttribute("Breeze");
                            }
                        }
                    }
                }
            }
        }

        
    }

    getRoom(x, y) {
        if (x < 0 || x > this.roomsPerRow - 1 || y < 0 || y > this.roomsPerRow - 1) {
            return null;
        } else {
            return this.rooms[x][y]
        }
    }

    showRoom(x, y) {
        if (x < 0 || x > this.roomsPerRow - 1 || y < 0 || y > this.roomsPerRow - 1) {
            return;
        }
        this.rooms[x][y].show();
    }

    hideRoom(x, y) {
        this.rooms[x][y].hide();
    }


    showAllRooms() {
        for (var i = 0; i < this.roomsPerRow; i++) {
            this.prevState.push(new Array());
            for (var j = 0; j < this.roomsPerRow; j++) {
                 this.prevState[i].push(this.rooms[i][j].isVisible());
                 this.rooms[i][j].show();                 
            }
        }
    }

    hideRooms() {
        for (var i = 0; i < this.roomsPerRow; i++) {
            for (var j = 0; j < this.roomsPerRow; j++) {
                if(this.prevState[i][j]) {
                    this.rooms[i][j].show();
                }
                else {
                    this.rooms[i][j].hide();
                }     
            }
        }
    }

    roomIsVisible(x, y) {
        return this.getRoom(x, y).visible;
    }

    display() {
        this.displayRooms();
        this.agent.display();
    }

    displayRooms() {
        for (var i = 0; i < this.roomsPerRow; i++) {
            for (var j = 0; j < this.roomsPerRow; j++) {
                this.rooms[i][j].display();
            }
        }

    }

}