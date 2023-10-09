import Finesse from "../Finesse"
import Kali    from "../Kali"
import Legion  from "../Legion"
import Xenon   from "../Xenon"

export default class Eunomia {
  static update(): void {
      requestAnimationFrame(() => {
        Kali.update()
        Finesse.update()
        Legion.update()
        Xenon.render()
        Eunomia.update()
      })
    }
}