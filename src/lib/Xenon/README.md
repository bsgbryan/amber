# 👽: Greetings, fellow developer

👽: Nice to meet you!<br>
👽: I am a modern, performant, procedural real-time simulation engine

🤓: ... what?

👽: Well, a game engine; but one specifically designed to simulate things - and scale to hit whatever frame rate you specify on whatever hardware I'm running on

🤓: ...

👽: I'm designed to simulate things at 30fps, 60fps, and beyond on everything from a Raspberry Pi to a top-of-the-line, water-cooled, Beast Mode™️ PC

🤓: But ... how?

👽: Well, for example, instead of giving me a 3D model to render<br>
👽: You'd give me a highly-structured hierarchy of nodes populated with specific rules defining how the fidelity of a 3D model should increase or decrease based on the performance characteristics of the hardware I'm running on<br>
👽: These heirarchy of nodes can represent anything too - not just 3D models<br>
👽: They can represent AI, a skelaton, a sound/music source ...<br>
👽: In fact, these structures, called **FidelityTrees**, are all I know how to work with!

🤓: Ahhh! So ... instead of giving you a bunch of static things to render/play,<br>
🤓: I give you a set of **FidelityTrees** ... and you execute the simulations they describe at whatever level of fidelity is appropriate for the hardware you're running on at the framerate I specify?

👽: Yes! Exactly!

🤓: Awesome!<br>
🤓: So ... you're a game engine - you're just a very specific, unique, _type_ of game engine?

👽: You got it!

🤓: Radical

# Please Note

_Xenon is still very much a baby_

_Everything described above are goals; they're not implemented yet_

_Xenon'll get there - they just need time_ 😊

# A tale of two Xenons

There are (or, will be) two "versions" of Xenon; one written in TypeScript, and one written in Rust.

The TypeScript implementation of Xenon is what's included in this repo for now. It's what I'm using to prototype - as I'm much more familiar with JavaScript/TypeScript than I am Rust.

Once functionality is implmented in a way I'm happy with in the TypeScript version of Xenon, it will be ported to the Rust version of Xenon.

My goal is that, eventually, Amber will use the Rust version of Xenon compiled to WebAssembly.

The Rust version of Xenon is also what HOS will use.