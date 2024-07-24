import { Bee } from '@ethersphere/bee-js'
import { SwarmHandle } from './SwarmHandle'
import { SwarmSettings } from './SwarmSettings'

export class SwarmResource {
    handle?: SwarmHandle

    constructor(
        private settings: SwarmSettings,
        public name: string,
        public data: Uint8Array | string,
        public contentType: string
    ) {}

    async save(): Promise<SwarmHandle> {
        if (this.handle) {
            return this.handle
        }
        const bee = new Bee(this.settings.beeApi)
        const { reference } = await bee.uploadFile(this.settings.postageBatchId, this.data, this.name, {
            contentType: this.contentType,
            deferred: true
        })
        this.handle = new SwarmHandle(this.settings, this.name, reference, this.contentType)
        return this.handle
    }
}
