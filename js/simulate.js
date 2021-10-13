class Simulate {
    constructor(world) {
        this.world = world;
    }

    play() {     
        var i = 0;  
       interval = setInterval(()=>{
            // this.world.agent.right();
            i = i + 1;
            console.log("hhe--" + i);
        }, 1000);        
    }

}
