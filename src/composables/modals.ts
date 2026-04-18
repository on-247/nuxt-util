import { ulid } from 'ulid';
import { h } from 'vue';
import { reactive } from 'vue';
import { resolveComponent } from 'vue';
import { useLogger } from '../composables/debug';

type ComponentID = string
type Component = any
type RenderID = string

const log = useLogger()
let registerdModals: Record<ComponentID, Component> = {}
let renderedModals: Record<RenderID, () => Component> = reactive({})

function toPascalCase(str: string){
  return (' ' + str).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => {
  return chr.toUpperCase()});
}

function dotNotationToPascalCase(dotnotation: string) {
  return dotnotation
    .split('.')
    .map(toPascalCase)
    .join('')
}

export const useModalRegister = (modals: string[]) => {
  for (const modal of modals) {
    registerdModals[modal] = resolveComponent('Modals' + dotNotationToPascalCase(modal))
  }
}

export const useModalActivate = (id: ComponentID, data?: any) => {
  if (!(id in registerdModals)) {
    return log.error('Registered modal not found: ', id)
  }
  let renderId = ulid()
  let renderFunction = () => h(
    registerdModals[id],
    {id: renderId, data, close: () => useModalDeactivate(renderId)}
  )
  renderedModals[renderId] = renderFunction
  return () => useModalDeactivate(renderId)
}

export const useModalDeactivate = (id: RenderID) => {
  if (!(id in renderedModals)) return
  delete renderedModals[id]
}

export const useModalRender = () => {
  return renderedModals
}