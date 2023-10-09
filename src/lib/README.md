# Welcome!

Hi there! Thanks for checking the project out; and reading this documentation! 🤘🏻

# Coding conventions

* Wherever reasonable, no semicolons<br>
  _Example exception: Xenon's math helpers have semicolons in a few places because it makes reading the code easier_
* snake_casing for methods/variable names
* HaskellCase for class/type names
* **absolutely no use of the any/unkown types**<br>
  _Seriously, it is not allowed_
* Follow the [Single Responsilibity Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle):<br>
  * [Finesse](./Finesse) just does input processing
  * [Legion](./Legion) is just ECS stuff
  * [Xenon](./Xenon) only handles rendering
  * [Kali](./Kali) only does time-related things
* Each module is a static class<br>
  _This makes using each module easier by minimizing and more clearly defining the api boundaries between them; also, there's no need to pass instances/references all over the place_

# A tale of two projects

There are (or, will be) two "versions" of each module here; one written in TypeScript, and one written in Rust.

The TypeScript implementation is what's included in this repo for now. It's what I'm using to prototype - as I'm much more familiar with JavaScript/TypeScript than I am Rust.

Once functionality is implmented in a way I'm happy with in the TypeScript version of a lib, it will be ported to Rust.

My goal is that, eventually, Amber will use the Rust version of all library modules compiled to WebAssembly.

The Rust version of these libraries is also what HOS will use.