const EventEmitter = require('events')

class UTCHoursEmitter extends EventEmitter {
    constructor() {
        super()
    }

    setTimeCheckInterval(intervalMs) {
        this.intervalMs = intervalMs
        return this
    }

    run() {
        if (this.intervalMs == undefined) {
            throw new Error('IntervalMs is not set. Please set interval before running time check.')
        }
        setInterval(() => {
            const now = new Date().getUTCHours()
            this.emit(now + 'h', now)
        }, this.intervalMs)
    }
}

module.exports.UTCHoursEmitter = UTCHoursEmitter