class Stench {
    constructor(pos, world) {
        this.position = pos;
        this.world = world;
    }

    display() {
        var gap = this.world.roomSize / 10;
        image(stench_image, this.position.x * this.world.roomSize - gap, this.position.y * this.world.roomSize + gap, this.world.roomSize + 2*gap, this.world.roomSize/2 -2*gap);

    }
}