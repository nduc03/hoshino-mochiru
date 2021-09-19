const EventEmitter = require('events')

class TimeEmitter extends EventEmitter {
    constructor() {
        super()
    }

    setUTCHours(utcHours) {
        if (utcHours > 24 && !Number.isInteger(utcHours)) {
            throw new Error('Invalid time.')
        }
        this.hours = utcHours
        return this
    }

    setVNHours(hours) {
        // Convert UTC+7 to UTC
        var UTCHours = hours - 7
        if (UTCHours < 0) {
            // Explain UTCHours += 24
            // If UTCHours is minus, UTCHours is 24 - Math.abs(UTCHours)
            // => UTCHours = 24 - (-UTCHours)
            // => UTCHours = 24 + UTCHours
            // => UTCHours += 24
            UTCHours += 24
        }
        this.setUTCHours(UTCHours)
        return this
    }

    setTimeCheckInterval(intervalMs) {
        this.intervalMs = intervalMs
        return this
    }

    run() {
        if (this.hours == undefined) {
            throw new Error('Hours is not set. Please set hours before running time check.')
        }
        if (this.intervalMs == undefined) {
            throw new Error('IntervalMs is not set. Please set interval before running time check.')
        }
        setInterval(() => {
            if (new Date().getUTCHours() == this.hours) {
                this.emit('rightTime', this.hours)
            }
        }, this.intervalMs)
    }
}

module.exports.TimeEmitter = TimeEmitter