const NUM_SAMPLES = 20;

class MovingAverage {
    constructor() {
        this.buffer = new Array(NUM_SAMPLES).fill(0);
        this.index = 0;
        this.accumulator = 0;
    }

    init() {
        this.index = 0;
        this.accumulator = 0;
        for (let i = 0; i < NUM_SAMPLES; i++) {
            this.buffer[i] = 0;
        }
    }

    update(new_sample) {
        this.accumulator -= this.buffer[this.index];
        this.buffer[this.index] = new_sample;
        this.accumulator += new_sample;
        this.index = (this.index + 1) % NUM_SAMPLES;
        return this.accumulator / NUM_SAMPLES;
    }
}
var LPFilter = new MovingAverage();
LPFilter.init();
