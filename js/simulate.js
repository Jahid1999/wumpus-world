class Simulate {
    constructor(world) {
        this.world = world;
    }

    play() {       
        isManualMode = false;
        var ai = new Ai (this.world);
        let nextMoveArray = [];
        setInterval(()=>{
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
        }, 2000);        
    }
}
