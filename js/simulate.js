class Simulate {
    constructor(world) {
        this.world = world;
    }

    play() {       
        setInterval(()=>{
            this.world.agent.right();
        }, 1000);        
    }

}
