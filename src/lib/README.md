# Welcome!

Hi there! Thanks for checking the project out; and reading this documentation! 🤘🏻

# Coding conventions

* Wherever reasonable, no semicolons<br>
  _Example exception: Xenon's math helpers have semicolons in a few places because it makes reading the code easier_
* snake_casing for methods/variable names
* HaskellCase for class/type names
* No curly braces for single-line `for`, `if`/`else`, or `while` statements
* No parentheses for single-parameter arrow functions
* **absolutely no use of the any/unkown types**<br>
  _Seriously, it is not allowed_
* Each module is a static class<br>
  _This makes using each module easier by minimizing and more clearly defining the api boundaries between them; also, there's no need to pass instances/references all over the place_
* Follow the [Single Responsilibity Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle)

# Modules

The simulation engine is composed of the following pieces:
* [Eunomia](./Eunomia) maintains order
* [Finesse](./Finesse) handles input processing
* [Kali](./Kali) manages time
* [Legion](./Legion) maintains ECS state
* [Xenon](./Xenon) renders things
* [Yggdrasil](./Yggdrasil) manages simulation fidelity