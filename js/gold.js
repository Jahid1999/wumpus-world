class Gold {
    constructor(pos, world) {
        this.position = pos;
        this.world = world;
    }

    display() {
        var gap = this.world.roomSize / 10;
        image(gold_image, this.position.x * this.world.roomSize + gap, this.position.y * this.world.roomSize + gap, this.world.roomSize - 2*gap, this.world.roomSize -2*gap);
    }
}