import { action } from 'mobx'
import isUsedAsDecorator from './isUsedAsDecorator'

export const PromiseState =  {
  FULFILLED: 'fulfilled',
  PENDING: 'pending',
  REJECTED: 'rejected',
}

function handlePromiseBind(promise, observableTarget, observableKey, callback) {
  const observableProperty = observableKey ?
    observableTarget[observableKey] : observableTarget
  observableProperty.promiseState = PromiseState.PENDING

  return promise
    .then(action('fulfill-promise', (data) => {
      observableProperty.promiseState = PromiseState.FULFILLED
      observableProperty.data = callback ?
        callback(data, observableProperty.data) : data
      return Promise.resolve(data)
    }))
    .catch(action('reject-promise', (err) => {
      observableProperty.promiseState = PromiseState.REJECTED
      return Promise.reject(err)
    }))
}

/**
 * A decorator that ties promise lifecycle with
 * an observable property
 * @param observableProperty
 * @return {Promise.<T>}
 */
export function bindPromiseTo(observablePropertyKey) {
  return (...args) => {
    if (!isUsedAsDecorator(args)) {
      throw new Error("`bindPromiseTo` is supposed to be used as a decorator. You don't seem to using it as such.")
    }

    const [target, name, descriptor] = args
    let fn = descriptor.value

    // Remove this when https://github.com/mobxjs/mobx/issues/855 is taken care of
    target[observablePropertyKey].data = target[observablePropertyKey].data

    let newFn = function () {
      const promise = fn.apply(this, arguments)
      return handlePromiseBind(promise, target, observablePropertyKey)
    }

    descriptor.value = newFn
    return descriptor
  }
}


/**
 * Provides a fluent interface to
 * automatically populate obervable
 * property with promise lifecycle events.
 *
 * @param {Promise.<T>} promise
 *
 * @example
 * getUser() {
 *   bindPromise(auth.getUserById(12)).to(this.user)
 * }
 */

export function bindPromise(promise) {
  return {
    /**
     * By default, the result of promise is directly
     * assigned to the observable.
     * If you want to preprocess, or assign a different
     * field to the property, you can use a callback.

     * @callback processData
     * @param newValue - Promise fulfilment result
     * @param previousValue - Data previously stored in
     * the supplied observableProperty. Can be used to merge
     * previous and current results.
     *
     * @param observableProperty
     * @param {processData} [callback]
     * @return {Promise.<T>}
     */
    to: (observableProperty, callback) => {
      return handlePromiseBind(promise, observableProperty, null, callback)
    },
  }
}

