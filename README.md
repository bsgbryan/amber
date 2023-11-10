# Hi from Amber 😊

Amber is a thoroughly-modern real-time simulation engine.

What does that mean?

1. Amber is easy to get along with:<br>
  _Modern tools and technologies like [Bun](https://bun.sh/), [TypeScript](https://www.typescriptlang.org/), [AssemblyScript](https://www.assemblyscript.org/), [WebAssembly](https://webassembly.org/), [SIMD](https://github.com/WebAssembly/simd), and [WebGPU](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API) enable Amber to be simple to use & work with while also being incredibly efficient_
1. Amber is smol:<br>
  _A long-standing axiom in development is "Smaller things are easier to understand, change, and fix"; Amber follows this axiom by using lots of little pieces, each focused on doing a single thing, to construction nuanced behavior_
1. Amber has strong opinions:<br>
  _"Simple" and "flexible" are, often, antithetical; whenever this is the case, Amber simplifies things for you and I by making an opinionated decision - meaning that there absolutely is an "Amber's Way"_

# Amber's Parts

* **[Athenaeum](./src/lib/Athenaeum):** A colleciton of super-useful things.
* **[Benzaiten](./src/lib/Benzaiten):** Generates procedural meshes.
* **[Eunomia](./src/lib/Eunomia):** Just a little thing that keeps the engine in good running order.
* **[Finesse](./src/lib/Finesse):** Flexible, sensible, shockingly-adept input handling.
* **[Kali](./src/lib/Kali):** A tiny tool that makes scaling time in the engine as easy as a single method call.
* **[Legion](./src/lib/Legion):** An implementation of the [ECS](https://en.wikipedia.org/wiki/Entity_component_system) design pattern.
* **[Sunya](./Sunya)** A library of helpful mathmatical functions for 3D data structures.
* **Strata:** UI tooling. It's all of Amber's buttons, switches, dialogs, and stuff.
* **[Xenon](./src/lib/Xenon):** A blisteringly-fast, elegant rendering engine.
* **[Yggdrasil](./src/lib/Yggdrasil):** Manages all the FidelityTrees; ensuring the engine is always running at peak perfomance, while hitting the [frame rate](https://www.ign.com/articles/2014/11/05/understanding-frame-rate-and-its-importance) target you specify.

# Goals

* **Simplicity:** Using the various pieces of Amber should be straightforward and require very little upfront work.
* **Composability:** Amber's pieces should be organized such that using them together is unambiguous and intuitive.
* **Efficiency:** Amber strives to make the best use of available resources; including our time as developers/designers.

It's important to note that flexibility is _not_ one of Amber's goals.

As an example, Xenon _only_ renders indexed/instanced geometry. There are absolutely uses cases for Xenon rendering non-indexed/non-instanced geometry. Implementing support for all four rendering options (_non-indexed/non-instanced, indexed/non-instanced, indexed/instanced, and non-indexed/instanced_) would require significantly more time & effort. Only supporting two or three options would beg the question "Why not support ____?"

Settling on a single rendering option also makes many other decisions much simpler. For example:

Question: "How are complex meshes constructed?"<br>
Answer: "As one or more instances of smaller, simpler, meshes"

An example of such a complex mesh might be a tree; instead of having a single mesh for the tree, it would be built from many meshes - for parts of the trunk, sections of branches, and leaves. A dozen or so relatively simple meshes, when combined, would produce a varied collection of trees. This lessens the cognitive load imposed by working on tree design since all one needs to think about is designing a single branch, leaf, or trunk section at a time; how the pieces fit together is a separate problem. Displaying a single tree, or a vast forest, this way is also extremely efficient from a rendering and memory perspective.
