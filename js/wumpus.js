class Wumpus {
    constructor(pos, world) {
        this.position = pos;
        this.world = world;
        this.alive = true;
    }

    isVisible() {
        return this.world.roomIsVisible(this.position.x, this.position.y);
    }

    kill() {
        this.alive = false;
    }

    display() {
        if (this.alive) {
            var gap = this.world.roomSize/10;
            image(wumpus_image, this.position.x * this.world.roomSize + gap, this.position.y * this.world.roomSize + gap, this.world.roomSize - 2*gap, this.world.roomSize - 2*gap);
        } else {
            image(wumpus_dead_image, this.position.x * this.world.roomSize, this.position.y * this.world.roomSize, this.world.roomSize, this.world.roomSize);
        }
    }
}