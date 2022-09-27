//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

contract Configurator {
    event Upgraded(address);

    function upgrade() public{
        emit Upgraded(address(0));
    }
}

