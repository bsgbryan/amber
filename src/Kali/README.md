# [Kali](https://www.britannica.com/topic/Kali) says "Hi!"

Kali scales time. All you need to do is call [`Scale.transition_to(scale, span)`](https://github.com/bsgbryan/amber/blob/main/src/lib/Kali/Scale.ts#L23) where:

* `scale` is your desired time scale factor<br>
  _A number between `0` and `1`, inclusive_
* `span` is the duration of the transition from the current time scale to your desired time scale in milliseconds
