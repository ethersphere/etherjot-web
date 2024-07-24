import { Bee } from '@ethersphere/bee-js'
import { SwarmSettings } from './SwarmSettings'

export class SwarmRawData {
    hash?: string

    constructor(private settings: SwarmSettings, public data: Uint8Array | string, public contentType: string) {}

    async save(): Promise<string> {
        if (this.hash) {
            return this.hash
        }
        const bee = new Bee(this.settings.beeApi)
        const { reference } = await bee.uploadData(this.settings.postageBatchId, this.data, {
            deferred: true
        })
        this.hash = reference
        return this.hash
    }

    static async fromHash(settings: SwarmSettings, hash: string, contentType: string): Promise<SwarmRawData> {
        const bee = new Bee(settings.beeApi)
        const data = await bee.downloadData(hash)
        return new SwarmRawData(settings, data, contentType)
    }

    get utf8(): string {
        if (typeof this.data === 'string') {
            return this.data
        }
        return new TextDecoder().decode(this.data)
    }

    get bytes(): Uint8Array {
        if (typeof this.data === 'string') {
            return new TextEncoder().encode(this.data)
        }
        return this.data
    }
}
