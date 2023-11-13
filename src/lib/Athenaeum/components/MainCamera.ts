import Xenon from "@/Xenon"
import Camera from "@/Athenaeum/components/Camera"

export default class MainCamera extends Camera {
  constructor(
    x: number,
    y: number,
    z: number,
  ) {
    super(x, y, z)

    Xenon.main_camera = this
  }
}