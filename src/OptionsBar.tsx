import { GlobalState } from 'libetherjot'
import './Sidebar.css'

interface Props {
    globalState: GlobalState
    articleTitle: string
    setArticleTitle: (title: string) => void
    articleBanner: string | null
    setArticleBanner: (banner: string | null) => void
    articleCategory: string
    setArticleCategory: (category: string) => void
    articleTags: string
    setArticleTags: (tags: string) => void
}

export function OptionsBar({
    globalState,
    articleTitle,
    setArticleTitle,
    articleBanner,
    setArticleBanner,
    articleCategory,
    setArticleCategory,
    articleTags,
    setArticleTags
}: Props) {
    return (
        <aside className="sidebar">
            <label>Title</label>
            <input type="text" value={articleTitle} onChange={event => setArticleTitle(event.target.value)} />
            <label>Type</label>
            <select>
                <option>Regular</option>
                <option>Primary</option>
                <option>Secondary</option>
                <option>Highlight</option>
            </select>
            <label>Category</label>
            <input type="text" value={articleCategory} onChange={event => setArticleCategory(event.target.value)} />
            <label>Tags (comma separated)</label>
            <input type="text" value={articleTags} onChange={event => setArticleTags(event.target.value)} />
            <label>Banner image</label>
            <select onChange={event => setArticleBanner(event.target.value)}>
                <option value={''}>None</option>
                {globalState.assets.map(x => (
                    <option
                        key={x.reference}
                        value={`/bzz/${x.reference}/`}
                        selected={articleBanner === `/bzz/${x.reference}/`}
                    >
                        {x.name}
                    </option>
                ))}
            </select>
        </aside>
    )
}
