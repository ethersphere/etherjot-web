import { GlobalState } from '../engine/GlobalState'
import { createFooter } from '../html/Footer'
import { createHeader } from '../html/Header'
import { createHtml5 } from '../html/Html5'
import { createPostContainer } from '../html/PostContainer'
import { createStyleSheet } from '../html/StyleSheet'

export async function createCollectionPage(globalState: GlobalState, collectionName: string): Promise<string> {
    const head = `<title>${globalState.configuration.title} | ${collectionName} Posts</title>${createStyleSheet(0)}`
    const body = `
    ${await createHeader(globalState, 0, collectionName)}
    <main>
        <div class="content-area">
            ${createPostContainer(globalState, 0, collectionName)}
        </div>
    </main>
    ${await createFooter(globalState, 0)}`
    const html = await createHtml5(head, body, 0)
    const htmlHash = await (await globalState.swarm.newRawData(html, 'text/html')).save()
    return htmlHash
}
