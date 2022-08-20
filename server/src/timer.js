// One minute in milliseconds
const defaultBidTime = 60000

class Timer {
    /** @member Number */
    bidTime;
    timeLeft;
    alertFunc;
    // timer;

    constructor(bidTime, alertFunc) {
        if (bidTime === null) {
            this.bidTime = defaultBidTime;
        } else {
            this.bidTime = bidTime
        }
        this.resetTimer()
    }


    getTimeLeft = () => {
        return this.timeLeft;
    }

    resetTimer = () => {
        this.timeLeft = this.bidTime;
    }

    startTimer = () => {
    }

    stopTimer = () => {

    }
}

module.exports = { Timer };