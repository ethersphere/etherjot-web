import { Article, GlobalState, getGlobalState } from 'libetherjot'
import { useEffect, useState } from 'react'
import './App.css'
import { DEFAULT_CONTENT } from './Constants'
import { GlobalSettingsPage } from './GlobalSettingsPage'
import { NewPostPage } from './NewPostPage'
import { OptionsBar } from './OptionsBar'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { WelcomePage } from './WelcomePage'
import { AssetBrowser } from './asset-browser/AssetBrowser'

function App() {
    const [globalState, setGlobalState] = useState<GlobalState | null>(null)
    const [tab, setTab] = useState('new-post')
    const [articleTitle, setArticleTitle] = useState('')
    const [articleContent, setArticleContent] = useState(DEFAULT_CONTENT)
    const [articleBanner, setArticleBanner] = useState<string | null>(null)
    const [articleCategory, setArticleCategory] = useState<string>('')
    const [articleTags, setArticleTags] = useState<string>('')
    const [editing, setEditing] = useState<Article | false>(false)
    const [showAssetBrowser, setShowAssetBrowser] = useState(false)

    useEffect(() => {
        const storedState = localStorage.getItem('state')
        if (storedState) {
            const parsedState = JSON.parse(storedState)
            getGlobalState(parsedState).then(setGlobalState)
            setTab('new-post')
        }
    }, [])

    if (!globalState) {
        return <WelcomePage setGlobalState={setGlobalState} />
    }

    function insertAsset(reference: string) {
        setArticleContent(((y: string) => `${y}\n\n![img alt here](http://localhost:1633/bzz/${reference}/)`) as any)
        setShowAssetBrowser(false)
    }

    return (
        <>
            {showAssetBrowser && (
                <AssetBrowser
                    globalState={globalState}
                    setGlobalState={setGlobalState}
                    setShowAssetBrowser={setShowAssetBrowser}
                    insertAsset={insertAsset}
                />
            )}
            <Topbar
                tab={tab}
                setTab={setTab}
                globalState={globalState}
                articleTitle={articleTitle}
                articleContent={articleContent}
                editing={editing}
                setEditing={setEditing}
                articleBanner={articleBanner}
                articleCategory={articleCategory}
                articleTags={articleTags}
            />
            <main>
                <Sidebar
                    globalState={globalState}
                    setTab={setTab}
                    setEditing={setEditing}
                    setArticleContent={setArticleContent}
                    setArticleTitle={setArticleTitle}
                    setArticleBanner={setArticleBanner}
                    setArticleCategory={setArticleCategory}
                    setShowAssetBrowser={setShowAssetBrowser}
                    setArticleTags={setArticleTags}
                />
                {tab === 'new-post' && (
                    <NewPostPage articleContent={articleContent} setArticleContent={setArticleContent} />
                )}
                {tab === 'global-settings' && (
                    <GlobalSettingsPage globalState={globalState} setGlobalState={setGlobalState} />
                )}
                {tab === 'new-post' && (
                    <OptionsBar
                        globalState={globalState}
                        articleTitle={articleTitle}
                        setArticleTitle={setArticleTitle}
                        articleBanner={articleBanner}
                        setArticleBanner={setArticleBanner}
                        articleCategory={articleCategory}
                        setArticleCategory={setArticleCategory}
                        articleTags={articleTags}
                        setArticleTags={setArticleTags}
                    />
                )}
            </main>
        </>
    )
}

export default App
