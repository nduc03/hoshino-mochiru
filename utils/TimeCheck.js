const EventEmitter = require('events')

class UTCHoursEmitter extends EventEmitter {
    constructor() {
        super()
        this.intervalMs = 60000 // Default interval check is 1 minute (60000 milliseconds)
        this.now = 0
    }

    setTimeCheckInterval(intervalMs) {
        if (typeof intervalMs === 'number') {
            this.intervalMs = intervalMs
            return this
        }
        else {
            throw new Error('Interval check must be a number.')
        }
    }

    run() {
        if (this.intervalMs == undefined) {
            throw new Error('IntervalMs is not set. Please set interval before running time check.')
        }
        setInterval(() => {
            this.now = new Date().getUTCHours()
            this.emit(this.now + 'h', this.now)
        }, this.intervalMs)
    }
}

module.exports.UTCHoursEmitter = UTCHoursEmitter