import { createDefaultImage } from '../html/DefaultImage'
import { createFavicon } from '../html/Favicon'
import { createArticleFontData, createBrandingFontData, createNormalFontData } from '../html/Font'
import { createStyle } from '../html/Style'
import { createFrontPage } from '../page/FrontPage'
import { GlobalState } from './GlobalState'
import { createArticleSlug } from './Utility'

export async function recreateMantaray(globalState: GlobalState): Promise<void> {
    const collection = await globalState.swarm.newCollection()
    await collection.addRawData(
        'font-variant-1.ttf',
        await globalState.swarm.newRawData(createBrandingFontData(), 'font/ttf')
    )
    await collection.addRawData(
        'font-variant-2.woff2',
        await globalState.swarm.newRawData(createNormalFontData(), 'font/woff2')
    )
    await collection.addRawData(
        'font-variant-3.ttf',
        await globalState.swarm.newRawData(createArticleFontData(), 'font/ttf')
    )
    await collection.addRawData('style.css', await globalState.swarm.newRawData(createStyle(), 'text/css'))
    await collection.addRawData('default.png', await globalState.swarm.newRawData(createDefaultImage(), 'image/png'))
    await collection.addRawData('favicon.png', await globalState.swarm.newRawData(createFavicon(), 'image/png'))
    await collection.addRawData('/', await createFrontPage(globalState))
    await collection.addRawData('index.html', await createFrontPage(globalState))
    for (const page of globalState.pages) {
        await collection.addHandle(page.path, await globalState.swarm.newHandle(page.path, page.html, 'text/html'))
    }
    for (const article of globalState.articles) {
        await collection.addHandle(
            article.path,
            await globalState.swarm.newHandle(article.path, article.html, 'text/html')
        )
    }
    for (const collectionPage of Object.keys(globalState.collections)) {
        await collection.addHandle(
            createArticleSlug(collectionPage),
            await globalState.swarm.newHandle(collectionPage, globalState.collections[collectionPage], 'text/html')
        )
    }
    for (const asset of globalState.assets) {
        await collection.addHandle(
            asset.name,
            await globalState.swarm.newHandle(asset.name, asset.reference, asset.contentType)
        )
    }
    await collection.save()
    const website = await globalState.swarm.newWebsite(globalState.wallet.privateKey, collection)
    await website.publish()
}
