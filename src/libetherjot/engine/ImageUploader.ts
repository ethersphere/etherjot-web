import { GlobalState } from './GlobalState'

interface UploadedFile {
    reference: string
    path: string
}

export async function uploadImage(globalState: GlobalState, path: string, buffer: Buffer): Promise<UploadedFile> {
    const hash = await (await globalState.swarm.newRawData(buffer, 'image/png')).save()
    return {
        reference: hash,
        path
    }
}
