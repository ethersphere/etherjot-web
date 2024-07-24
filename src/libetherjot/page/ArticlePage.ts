import { Strings } from 'cafe-utility'
import { ParsedMarkdown } from '../engine/FrontMatter'
import { Article, GlobalState } from '../engine/GlobalState'
import { preprocess } from '../engine/Preprocessor'
import { createArticleSlug } from '../engine/Utility'
import { createCommentSystem } from '../html/Comment'
import { createDonationButton } from '../html/Donation'
import { createFooter } from '../html/Footer'
import { createHeader } from '../html/Header'
import { createHtml5 } from '../html/Html5'
import { createLinkSvg } from '../html/LinkSvg'
import { createLinkedinSvg } from '../html/LinkedinSvg'
import { createRelatedArticles } from '../html/RelatedArticles'
import { createStyleSheet } from '../html/StyleSheet'
import { createTagCloud } from '../html/TagCloud'
import { createTwitterSvg } from '../html/TwitterSvg'

export async function createArticlePage(
    title: string,
    markdown: ParsedMarkdown,
    globalState: GlobalState,
    category: string,
    tags: string[],
    banner: string,
    date: string,
    commentsFeed: string,
    kind: 'regular' | 'h1' | 'h2' | 'highlight',
    parseFn: (markdown: string) => string
): Promise<Article> {
    const processedArticle = await preprocess(parseFn(markdown.body))
    const sidebarPublishedHtml = tags.length
        ? `<div class="article-sidebar-block"><h3>Published in:</h3><div class="tag-cloud">${createTagCloud(
              tags,
              2
          )}</div></div>`
        : ``
    const relatedArticlesHtml = createRelatedArticles(globalState, title, tags, 2)
    const readMoreHtml = relatedArticlesHtml
        ? `<div class="content-area"><h2 class="read-more">Read more...</h2>${relatedArticlesHtml}</div>`
        : ``
    const head = `<title>${title} | ${globalState.configuration.title}</title>${createStyleSheet(2)}`
    const body = `
    ${await createHeader(globalState, 2, 'Latest', 'p')}
    <main>
        <article>
            <div class="content-area grid-container">
                <div class="grid-3">
                    <p class="article-date">${date}</p>
                </div>
                <div class="grid-6">
                    ${createTagCloud([category], 2)}
                    <h1>${title}</h1>
                </div>
            </div>
            <div class="content-area onpage-banner">
                <img src="${
                    !banner || banner === 'default.png' ? '../'.repeat(2) + 'default.png' : banner
                }" class="banner" />
            </div>
            <div class="content-area grid-container">
                <aside class="grid-3">
                    <div class="article-sidebar">
                        <div class="article-sidebar-block">
                        ${
                            processedArticle.tableOfContents.length
                                ? `<h3>Jump to:</h3>
                            <div class="table-of-contents">
                                ${processedArticle.tableOfContents
                                    .map(x => `<a href="#${x}">${Strings.camelToTitle(Strings.slugToCamel(x))}</a>`)
                                    .join('')}
                            </div>`
                                : ''
                        }
                        </div>
                        ${sidebarPublishedHtml}
                        <div class="article-sidebar-block">
                            <h3>Share to:</h3>
                            <span id="share-link" class="pointer">${createLinkSvg()}</span>
                            <span id="share-twitter" class="pointer">${createTwitterSvg()}</span>
                            <span id="share-linkedin" class="pointer">${createLinkedinSvg()}</span>
                        </div>
                    </div>
                </aside>
                <div class="grid-6">
                    ${processedArticle.html}
                    ${
                        globalState.configuration.extensions.donations &&
                        globalState.configuration.extensions.ethereumAddress
                            ? await createDonationButton(
                                  globalState.configuration.extensions.ethereumAddress,
                                  await globalState.swarm.mustGetUsableStamp()
                              )
                            : ''
                    }
                    ${globalState.configuration.extensions.comments ? await createCommentSystem(commentsFeed) : ''}
                </div>
            </div>
        </article>
        ${readMoreHtml}
    </main>
    ${await createFooter(globalState, 2)}
    <script>
        const shareLink = document.getElementById('share-link')
        const shareTwitter = document.getElementById('share-twitter')
        const shareLinkedin = document.getElementById('share-linkedin')
        const url = window.location.href
        shareLink.addEventListener('click', () => {
            navigator.clipboard.writeText(url)
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1000
              })
              Toast.fire({
                icon: 'success',
                title: 'Copied to clipboard'
              })
        })
        shareTwitter.addEventListener('click', () => {
            window.open('https://twitter.com/intent/tweet?url=' + encodeURIComponent(url))
        })
        shareLinkedin.addEventListener('click', () => {
            window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url))
        })
    </script>`
    const year = new Date(date).getFullYear()
    const html = await createHtml5(head, body, 2)
    const markdownHandle = await (
        await globalState.swarm.newResource('index.md', markdown.body, 'text/markdown')
    ).save()
    const htmlHash = await (await globalState.swarm.newRawData(html, 'text/html')).save()
    const path = `${category}/${year}/${createArticleSlug(title)}`
    return {
        title,
        banner,
        preview: Strings.stripHtml(processedArticle.html).slice(0, 150) + '...',
        kind,
        category,
        tags,
        markdown: markdownHandle.hash,
        html: htmlHash,
        path,
        createdAt: new Date(date).getTime(),
        commentsFeed,
        stamp: await globalState.swarm.mustGetUsableStamp()
    }
}
