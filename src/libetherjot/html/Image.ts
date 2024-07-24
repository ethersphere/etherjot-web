import { Asset } from '../engine/GlobalState'

export function createImage(src: Asset, depth: number) {
    return `<img src="${'../'.repeat(depth)}${src.name}" />`
}
