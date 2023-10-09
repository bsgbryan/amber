/* @refresh reload */
import { lazy   } from 'solid-js'
import { render } from 'solid-js/web'

import {
  Router,
  Route,
  Routes,
} from '@solidjs/router'

const Menu = lazy(() => import('./menu'))
const Life = lazy(() => import('./life'))
const Test = lazy(() => import('./test'))

import './index.css'

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  )
}

render(() => 
  <Router>
    <Routes>
        <Route path="/" component={Menu} />
        <Route path="/life" component={Life} />
        <Route path="/test" component={Test} />
      </Routes>
  </Router>,
  root!
)
