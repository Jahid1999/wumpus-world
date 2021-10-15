class Simulate {
    constructor(world) {
        this.world = world;
    }

    play() {     
        this.world.agent.diretion = 1;
        isManualMode = false;
       interval = setInterval(()=>{
            this.world.agent.down();
        }, 1000);        
    }

}
