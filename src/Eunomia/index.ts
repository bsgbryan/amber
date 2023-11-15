import Finesse from "@/Finesse"
import Kali    from "@/Kali"
import Legion  from "@/Legion"
import Mabueth from "@/Mabeuth"
import Xenon   from "@/Xenon"

export default class Eunomia {
  static async init(render_target = 'main-render-target') {
    Mabueth.init(render_target)

    await Xenon.init()

    Finesse.init()

    Mabueth.on_tick = () => {
      Kali.update()
      Legion.update()
      Xenon.render()
    }
  }
}