import Xenon from "@/Xenon"
import Camera from "@/Athenaeum/components/Camera"

export default class MainCamera extends Camera {
    constructor() {
    super()

    Xenon.main_camera = this
  }
}