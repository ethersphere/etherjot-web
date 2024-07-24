import { Asset, GlobalState } from './GlobalState'

export async function addAsset(
    globalState: GlobalState,
    name: string,
    byteArray: Uint8Array,
    contentType: string
): Promise<Asset> {
    const hash = await (await globalState.swarm.newResource('upload', byteArray, contentType)).save()
    const asset = {
        reference: hash.hash,
        contentType,
        name
    }
    globalState.assets.push(asset)
    return asset
}
