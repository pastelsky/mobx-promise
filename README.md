# mobx-promise
[![npm (scoped)](https://img.shields.io/npm/v/mobx-promise.svg)](https://www.npmjs.com/package/mobx-promise)
[![npm](https://img.shields.io/npm/l/mobx-promise.svg)](https://www.npmjs.com/package/mobx-promise)

A tiny dependency-free library that makes working with promises in MobX easy.

## 
```js
import { observable, action } from 'mobx'
import { bindPromise,  PromiseState } from 'mobx-promise'

class FoodStore {
  @observable pizzas = {
    data: {},
    promiseState: {},
  }
  
  @action getPizzas() {
    const pizzaPromise = fetch('pizza-store.com/api/get').then(r => r.json())
    
    bindPromise(pizzaPromise)
      .to(this.pizzas)
                      
  }
}

const appStore = new FoodStore()

class PizzaApp extends React.Component {
  render() {
    const { pizzas } = appStore
    
    switch(pizzas.promiseState) {
      case PromiseState.PENDING:
        return <span> Loading yummy pizzas... </span>
       
      case PromiseState.FULFILLED:
        return <ul> { pizzas.data.map(pizzaName => <li> { pizzaName } </li>) }  </ul>
        
      case PromiseState.REJECTED:
        return <span> No pizzas for you. </span>
    
    }
  }
}

```

```js
import { observable, action } from 'mobx'
import { bindPromiseTo } from 'mobx-promise'

class FoodStore {
  @observable pizzas = {
    data: {},
    promiseState: {},
  }
  
  @action 
  @bindPromiseTo('pizzas')
  getPizzas() {
    return fetch('pizza-store.com/api/get').then(r => r.json())                
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
