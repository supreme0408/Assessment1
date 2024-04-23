//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

contract contract1{
    address private owner;

    modifier valueMustBeGreaterThanZero(uint256 amount) {
        require(amount > 0, "Amount should be greater than zero");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function transferTo(address payable _to, uint256 amount) external valueMustBeGreaterThanZero(amount) payable {
        require(amount <=  msg.value, "Insufficient balance");
        _to.transfer(amount);
    }
}