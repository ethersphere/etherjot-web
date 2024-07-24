import { GlobalState } from '../engine/GlobalState'
import { createTagCloud } from './TagCloud'

export function createPost(
    globalState: GlobalState,
    title: string,
    preview: string,
    category: string,
    tags: string[],
    createdAt: number,
    path: string,
    banner: string,
    kind: 'h1' | 'h2' | 'highlight' | 'regular',
    depth: number
): string {
    const formattedDate = new Date(createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric' })

    const bannerAsset = globalState.assets.find(x => x.reference === banner)
    const bannerSrc = bannerAsset ? '../'.repeat(depth) + bannerAsset.name : 'default.png'

    const image = kind === 'highlight' ? '' : `<a href="${path}"><img class="image-16-9" src="${bannerSrc}"></a>`
    const meta =
        kind === 'highlight'
            ? `<p class="article-timestamp">${formattedDate}</p>`
            : `<p class="article-timestamp">${formattedDate}</p>${createTagCloud(tags, 0)}`

    return `
    <div class="article-container article-container-${kind}">
        ${image}
        <div class="article-body">
            <a href="${path}">
                <p class="article-title">${title}</p>
                <p class="article-preview">${preview}</p>
            </a>
            <div class="article-meta">
                ${meta}
            </div>
        </div>
    </div>`
}
