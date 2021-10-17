class Simulate {
    constructor(world) {
        this.world = world;
    }

    play() {       
        isManualMode = false;
        var ai = new Ai (this.world);
        let nextMoveArray = [];
        let wumpuskillingwaiter = 0;
        interval = setInterval(()=>{
            if (nextMoveArray.length==1&&ai.killWumpus==true)
            {
                this.world.agent.direction=nextMoveArray[0];
                this.world.agent.shoot();
                ai.killWumpus = false;
                wumpuskillingwaiter=3;
            }
            else if (wumpuskillingwaiter==0)
            {
                if (nextMoveArray.length==0)
                {
                    nextMoveArray = ai.getNextMove();
                }

                if (nextMoveArray[0]==0)
                {
                    this.world.agent.up();
                }
                else if (nextMoveArray[0]==1)
                {
                    this.world.agent.right();
                }
                else if (nextMoveArray[0]==2)
                {
                    this.world.agent.down();
                }
                else if (nextMoveArray[0]==3)
                {
                    this.world.agent.left();
                }

                nextMoveArray.shift();
            }

            if (wumpuskillingwaiter>0)
            {
                wumpuskillingwaiter--;
            }

        }, 600);        
    }
}
