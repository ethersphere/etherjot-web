import { Bee } from '@ethersphere/bee-js'
import { Article, GlobalState } from 'libetherjot'
import { Row } from './Row'
import { save } from './Saver'

interface Props {
    article: Article
    globalState: GlobalState
    setTab: (tab: string) => void
    setEditing: (editing: Article | false) => void
    setArticleContent: (content: string) => void
    setArticleTitle: (title: string) => void
    setArticleBanner: (banner: string | null) => void
    setArticleCategory: (category: string) => void
    setArticleTags: (tags: string) => void
    setArticleComments: (comments: boolean) => void
    setArticleCommentsFeed: (commentsFeed: string) => void;
}

export function ExistingArticle({
    article,
    globalState,
    setTab,
    setEditing,
    setArticleContent,
    setArticleTitle,
    setArticleBanner,
    setArticleCategory,
    setArticleTags,
    setArticleComments,
    setArticleCommentsFeed
}: Props) {
    async function onDelete() {
        globalState.articles = globalState.articles.filter(x => x !== article)
        await save(globalState)
        window.location.reload()
    }

    async function onEdit() {
        const bee = new Bee('http://localhost:1633')
        const raw = await bee.downloadFile(article.markdown)
        setEditing(article)
        setArticleTitle(article.title)
        setArticleContent(raw.data.text())
        setArticleBanner(article.banner)
        setArticleCategory(article.category)
        setArticleTags(article.tags.join(', '))
        setArticleComments(article.comments)
        setArticleCommentsFeed(article.commentsFeed)
        setTab('new-post')
    }

    return (
        <Row>
            <a href={`http://localhost:1633/bzz/${globalState.feed}/${article.path}`} target="_blank">
                {article.title}
            </a>
            <button className="button-xs" onClick={onEdit}>
                Edit
            </button>
            <button className="button-xs" onClick={onDelete}>
                Delete
            </button>
        </Row>
    )
}
