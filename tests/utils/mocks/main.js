import { mock, resetMocks, trigger, confirm, connect } from '@depay/web3-mock';
import { Web3Mock } from './Web3Mock/Web3Mock.js';

window.__mocks__ = {
    web3Mock: new Web3Mock({ mock, resetMocks, trigger, confirm, connect }),
};
