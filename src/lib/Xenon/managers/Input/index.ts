import Input from "./settings"

import {
  MovementMode,
  MovementAxes,
  RotationAxes,
  RotationMode,
} from "./types"

export default class InputManager {
  static #x_rotation = 0
  static #y_rotation = 0

  static #movement_mode: MovementMode = 'GamePad'
  static #rotation_mode: RotationMode = 'GamePad'

  static #active_keys = {
    Backward: false,
    Forward:  false,
    Left:     false,
    Right:    false,
  }

  static #mouse_rotation = {
    processed: false,
    x: 0,
    y: 0,
  }

  static init() {
    document.addEventListener('keydown', e => {
      if (this.#movement_mode !== 'Keyboard') this.#movement_mode = 'Keyboard'

      switch (e.key) {
        case Input.Keyboard.Movement.Bindings.Backward:
          if (this.#active_keys.Backward === false) this.#active_keys.Backward = true
          break
        case Input.Keyboard.Movement.Bindings.Forward:
          if (this.#active_keys.Forward === false) this.#active_keys.Forward = true
          break
        case Input.Keyboard.Movement.Bindings.Left:
          if (this.#active_keys.Left === false) this.#active_keys.Left = true
          break
        case Input.Keyboard.Movement.Bindings.Right:
          if (this.#active_keys.Right === false) this.#active_keys.Right = true
          break
        case 'Escape':
          document.exitPointerLock()
          break
        default:
          console.log(e.key)
          break
      }
    })

    document.addEventListener('keyup', e => {
      if (this.#movement_mode !== 'Keyboard') this.#movement_mode = 'Keyboard'

      switch (e.key) {
        case Input.Keyboard.Movement.Bindings.Backward:
          if (this.#active_keys.Backward === true) this.#active_keys.Backward = false
          break
        case Input.Keyboard.Movement.Bindings.Forward:
          if (this.#active_keys.Forward === true) this.#active_keys.Forward = false
          break
        case Input.Keyboard.Movement.Bindings.Left:
          if (this.#active_keys.Left === true) this.#active_keys.Left = false
          break
        case Input.Keyboard.Movement.Bindings.Right:
          if (this.#active_keys.Right === true) this.#active_keys.Right = false
          break
        default: break
      }
    })

    document.addEventListener('mousemove', e => {
      if (document.pointerLockElement) {
        if (this.#rotation_mode !== 'Mouse') this.#rotation_mode = 'Mouse'

        this.#mouse_rotation.y         = e.movementX
        this.#mouse_rotation.x         = e.movementY
        this.#mouse_rotation.processed = false
      }
    }, false)
  }

  static #gamepad_active(device: Gamepad): boolean {
    for (const a of device?.axes || [])
      if (Math.abs(a) > Input.GamePad.Movement.ActiveThreshhold) return true
  }

  static #process_x_movement(
    mode:          MovementMode,
    value:         number,
    delta_seconds: number,
    dead_zone = 0.
  ): number {
    return Math.abs(value) > dead_zone ?
      (value - dead_zone) * (1 + dead_zone) * delta_seconds * Input[mode].Movement.X.Multiplier
       :
       0
  }

  static #process_z_movement(
    mode:          MovementMode,
    value:         number,
    delta_seconds: number,
    dead_zone = 0,
  ): number {
    return Math.abs(value) > dead_zone ?
      (value - dead_zone) * (1 + dead_zone) * delta_seconds * Input[mode].Movement.Z.Multiplier
       :
       0
  }

  static movement(delta_seconds: number): MovementAxes {
    const gp = navigator.getGamepads()[0]

    if (this.#gamepad_active(gp)) this.#movement_mode = 'GamePad'

    if (this.#movement_mode === 'GamePad' && gp) {
      return {
        x: this.#process_x_movement(
         'GamePad',
          gp.axes[0],
          delta_seconds,
          Input.GamePad.Movement.X.DeadZone,
        ),
        z: this.#process_z_movement(
         'GamePad',
          gp.axes[1],
          delta_seconds,
          Input.GamePad.Movement.Z.DeadZone,
        ),
      }
    }
    else if (this.#movement_mode === 'Keyboard') {
      let x_input = 0
      let z_input = 0

      if (this.#active_keys.Backward) z_input += 1
      else z_input -= 1

      if (this.#active_keys.Forward) z_input -= 1
      else z_input += 1

      if (this.#active_keys.Left) x_input -= 1
      else x_input += 1

      if (this.#active_keys.Right) x_input += 1
      else x_input -= 1

      return {
        x: this.#process_x_movement('Keyboard', x_input, delta_seconds),
        z: this.#process_z_movement('Keyboard', z_input, delta_seconds),
      }
    }
    else return {
      x: 0,
      z: 0,
    }
  }

  static #process_x_rotation(
    mode:          RotationMode,
    value:         number,
    delta_seconds: number,
    dead_zone = 0,
  ): number {
    const computed = Math.abs(value) > dead_zone ?
      (value - dead_zone) * (1 + dead_zone) * delta_seconds * Input[mode].Rotation.X.Multiplier
       :
       0

    const updated = this.#x_rotation + computed

    if (
      updated <=  Input.GamePad.Rotation.Y.Limit &&
      updated >= -Input.GamePad.Rotation.Y.Limit
    ) return updated
    else return this.#x_rotation
  }

  static #process_y_rotation(
    mode:          RotationMode,
    value:         number,
    delta_seconds: number,
    dead_zone = 0,
  ): number {
    return Math.abs(value) > dead_zone ?
      (value - dead_zone) * (1 + dead_zone) * delta_seconds * Input[mode].Rotation.Y.Multiplier
       :
       0
  }

  static rotation(delta_seconds: number): RotationAxes {
    const gp = navigator.getGamepads()[0]

    if (this.#gamepad_active(gp)) this.#rotation_mode = 'GamePad'

    if (this.#rotation_mode === 'GamePad' && gp) {
      this.#x_rotation = this.#process_x_rotation(
       'GamePad',
        gp.axes[3],
        delta_seconds,
        Input.GamePad.Rotation.X.DeadZone,
      )

      this.#y_rotation -= this.#process_y_rotation(
       'GamePad',
        gp.axes[2],
        delta_seconds,
        Input.GamePad.Rotation.Y.DeadZone,
      )
    }
    else if (this.#rotation_mode === 'Mouse' && !this.#mouse_rotation.processed) {
      this.#x_rotation = this.#process_x_rotation(
       'Mouse',
        -this.#mouse_rotation.x,
        delta_seconds,
      )

      this.#y_rotation -= this.#process_y_rotation(
       'Mouse',
        this.#mouse_rotation.y,
        delta_seconds,
      )

      this.#mouse_rotation.processed = true
    }

    return {
      x: this.#x_rotation,
      y: this.#y_rotation,
    }
  }
}