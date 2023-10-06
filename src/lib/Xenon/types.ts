import { Component } from '.'

export type Entity = number

export type ComponentClass<T extends Component> = new (...args: any[]) => T