import Finesse from "../Finesse"
import Kali    from "../Kali"
import Legion  from "../Legion"
import Xenon   from "../Xenon"

export default class Eunomia {
  static async init(render_target = 'main-render-target') {
    await Xenon.init(render_target)

    new ResizeObserver(Xenon.refresh_render_target_size_and_scale).
      observe(document.querySelector('html'))

    Finesse.init()

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