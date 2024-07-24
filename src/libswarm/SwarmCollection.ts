import { Bee } from '@ethersphere/bee-js'
import { Binary, Strings } from 'cafe-utility'
import { MantarayNode, Reference } from 'mantaray-js'
import { SwarmHandle } from './SwarmHandle'
import { SwarmRawData } from './SwarmRawData'
import { SwarmResource } from './SwarmResource'
import { SwarmSettings } from './SwarmSettings'

export class SwarmCollection {
    public handles: Map<string, SwarmHandle> = new Map()
    private dirty = false
    private hash?: string
    private settings: SwarmSettings

    constructor(settings: SwarmSettings) {
        this.settings = settings
    }

    public async addRawData(path: string, data: SwarmRawData) {
        await data.save()
        this.handles.set(path, new SwarmHandle(this.settings, path, data.hash!, data.contentType))
        this.dirty = true
    }

    public async addResource(path: string, data: SwarmResource) {
        await data.save()
        this.handles.set(path, data.handle!)
        this.dirty = true
    }

    public async addHandle(path: string, handle: SwarmHandle) {
        this.handles.set(path, handle)
        this.dirty = true
    }

    public getHash() {
        console.log('getHash', this.hash, this.dirty)
        if (!this.hash || this.dirty) {
            throw new Error('Collection is not saved')
        }
        return this.hash
    }

    public async save(): Promise<string> {
        const bee = new Bee(this.settings.beeApi)
        const mantaray = new MantarayNode()
        for (const [rawPath, handle] of this.handles.entries()) {
            const path = new TextEncoder().encode(rawPath)
            const filename = Strings.normalizeFilename(rawPath)
            mantaray.addFork(path, Binary.hexToUint8Array(handle.hash) as Reference, {
                'Content-Type': handle.contentType,
                Filename: filename,
                'website-index-document': 'index.html',
                'website-error-document': 'index.html'
            })
        }
        const reference = await mantaray.save(async (data: Uint8Array) => {
            const { reference } = await bee.uploadData(this.settings.postageBatchId, data, { deferred: true })
            return Binary.hexToUint8Array(reference) as Reference
        })
        this.dirty = false
        this.hash = Binary.uint8ArrayToHex(reference)
        return this.hash
    }
}
