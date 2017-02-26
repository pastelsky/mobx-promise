# mobx-promise
[![npm (scoped)](https://img.shields.io/npm/v/mobx-promise.svg)](https://www.npmjs.com/package/mobx-promise)
[![npm](https://img.shields.io/npm/l/mobx-promise.svg)](https://www.npmjs.com/package/mobx-promise)

A tiny library that makes working with promises in MobX easy.


### Installing
```bash
npm install --save mobx-promise
```

Simply initialize an observable object with `data` and `promiseState` properties, and return a promise from an action decorated with `@bindPromiseTo` as such:

```jsx
import { bindPromiseTo } from 'mobx-promise'

class FoodStore {
  @observable pizzas = {
    data: {},
    promiseState: {},
  }
  
  @bindPromiseTo('pizzas')
  @action getPizzas() {
    return fetch('pizza-store.com/api/get')           
  }
}
```
Now when `getPizzas()` is called, `mobx-promise` will update the `promiseState` property of `pizzas` with promise's lifecycle events — _pending_, _fulfilled_ or _rejected_, and the `data` property with the result of promise execution.

## Exercising control
If you'd like more control on how the promise results are assigned, or if you wish to avoid using decorators, you can use the `bindPromise` function instead of the `@bindPromiseTo` decorator. 

```js
import { bindPromise } from 'mobx-promise'

@action getPizzas() {
  const pizzaPromise = fetch('pizza-store.com/api/get').then(r => r.json())
    
  bindPromise(pizzaPromise)
    .to(this.pizzas)               
}
```

This works similar to `bindPromiseTo`, but allows you more freedom to do any of the following:

### Assigning a nested property to the observable
```jsx
@action getPizzas() {
  const pizzaPromise = fetch('pizza-store.com/api/get').then(r => r.json())
  
  bindPromise(pizzaPromise)
    .to(this.pizzas, (promiseResult) => promiseResult.data.pizzas)                
}
```

### Using the previous state
```js
@action getMorePizzas() {
  const pizzaPromise = fetch('pizza-store.com/api/get').then(r => r.json())
    
  //  Merge / process current result with the previous one
  bindPromise(pizzaPromise)
    .to(this.pizzas, (newResults, oldPizzas) => oldPizzas.concat(newResults))              
}
```  
### Returning a promise
```js
@action getMorePizzas() {
const pizzaPromise = fetch('pizza-store.com/api/get').then(r => r.json())
  
  return bindPromise(pizzaPromise)
    .to(this.pizzas)
}
```

### Handling rejection and fulfillment
```js  
@action getMorePizzas() {
  const pizzaPromise = fetch('pizza-store.com/api/get').then(r => r.json())
    
  bindPromise(pizzaPromise)
    .to(this.pizzas)
    .then((result) => console.log(result))
    .catch((err) => alert(err))
}

```

## Rendering results
`mobx-promise` provides the `PromiseState` enum for convenience in comparing results. You can choose to use "fulfilled", "rejected" and "pending" as strings instead if you wish.

```jsx
import { Component } from 'react'
import { PromiseState } from 'mobx-promise'

class PizzaApp extends Component {
  render() {
    const { pizzas } = appStore
    
    switch(pizzas.promiseState) {
      case PromiseState.PENDING:
        return <span> Loading yummy pizzas... </span>
       
      case PromiseState.FULFILLED:
        return <ul> { pizzas.data.map(pizzaName => <li> { pizzaName } </li>) }  </ul>
        
      case PromiseState.REJECTED:
        return <span> No pizza for you. </span>
    
    }
  }
}

```

## API

## `bindPromise`


|argument|type|
|--------|----|-------|
|promise      |Promise|

## `bindPromise.to`


|argument|type|
|--------|----|
|observable      |MobX Observable|
|selector(newData, oldData)| callback |

## `@bindPromiseTo`


|argument|type|
|--------|----|
|observableKey      |string|
