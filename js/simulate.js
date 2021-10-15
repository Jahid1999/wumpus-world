class Simulate {
    constructor(world) {
        this.world = world;
    }

    play() {       
        isManualMode = false;
        var ai = new Ai (this.world);
        setInterval(()=>{
            let nextMove = ai.getNextMove();
            if (nextMove[0]==0)
            {
                this.world.agent.up();
            }
            else if (nextMove[0]==1)
            {
                this.world.agent.right();
            }
            else if (nextMove[0]==2)
            {
                this.world.agent.down();
            }
            else if (nextMove[0]==3)
            {
                this.world.agent.left();
            }

            //array from next move
            //trigger ui till array is more than 0
            //call next move when array is empty
        }, 2000);        
    }
}
