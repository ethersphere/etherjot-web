import { Bee } from '@ethersphere/bee-js'
import Swal from 'sweetalert2'
import { DEFAULT_CONTENT } from './Constants'
import { Horizontal } from './Horizontal'
import { Row } from './Row'
import { save } from './Saver'
import { Vertical } from './Vertical'
import { Article, GlobalState } from './libetherjot'

interface Props {
    article: Article
    globalState: GlobalState
    setTab: (tab: string) => void
    setEditing: (editing: Article | false) => void
    articleContent: string
    setArticleContent: (content: string) => void
    setArticleTitle: (title: string) => void
    setArticleBanner: (banner: string | null) => void
    setArticleCategory: (category: string) => void
    setArticleTags: (tags: string) => void
    setArticleCommentsFeed: (commentsFeed: string) => void
    setArticleType: (type: 'regular' | 'h1' | 'h2') => void
}

export function ExistingArticle({
    article,
    globalState,
    setTab,
    setEditing,
    articleContent,
    setArticleContent,
    setArticleTitle,
    setArticleBanner,
    setArticleCategory,
    setArticleTags,
    setArticleCommentsFeed,
    setArticleType
}: Props) {
    async function onDelete() {
        globalState.articles = globalState.articles.filter(x => x !== article)
        await save(globalState)
        window.location.reload()
    }

    async function onEdit() {
        if (articleContent !== DEFAULT_CONTENT) {
            const confirmed = await Swal.fire({
                title: 'Are you sure?',
                text: 'You will lose unsaved changes',
                showCancelButton: true
            })
            if (!confirmed.isConfirmed) {
                return
            }
        }
        const bee = new Bee('http://localhost:1633')
        const raw = await bee.downloadFile(article.markdown)
        setEditing(article)
        setArticleTitle(article.title)
        setArticleContent(raw.data.text())
        setArticleBanner(article.banner)
        setArticleCategory(article.category)
        setArticleTags(article.tags.join(', '))
        setArticleCommentsFeed(article.commentsFeed)
        setArticleType(article.kind as any)
        setTab('new-post')
    }

    return (
        <Vertical gap={8}>
            <Row>
                <a href={`http://localhost:1633/bzz/${globalState.feed}/${article.path}`} target="_blank">
                    {article.title}
                </a>
            </Row>
            <Horizontal gap={8}>
                <button className="button-xs" onClick={onEdit}>
                    Edit
                </button>
                <button className="button-xs" onClick={onDelete}>
                    Delete
                </button>
            </Horizontal>
        </Vertical>
    )
}
