// One minute in milliseconds
const defaultBidTime = 60

class Timer {
    /** @member Number */
    bidTime;
    timeLeft;
    callbackFunc;
    timer;

    constructor(bidTime, callbackFunc) {
        if (bidTime === null) {
            this.bidTime = defaultBidTime;
        } else {
            this.bidTime = bidTime;
        }
        this.resetTimer();
        this.callbackFunc = callbackFunc;
    }


    getTimeLeft = () => {
        return this.timeLeft;
    }

    resetTimer = () => {
        this.timeLeft = this.bidTime;
    }

    startTimer = () => {
        this.timer = setInterval(() => {
            if (this.timeLeft <= 0) {
                this.callbackFunc();
                clearInterval(this.timer);
                return;
            }
            this.timeLeft -= 1;
        }, 1000)
    }

    stopTimer = () => {
        clearInterval(this.timer);
        return this.timeLeft;
    }
}

module.exports = { Timer };