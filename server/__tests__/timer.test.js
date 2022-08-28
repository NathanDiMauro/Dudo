const { Timer } = require('../src/timer');

jest.useFakeTimers();
jest.spyOn(global, 'setInterval');

let timer;

// The tests are made where you can
// change bidTime to any positive value
// 5 seconds
const bidTime = 5

const alertFunc = () => { };

beforeEach(() => {
    timer = new Timer(bidTime, alertFunc)
    timer.resetTimer();
})

describe('get time left', () => {
    test('at start', () => {
        expect(timer.getTimeLeft()).toBe(bidTime);
    })

    test('at end', () => {
        timer.startTimer();
        jest.advanceTimersByTime(bidTime * 1000);
        expect(timer.getTimeLeft()).toBe(0);
    })
})

describe('start timer', () => {
    test('ok', () => {
        timer.startTimer();
        jest.advanceTimersByTime(1 * 1000)
        expect(timer.getTimeLeft()).toBe(bidTime - 1);
    })

    test('wait for end', () => {
        timer.startTimer();
        jest.advanceTimersByTime(bidTime * 1000);
        expect(timer.getTimeLeft()).toBe(0);
    })
})

describe('stop timer', () => {
    test('stop with a few seconds left', () => {
        timer.startTimer();
        jest.advanceTimersByTime(2 * 1000);
        expect(timer.stopTimer()).toBe(bidTime - 2);
    })

    test('stop timer at end', () => {
        timer.startTimer();
        jest.advanceTimersByTime(bidTime * 1000);
        expect(timer.stopTimer()).toBe(0);
    })
})

describe('reset timer', () => {
    test('reset after end', () => {
        timer.startTimer();
        jest.advanceTimersByTime(5 * 1000);
        expect(timer.getTimeLeft()).toBe(bidTime - 5);
        timer.resetTimer();
        expect(timer.getTimeLeft()).toBe(bidTime);
    })
})

describe('test callback function', () => {
    // My way of testing the callback. Not sure of a better way...
    let counter = 0;
    callbackFunc = () => {
        counter += 1;
    }

    beforeEach(() => {
        timer = new Timer(bidTime, callbackFunc);
    })

    test('timer is over', () => {
        const c = counter;
        timer.startTimer();
        jest.advanceTimersByTime((bidTime + 1) * 1000);
        expect(timer.getTimeLeft()).toBe(0);
        expect(counter).toBe(c + 1);
    })
})