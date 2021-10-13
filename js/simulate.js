class Simulate {
    constructor(world) {
        this.world = world;
    }

    play() {       
        var ai = new Ai (this.world);
        setInterval(()=>{
            let nextMove = ai.getNextMove();
            if (nextMove==0)
            {
                this.world.agent.up();
            }
            else if (nextMove==1)
            {
                this.world.agent.right();
            }
            else if (nextMove==2)
            {
                this.world.agent.down();
            }
            else if (nextMove==3)
            {
                this.world.agent.left();
            }
        }, 2000);        
    }

}
