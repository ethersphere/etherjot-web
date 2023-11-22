import { Strings } from 'cafe-utility'
import { Article, GlobalState } from 'libetherjot'
import { DEFAULT_CONTENT } from './Constants'
import { ExistingArticle } from './ExistingArticle'
import { Row } from './Row'
import './Sidebar.css'

interface Props {
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
    setShowAssetBrowser: (show: boolean) => void
}

export function Sidebar({
    globalState,
    setTab,
    setEditing,
    setArticleContent,
    setArticleTitle,
    setArticleBanner,
    setArticleCategory,
    setArticleTags,
    setArticleComments,
    setArticleCommentsFeed,
    setShowAssetBrowser
}: Props) {
    function onReset() {
        localStorage.clear()
        window.location.reload()
    }

    function onNewArticle() {
        setEditing(false)
        setArticleContent(DEFAULT_CONTENT)
        setArticleTitle('')
        setArticleBanner(null)
        setArticleCategory('')
        setArticleComments(false)
        setArticleCommentsFeed('')
        setTab('new-post')
    }

    return (
        <aside className="sidebar">
            <Row>
                <p>Posts</p>
                <button onClick={onNewArticle}>+</button>
            </Row>
            <ul>
                {globalState.articles.map((x, i) => (
                    <li key={i}>
                        <ExistingArticle
                            article={x}
                            globalState={globalState}
                            setTab={setTab}
                            setEditing={setEditing}
                            setArticleContent={setArticleContent}
                            setArticleTitle={setArticleTitle}
                            setArticleBanner={setArticleBanner}
                            setArticleCategory={setArticleCategory}
                            setArticleTags={setArticleTags}
                            setArticleComments={setArticleComments}
                            setArticleCommentsFeed={setArticleCommentsFeed}
                        />
                    </li>
                ))}
            </ul>
            <button onClick={() => setShowAssetBrowser(true)}>Asset Browser</button>
            <button onClick={onReset}>Reset</button>
        </aside>
    )
}
