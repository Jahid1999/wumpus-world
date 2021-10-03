class Gold {
    constructor(pos, world) {
        this.position = pos;
        this.world = world;
    }

    display() {
        image(gold_image, this.position.x * this.world.roomSize, this.position.y * this.world.roomSize, this.world.roomSize, this.world.roomSize);
    }
}