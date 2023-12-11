import { Strings } from 'cafe-utility'
import { Article, Asset, GlobalState, createArticlePage, parseMarkdown } from 'libetherjot'
import { parse } from 'marked'
import { save } from './Saver'
import './Sidebar.css'

interface Props {
    globalState: GlobalState
    articleContent: string
    articleTitle: string
    setArticleTitle: (title: string) => void
    articleBanner: string | null
    setArticleBanner: (banner: string | null) => void
    articleCategory: string
    setArticleCategory: (category: string) => void
    articleTags: string
    setArticleTags: (tags: string) => void
    editing: Article | false
    setEditing: (editing: Article | false) => void
    articleType: 'regular' | 'h1' | 'h2'
    setArticleType: (type: 'regular' | 'h1' | 'h2') => void
    commentsFeed: string
    articleDate: string
    setArticleDate: (date: string) => void
    setShowAssetPicker: (show: boolean) => void
    setAssetPickerCallback: any
}

export function OptionsBar({
    globalState,
    articleContent,
    articleTitle,
    setArticleTitle,
    articleBanner,
    setArticleBanner,
    articleCategory,
    setArticleCategory,
    articleTags,
    setArticleTags,
    editing,
    setEditing,
    articleType,
    setArticleType,
    commentsFeed,
    articleDate,
    setArticleDate,
    setShowAssetPicker,
    setAssetPickerCallback
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
            articleDate,
            commentsFeed,
            articleType,
            parse
        )
        globalState.articles.push(results)
        await save(globalState)
        setEditing(false)
        window.location.reload()
    }

    return (
        <aside className="sidebar">
            <label>
                <strong>Title</strong>
            </label>
            <input type="text" value={articleTitle} onChange={event => setArticleTitle(event.target.value)} />
            <label>
                <strong>Category</strong>
            </label>
            <input type="text" value={articleCategory} onChange={event => setArticleCategory(event.target.value)} />
            <label>
                <strong>Date</strong>
            </label>
            <input type="text" value={articleDate} onChange={event => setArticleDate(event.target.value)} />
            <label>Banner image</label>
            {articleBanner && <img src={`${globalState.beeApi}${articleBanner}`} />}
            <button
                onClick={() => {
                    setShowAssetPicker(true)
                    const callbackFn = (asset: Asset) => {
                        setArticleBanner('/bzz/' + asset.reference)
                        setShowAssetPicker(false)
                    }
                    setAssetPickerCallback(() => callbackFn)
                }}
            >
                Select
            </button>
            <label>Type</label>
            <select onChange={event => setArticleType(event.target.value as any)}>
                <option value="regular" selected={articleType === 'regular'}>
                    Regular
                </option>
                <option value="h1" selected={articleType === 'h1'}>
                    Primary
                </option>
                <option value="h2" selected={articleType === 'h2'}>
                    Secondary
                </option>
            </select>
            <label>Tags (comma separated)</label>
            <input type="text" value={articleTags} onChange={event => setArticleTags(event.target.value)} />
            <button onClick={onPublish} disabled={!articleTitle || !articleCategory}>
                {editing ? 'Update' : 'Publish'}
            </button>
        </aside>
    )
}
