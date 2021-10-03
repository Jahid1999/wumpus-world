class Breeze {
    constructor(pos, world) {
        this.position = pos;
        this.world = world;
    }

    display() {
        image(breeze_image, this.position.x * this.world.roomSize, this.position.y * this.world.roomSize + this.world.roomSize/4, this.world.roomSize, this.world.roomSize);
    }
}