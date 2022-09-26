//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

contract Configurator {
    event Updated(address);

    function upgrade() public{
        emit Updated(address(0));
    }
}

