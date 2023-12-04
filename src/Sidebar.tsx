import { Strings } from 'cafe-utility'
import { Article, GlobalState } from 'libetherjot'
import Swal from 'sweetalert2'
import { DEFAULT_CONTENT } from './Constants'
import { ExistingArticle } from './ExistingArticle'
import { Row } from './Row'
import './Sidebar.css'

interface Props {
    globalState: GlobalState
    setTab: (tab: string) => void
    editing: Article | false
    setEditing: (editing: Article | false) => void
    articleContent: string
    setArticleContent: (content: string) => void
    setArticleTitle: (title: string) => void
    setArticleBanner: (banner: string | null) => void
    setArticleCategory: (category: string) => void
    setArticleTags: (tags: string) => void
    setArticleCommentsFeed: (commentsFeed: string) => void
    setShowAssetBrowser: (show: boolean) => void
    setArticleType: (type: 'regular' | 'h1' | 'h2') => void
}

export function Sidebar({
    globalState,
    setTab,
    editing,
    setEditing,
    articleContent,
    setArticleContent,
    setArticleTitle,
    setArticleBanner,
    setArticleCategory,
    setArticleTags,
    setArticleCommentsFeed,
    setShowAssetBrowser,
    setArticleType
}: Props) {
    function onReset() {
        localStorage.clear()
        window.location.reload()
    }

    async function onNewArticle() {
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
        setEditing(false)
        setArticleContent(DEFAULT_CONTENT)
        setArticleTitle('')
        setArticleBanner(null)
        setArticleCategory('')
        setArticleCommentsFeed(Strings.randomHex(40))
        setTab('new-post')
        setArticleType('regular')
    }

    return (
        <aside className="sidebar">
            <Row>
                <p>Posts</p>
                <button onClick={onNewArticle}>+</button>
            </Row>
            <button onClick={() => setShowAssetBrowser(true)}>Asset Browser</button>
            {editing && (
                <p className="editing">
                    <strong>Editing:</strong> {editing.title}
                </p>
            )}
            <ul>
                {globalState.articles.map((x, i) => (
                    <li key={i}>
                        <ExistingArticle
                            article={x}
                            globalState={globalState}
                            setTab={setTab}
                            setEditing={setEditing}
                            articleContent={articleContent}
                            setArticleContent={setArticleContent}
                            setArticleTitle={setArticleTitle}
                            setArticleBanner={setArticleBanner}
                            setArticleCategory={setArticleCategory}
                            setArticleTags={setArticleTags}
                            setArticleCommentsFeed={setArticleCommentsFeed}
                            setArticleType={setArticleType}
                        />
                    </li>
                ))}
            </ul>
            <button onClick={onReset}>Reset</button>
        </aside>
    )
}
