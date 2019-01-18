# Contract migration - Delegatecall proxy pattern

There's another pattern to implement upgradable contract. Please make sure you've already finished `10` so we can have a better comprehension.


In `10`, dapp interacts with `Logic` contract and `Logic` contract access `Data` contract.
```
Dapp <---> Logic contract <---> Data contract
```


For `delegatecall proxy` pattern we are actually doing it in a reverse order
```
Dapp <---> Data contract <---> Logic contract
```

It's trivial that Dapp can access data from `Data` contract directly, but what does it mean to execute functions from `logic` contract through `data` contract?


## delecatecall

`delegatecall` execute code from another contract but on behalf of current contract


In our `logic` contract we have a `setNumber` function
```js

contract Logic {
  // ....

  function setNumber(uint256 num) public onlyOwner {
    numbers[msg.sender] = num;
  }

  // ....
}
```

and `data` contract has a fallback function like this:
```js
contract Data {
  // ....

  function() external {
    logicContract.delegatecall(msg.data);
  }
}
```
it means that for any functions that can't be found on `Data` contract, we use `Logic` contract's code to execute it. The code from `Logic` contract modifies state of `Data` contract. 

- When executing code from `Logic` contract, `msg.sender` becomes the address who calls `Data` contract
  - It's different than the previous tutorial. In the case of `10`, `Logic` calls `Data` contract and the `msg.sender` in `Data` contract is `Logic` contract

- Code from `Logic` will modify the state of `Data` contract. (Because it's `Data` contract borrows the logic and execute it by itself)

- Migration might be simpler. `Logic` contract doesn't have to know the address of `Data` contract. Whenever there's new version of `Logic` contract, we only need to update the new address in `Data`.

- We can emit new events now and it will be under `Data`. If we want to do this in `10` it would be complex

## Tricky part

Sounds flexible? but it could be really tricky. Let's look at the following example:

```js
contract Data {

  uint256 a;
  uint256 b;
  address public logicContract;

  function() external {
    logicContract.delegatecall(msg.data);
  }
}

contract Logic {

  uint256 b;
  address public logicContract;

  function setB(uint256 num) public {
    b = num;
  }
}
```

`Logic.setB()` which assign new value to `b` in `Logic` contract. If we call it through `delecatecall` (`Data.setB()`), we are executing `setB()` with the context of `Data`. The result is that `a` will be modified instead of `b`.


The problem is that `Data` and `Logic` has different layout of state variable. Even though in the contract source code we are modifying `b`, but we are executing with the context of `Data`. The position of `b` in `Logic` is actually pointing to `a` in `Data` hence `a` will be corrupted.


Things like this is hard to catch so be sure to have enough understanding about what it does and only use it if you have to.
