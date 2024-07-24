import { GlobalState } from '../engine/GlobalState'
import { createFooter } from '../html/Footer'
import { createHeader } from '../html/Header'
import { createHtml5 } from '../html/Html5'
import { createPostContainer } from '../html/PostContainer'
import { createStyleSheet } from '../html/StyleSheet'
import { createCollectionPage } from './CollectionPage'

export async function createFrontPage(globalState: GlobalState) {
    await buildCollectionPages(globalState)
    const head = `<title>${globalState.configuration.title}</title>${createStyleSheet(0)}`
    const body = `
    ${await createHeader(globalState, 0, 'Latest')}
    <main>
        <div class="content-area">
            ${globalState.articles.length === 0 ? '<p class="no-content">This blog has no content yet.</p>' : ''}
            ${createPostContainer(globalState, 0)}
        </div>
    </main>
    ${await createFooter(globalState, 0)}`
    const html = await createHtml5(head, body, 0)
    return globalState.swarm.newRawData(html, 'text/html')
}

async function buildCollectionPages(globalState: GlobalState) {
    const uniqueCategories = new Set<string>()
    const uniqueTags = new Set<string>()
    for (const article of globalState.articles) {
        uniqueCategories.add(article.category)
        for (const tag of article.tags) {
            uniqueTags.add(tag)
        }
    }
    for (const category of uniqueCategories) {
        globalState.collections[category] = await createCollectionPage(globalState, category)
    }
    for (const tag of uniqueTags) {
        globalState.collections[tag] = await createCollectionPage(globalState, tag)
    }
}
