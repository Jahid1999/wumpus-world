class Room {
    constructor(pos, roomSize) {
        this.position = pos;
        this.size = roomSize;
        this.attributes = new Set();
        this.visible = false;
        this.objects = new Set();
        this.containsArrow = false;
        this.containsAgent = false;
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    isVisible() {
        return this.visible;
    }
    addAttribute(attr) {
        this.attributes.add(attr);
    }

    removeAttribute(attr) {
        this.attributes.delete(attr);
    }

    addObject(obj) {
        this.objects.add(obj);
    }

    removeObject(obj) {
        this.objects.delete(obj);
    }

    addArrow() {
        this.containsArrow = true;
        this.addAttribute("Arrow");
    }

    removeArrow() {
        this.containsArrow = false;
        this.removeAttribute("Arrow");
    }

    containsWumpus() {
        let result = false;
        this.objects.forEach(obj => {
            if (obj instanceof Wumpus) {
                result = true;
            }
        });
        return result;
    }

    containsPit() {
        let result = false;
        this.objects.forEach(obj => {
            if (obj instanceof Pit) {
                result = true;
            }
        });
        return result;
    }

    display() {
        strokeWeight(1);
        stroke(30);
        if (this.visible) {
            image(terrain_image, this.position.x * this.size, this.position.y * this.size, this.size, this.size);
            noFill();
            square(this.position.x * this.size, this.position.y * this.size, this.size);
            if (this.objects.size > 0) {
                this.objects.forEach(obj => {
                    obj.display();
                });
            } else {
                fill(0);
                let size = this.size / 4 < 20 ? this.size / 4 : 20;
                textSize(size);
                textAlign(CENTER, TOP);
                strokeWeight(0.5);
                let s = "";
                this.attributes.forEach((value) => {
                    s += value + "\n"
                });
                text(s, this.position.x * this.size, this.position.y * this.size + this.size * 0.1, this.size, this.size - this.size * 0.1);
            }
        } else {
            fill(100);
            square(this.position.x * this.size, this.position.y * this.size, this.size);
        }

        if (this.containsAgent) {
            if (this.attributes.has("Breeze")) {
                let playing = false;
                wind_sound.forEach(sound => {
                    if (sound.isPlaying()) {
                        playing = true;
                    }
                });
                if (!playing) {
                    let windSound = wind_sound[getRandomInt(wind_sound.length)];
                    windSound.play();
                }
            } else {
                wind_sound.forEach(sound => {
                    if (sound.isPlaying()) {
                        sound.stop();
                    }
                });
            }

            if (this.attributes.has("Stench")) {
                if (!flies_sound.isPlaying()) {
                    flies_sound.loop();
                }
            } else {
                flies_sound.stop();
            }
        }

    }
}