import { Web3Mock } from './Web3Mock.js';
import { vi } from 'vitest';

let web3Mock = null;
let mock = null;
let mockCallCount = null;
let resetMocks = null;
let resetMocksCallCount = null;
let trigger = null;
let triggerCallCount = null;
let confirm = null;
let confirmCallCount = null;
let connect = null;
let connectCallCount = null;

beforeEach(() => {
    mockCallCount = { callCount: 0 };
    resetMocksCallCount = { callCount: 0 };
    mock = vi.fn(() => mockCallCount);
    resetMocks = vi.fn(() => resetMocksCallCount);
    trigger = vi.fn(() => triggerCallCount);
    confirm = vi.fn(() => confirmCallCount);
    connect = vi.fn(() => connectCallCount);
    web3Mock = new Web3Mock({ mock, resetMocks, trigger, confirm, connect });
});

afterEach(() => {
    vi.restoreAllMocks();
    mock = null;
    resetMocks = null;
    mockCallCount = null;
    resetMocks = null;
    web3Mock = null;
});

describe('Web3Mock', () => {
    it('should throw an error if required params are missing', () => {
        expect(() => {
            new Web3Mock({});
        }).toThrowError();
    });

    describe('Web3Mock::mock()', () => {
        it('should call `mock` function', () => {
            web3Mock.mock({
                mockName: 'mock1',
                args: { foo: 'foo' },
            });

            expect(mock).toHaveBeenCalledWith({ foo: 'foo' });
        });

        it('should throw an error if not unique mock name is given', () => {
            web3Mock.mock({
                mockName: 'mock1',
                args: { foo: 'foo' },
            });

            expect(() => {
                web3Mock.mock({
                    mockName: 'mock1',
                    args: { foo: 'foo' },
                });
            }).toThrowError();
        });

        it('should use internal unique name if no mock name is given', () => {
            const mockName1 = web3Mock.mock({
                mockName: '',
                args: { foo: 'foo' },
            });
            const mockName2 = web3Mock.mock({
                mockName: '',
                args: { foo2: 'foo2' },
            });

            expect(typeof mockName1 === 'string' && mockName1.length > 0).toBe(true);
            expect(mockName1 !== mockName2).toBe(true);
        });
    });

    describe('Web3Mock::resetMocks()', () => {
        it('should call `resetMocks`', () => {
            web3Mock.resetMocks();

            expect(resetMocks).toHaveBeenCalled();
        });
    });

    describe('Web3Mock::trigger()', () => {
        it('should call `trigger`', () => {
            web3Mock.trigger('chainChanged', '0xfa2');

            expect(trigger).toHaveBeenCalledWith('chainChanged', '0xfa2');
        });
    });

    describe('Web3Mock::confirm()', () => {
        it('should call `confirm`', () => {
            web3Mock.confirm({ foo: 'boo' });

            expect(confirm).toHaveBeenCalledWith({ foo: 'boo' });
        });
    });

    describe('Web3Mock::connect()', () => {
        it('should call `connect`', () => {
            web3Mock.connect({ foo: 'boo' });

            expect(connect).toHaveBeenCalledWith({ foo: 'boo' });
        });
    });

    describe('Web3Mock::toHaveBeenCalled()', () => {
        it('should check if mock has been called', () => {
            web3Mock.mock({
                mockName: 'mock1',
                args: { foo: 'foo' },
            });

            mockCallCount.callCount += 1;

            expect(web3Mock.toHaveBeenCalled('mock1')).toBe(true);
        });
    });

    describe('Web3Mock::toHaveBeenCalledTimes()', () => {
        it('should check if mock has been called n times', () => {
            web3Mock.mock({
                mockName: 'mock1',
                args: { foo: 'foo' },
            });

            mockCallCount.callCount += 2;

            expect(web3Mock.toHaveBeenCalledTimes('mock1', 2)).toBe(true);
        });
    });
});
