// One minute in milliseconds

class Timer {
    /** Default time amount, in seconds
     *  @type 60
     */
    static defaultTimeAmount = 60;

    /** Number, in seconds, of how long each bid will be 
     * @member Number 
     * */
    timeAmount;
    /** Amount of time left, in seconds 
     * @member Number */
    timeLeft;
    /** Function to alert the inheriting class (Room) that a timer event has happened.
     * @member function
     * Perhaps, this function should include a more concrete implementation, but
     * my idea was to build this timer as a a timer, and not be tied to other actions
     */
    callbackFunc;
    /** An intervalID. This is used to cancel the timer in stopTimer()
     * @member Number
     */
    timer;

    /** Create a new timer
     * @param {Number} timeAmount The time, in seconds, of how long each timer will run.
     * @param {Function} callback Function to alert of a time event. For now, this will just be when the timer ends. 
     */
    constructor(timeAmount, callbackFunc) {
        const parsedTimeAmount = parseInt(timeAmount);
        if (isNaN(parsedTimeAmount) || parsedTimeAmount === 0) {
            console.log(Timer.defaultTimeAmount);
            this.timeAmount = Timer.defaultTimeAmount;
        } else {
            this.timeAmount = parsedTimeAmount;
        }
        this.resetTimer();
        this.callbackFunc = callbackFunc;
    }

    /**  Get time left in the timer */
    getTimeLeft = () => {
        return this.timeLeft;
    }

    /** Reset the timer to `timeAmount` */
    resetTimer = () => {
        this.timeLeft = this.timeAmount;
    }

    /** Start the timer */
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

    /** Stop the timer */
    stopTimer = () => {
        clearInterval(this.timer);
        return this.timeLeft;
    }
}

module.exports = { Timer };
