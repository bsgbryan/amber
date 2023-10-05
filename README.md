# Hi from Amber 😊

Amber is a thoroughly modern game editor.

What does that mean?

1. Amber is easy to get along with:<br>
  _Modern technologies and tools like [SolidJS](https://www.solidjs.com/), [TypeScript](https://www.typescriptlang.org/), [WebAssembly](https://webassembly.org/), and [WebGPU](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API) enable Amber to be simple to use & work with while also being incredibly efficient_
1. Amber is smol:<br>
  _A long-standing axiom in development is "Smaller things are easier to understand, change, and fix"; Amber follows this axiom by using lots of little pieces, each focused on doing a single thing, to construction nuanced behavior_
1. Amber has strong opinions:<br>
  _"Simple" and "flexible" are, often, antithetical; whenever this is the case, Amber simplifies things for you and I by making an opinionated decision - meaning that there absolutely is an "Amber's Way"_

# Amber's Parts

Amber is built from a few pieces:

* **Xenon**: The engine at the heart of Amber. It handles rendering things, processing input, and calculating physics.
* **Strata**: The UI that wraps Xenon. It's all of Amber's buttons, switches, dialogs, and stuff.

# Xenon

[Xenon](./src/lib/Xenon) is Amber's core; an extremely efficient, simple game engine.

Xenon uses the [ECS](https://en.wikipedia.org/wiki/Entity_component_system) design pattern.

# A tale of two Xenons

There are two "versions" of Xenon; one written in TypeScript, and one written in Rust.

The TypeScript implementation of Xenon is what's included in this repo for now. It's what I'm using to prototype - as I'm much more familiar with JavaScript/TypeScript than I am Rust.

Once functionality is implmented in a way I'm happy with in the TypeScript version of Xenon, it will be ported to the Rust version of Xenon.

My goal is that, eventually, Amber will use the Rust version of Xenon compiled to WebAssembly.

The Rust version of Xenon is also what HOS will use.