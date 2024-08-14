import { Strings } from 'cafe-utility'
import Swal from 'sweetalert2'
import { Button } from './Button'
import { DEFAULT_CONTENT } from './Constants'
import { ExistingArticle } from './ExistingArticle'
import { Horizontal } from './Horizontal'
import './Sidebar.css'
import { Article, GlobalState } from './libetherjot'

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
    async function onReset() {
        const confirmed = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will lose all your posts. You can export your blog from the settings page.',
            showCancelButton: true
        })
        if (!confirmed.isConfirmed) {
            return
        }
        const confirmedAgain = await Swal.fire({
            title: 'Are you really sure?',
            text: 'Your blog will be reset. This cannot be undone.',
            showCancelButton: true
        })
        if (!confirmedAgain.isConfirmed) {
            return
        }
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
            <Horizontal>
                <p>Posts</p>
                <Button onClick={onNewArticle}>+</Button>
            </Horizontal>
            <Button onClick={() => setShowAssetBrowser(true)}>Asset Browser</Button>
            {editing && (
                <p className="editing">
                    <strong>Editing:</strong> {editing.title}
                </p>
            )}
            <ul>
                {!globalState.articles.length && <p>No posts yet</p>}
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
            <Button secondary onClick={onReset}>
                Reset
            </Button>
        </aside>
    )
}
