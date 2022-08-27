// One minute in milliseconds
const defaultBidTime = 60

class Timer {
    /** @member Number */
    bidTime;
    timeLeft;
    alertFunc;
    timer;

    constructor(bidTime, alertFunc) {
        if (bidTime === null) {
            this.bidTime = defaultBidTime;
        } else {
            this.bidTime = bidTime;
        }
        this.resetTimer();
        this.alertFunc = alertFunc;
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
                this.alertFunc();
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