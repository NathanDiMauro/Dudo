const { Timer } = require('../src/timer');

let timer;

// 1 second in milliseconds
const bidTime = 10000

const alertFunc = () => {

}

beforeEach(() => {
    timer = new Timer(bidTime, alertFunc)
    timer.resetTimer();
})

describe('get time left', () => {
    test('at start', () => {
        expect(timer.getTimeLeft()).toBe(bidTime);
    })
})