# Hi from Amber 😊

Amber is a thoroughly-modern real-time simulation engine.

What does that mean?

1. Amber is easy to get along with:<br>
  _Modern tools and technologies like [Bun](https://bun.sh/), [TypeScript](https://www.typescriptlang.org/), [AssemblyScript](https://www.assemblyscript.org/), [WebAssembly](https://webassembly.org/), [SIMD](https://github.com/WebAssembly/simd), and [WebGPU](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API) enable Amber to be simple to use & work with while also being incredibly efficient_
1. Amber is smol:<br>
  _A long-standing axiom in development is "Smaller things are easier to understand, change, and fix"; Amber follows this axiom by using lots of little pieces, each focused on doing a single thing, to construct nuanced behavior_
1. Amber has strong opinions:<br>
  _"Simple" and "flexible" are, often, antithetical; whenever this is the case, Amber simplifies things for you and I by making an opinionated decision - meaning that there absolutely is an "Amber's Way"_

# Amber's Parts

* **[Athenaeum](./src/Athenaeum):** A colleciton of super-useful things.
* **[Benzaiten](./src/Benzaiten):** Generates procedural meshes.
* **[Eunomia](./src/Eunomia):** Just a little thing that keeps the engine in good running order.
* **[Finesse](./src/Finesse):** Flexible, sensible, shockingly-adept input handling.
* **[Kali](./src/Kali):** A tiny tool that makes scaling time in the engine as easy as a single method call.
* **[Legion](./src/Legion):** An implementation of the [ECS](https://en.wikipedia.org/wiki/Entity_component_system) design pattern.
* **[Sunya](./src/Sunya)** A library of helpful mathmatical functions for 3D data structures.
* **Strata:** UI tooling. It's all of Amber's buttons, switches, dialogs, and stuff.
* **[Xenon](./src/Xenon):** A blisteringly-fast, elegant rendering engine.
* **[Yggdrasil](./src/Yggdrasil):** Manages all the FidelityTrees; ensuring the engine is always running at peak perfomance, while hitting the [frame rate](https://www.ign.com/articles/2014/11/05/understanding-frame-rate-and-its-importance) target you specify.

# Goals

* **Simplicity:** Using the various pieces of Amber should be straightforward and require very little upfront work.
* **Composability:** Amber's pieces should be organized such that using them together is unambiguous and intuitive.
* **Efficiency:** Amber strives to make the best use of available resources; including our time as developers/designers.

It's important to note that flexibility is _not_ one of Amber's goals. Amber is not intended to render 2D graphics, for example. It is also not designed or intended to load static 3D assets generated using external tools. I understand this will be frustrating and feels limiting. Amber is intended to generate and simulate things. It is also intended to be as self-contained as possible.

# Note

This is all new to me 😊

I've been a hobbyist game developer for several years, but this is my first time attempting to create my own simulation/game engine. I'm going to make mistakes, bad calls, and change my mind about things - when I learn something I thought was a great idea won't, in fact, work. This already happened, actually; I originally thought Amber could do all instanced *and* indexed rendering. I found out the hard way that that isn't really feasible in the context of purely runtime-generated meshes 😅 I'm sure there will be more situations like that - so if you read design goal or decision and think to yourself "That will *not* work" I'll likely realize that shortly too 👍🏻
