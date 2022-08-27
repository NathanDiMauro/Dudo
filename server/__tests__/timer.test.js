const { Timer } = require('../src/timer');

jest.useFakeTimers();
jest.spyOn(global, 'setInterval');

let timer;

// 5 seconds
const bidTime = 5

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

    test('at end', () => {
        timer.startTimer();
        jest.advanceTimersByTime(5000);
        expect(timer.getTimeLeft()).toBe(0);
    })
})

describe('start timer', () => {
    test('ok', async () => {
        timer.startTimer();
        jest.advanceTimersByTime(1000)
        expect(timer.getTimeLeft()).toBe(4);
    })
})

describe('stop timer', () => {
    test('stop with a few seconds left', () => {
        timer.startTimer();
        jest.advanceTimersByTime(2000);
        expect(timer.stopTimer()).toBe(3);
    })
})

describe('reset timer', () => { 
    test('reset after end', () => {
        timer.startTimer();
        jest.advanceTimersByTime(5000);
        expect(timer.getTimeLeft()).toBe(0);
        timer.resetTimer();
        expect(timer.getTimeLeft()).toBe(bidTime);
    })
 })