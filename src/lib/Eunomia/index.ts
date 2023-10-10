import Finesse from "../Finesse"
import Kali    from "../Kali"
import Legion  from "../Legion"
import Xenon   from "../Xenon"

export default class Eunomia {
  static async init(render_target = 'main-render-target') {
    await Xenon.init(render_target)

    Eunomia.#update()
  }

  static #update(): void {
      requestAnimationFrame(() => {
        Kali.update()
        Finesse.update()
        Legion.update()
        Xenon.render()
        Eunomia.#update()
      })
    }
}