import { Strings } from 'cafe-utility'
import { Article, GlobalState, createArticlePage, parseMarkdown } from 'libetherjot'
import { marked } from 'marked'
import { save } from './Saver'
import './Topbar.css'

interface Props {
    tab: string
    setTab: (tab: string) => void
    globalState: GlobalState
    articleTitle: string
    articleContent: string
    editing: Article | false
    setEditing: (editing: Article | false) => void
    articleBanner: string | null
    articleCategory: string
    articleTags: string
}

export function Topbar({
    tab,
    setTab,
    globalState,
    articleTitle,
    articleContent,
    editing,
    setEditing,
    articleBanner,
    articleCategory,
    articleTags
}: Props) {
    const markdown = parseMarkdown(articleContent)

    async function onPublish() {
        if (!articleTitle || !articleContent) {
            return
        }
        if (editing) {
            globalState.articles = globalState.articles.filter(x => x.html !== editing.html)
        }
        const results = await createArticlePage(
            articleTitle,
            markdown,
            globalState,
            articleCategory,
            articleTags
                .split(',')
                .map(x => Strings.shrinkTrim(x))
                .filter(x => x),
            articleBanner || '',
            '',
            marked.parse
        )
        globalState.articles.push(results)
        await save(globalState)
        setEditing(false)
        window.location.reload()
    }

    return (
        <div className="topbar">
            <div>
                <button onClick={() => setTab('global-settings')}>Configure {globalState.configuration.title}</button>
            </div>
            <div>
                <label>Swarm Hash</label>
                <input type="text" value={globalState.feed} readOnly />
                <a href={`http://localhost:1633/bzz/${globalState.feed}/`} target="_blank">
                    Open
                </a>
            </div>
            <div>
                {tab === 'new-post' && (
                    <button onClick={onPublish} disabled={!articleTitle || !articleCategory}>
                        {editing ? 'Update' : 'Publish'}
                    </button>
                )}
            </div>
        </div>
    )
}
