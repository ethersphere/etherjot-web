import { Bee } from '@ethersphere/bee-js'

import { SwarmResource } from './SwarmResource'
import { SwarmSettings } from './SwarmSettings'

export class SwarmHandle {
    constructor(
        private settings: SwarmSettings,
        public name: string,
        public hash: string,
        public contentType: string
    ) {}

    async load(): Promise<SwarmResource> {
        const bee = new Bee(this.settings.beeApi)
        const data = await bee.downloadData(this.hash)
        return new SwarmResource(this.settings, this.name, data, this.contentType)
    }
}
