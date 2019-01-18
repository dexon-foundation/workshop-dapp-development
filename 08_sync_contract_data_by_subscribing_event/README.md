# Sync data by subscribing event

You must be wondering why we have only one `README.md` in this folder?

That's because we've already done it before! Remember what we did in `05_read_from_ws_write_from_http`? 
  - We subscribe to `UpdateNumber` event
  - when the event is emitted, we update the HTML

Events are like triggers. When something happens, we fetch all the related data and update our dapp.

Sounds good! but still got its pros and cons
## pros
  - A reactive dapp
  - No more polling and wasted calls! We only update when we need
  - we only need to update minimum amount of data

## cons
  - You might find yourself adding/removing events during the development phase of your smart contract
  - Not everything needs to be logged as events and it cost extra gas

Responding to events is a good pattern because it makes your dapp more reactive without unnecessarily calls.

If your contract is still changing a lot and you don't want to keep adding/removing events, there are some nice techniques to take a look in chapter `09`