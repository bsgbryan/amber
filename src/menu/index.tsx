import { type Component } from 'solid-js'

import { A } from '@solidjs/router'

import styles from './style.module.css'

const Menu: Component = () => {
  return <>
    <header>
      <p>Welcome to Amber!</p>
    </header>
    <main class={styles.main}>
      <A href="/life">Game of Life</A>
      <A href="/3d/static-cube">3D Static Cube</A>
    </main>
  </>
}

export default Menu
