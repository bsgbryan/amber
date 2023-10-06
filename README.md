# Hi from Amber 😊

Amber is a thoroughly modern game editor.

What does that mean?

1. Amber is easy to get along with:<br>
  _Modern technologies and tools like [SolidJS](https://www.solidjs.com/), [TypeScript](https://www.typescriptlang.org/), [WebAssembly](https://webassembly.org/), and [WebGPU](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API) enable Amber to be simple to use & work with while also being incredibly efficient_
1. Amber is smol:<br>
  _A long-standing axiom in development is "Smaller things are easier to understand, change, and fix"; Amber follows this axiom by using lots of little pieces, each focused on doing a single thing, to construction nuanced behavior_
1. Amber has strong opinions:<br>
  _"Simple" and "flexible" are, often, antithetical; whenever this is the case, Amber simplifies things for you and I by making an opinionated decision - meaning that there absolutely is an "Amber's Way"_

# Ambers Parts

* **Strata**: UI tooling. It's all of Amber's buttons, switches, dialogs, and stuff
* **[Xenon](./src/lib/Xenon)**:  A rendering engine, input processor, and real time simulation fidelity manager
* **[Legion](./src/lib/Legion)**: An implementation of the [ECS](https://en.wikipedia.org/wiki/Entity_component_system) design pattern specifically designed to scaling the fidelity of the simulations up and down in real time; Legion handles executing all the simulations you define