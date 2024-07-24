import { Bee } from '@ethersphere/bee-js'
import { Dates, Optional, Strings } from 'cafe-utility'
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
import { AssetPicker } from './asset-browser/AssetPicker'
import { Article, Asset, GlobalState, getGlobalState } from './libetherjot'

function App() {
    const [globalState, setGlobalState] = useState<GlobalState | null>(null)
    const [isBeeRunning, setBeeRunning] = useState(false)
    const [hasPostageStamp, setHasPostageStamp] = useState(false)
    const [tab, setTab] = useState('new-post')
    const [articleTitle, setArticleTitle] = useState('')
    const [articleContent, setArticleContent] = useState(DEFAULT_CONTENT)
    const [articleBanner, setArticleBanner] = useState<string | null>(null)
    const [articleCategory, setArticleCategory] = useState<string>('')
    const [articleTags, setArticleTags] = useState<string>('')
    const [articleType, setArticleType] = useState<'regular' | 'h1' | 'h2'>('regular')
    const [articleDate, setArticleDate] = useState(Dates.isoDate())
    const [editing, setEditing] = useState<Article | false>(false)
    const [commentsFeed, setCommentsFeed] = useState<string>(Strings.randomHex(40))
    const [showAssetBrowser, setShowAssetBrowser] = useState(false)
    const [showAssetPicker, setShowAssetPicker] = useState(false)
    const [assetPickerCallback, setAssetPickerCallback] = useState<(asset: Optional<Asset>) => void>(() => () => {})

    useEffect(() => {
        const storedState = localStorage.getItem('state')
        if (storedState) {
            const parsedState = JSON.parse(storedState)
            getGlobalState(parsedState).then(setGlobalState)
            setTab('new-post')
        }
    }, [])

    async function checkBee() {
        fetch('http://localhost:1633/addresses')
            .then(async () => {
                if (!isBeeRunning) {
                    setBeeRunning(true)
                }
                const bee = new Bee('http://localhost:1633')
                const stamps = await bee.getAllPostageBatch()
                if (stamps.some(x => x.usable)) {
                    if (!hasPostageStamp) {
                        setHasPostageStamp(true)
                    }
                } else {
                    setHasPostageStamp(false)
                }
            })
            .catch(() => {
                setBeeRunning(false)
                setHasPostageStamp(false)
            })
    }

    useEffect(() => {
        checkBee()
        const interval = setInterval(() => {
            checkBee()
        }, Dates.seconds(5))
        return () => clearInterval(interval)
    }, [])

    if (!globalState) {
        return (
            <WelcomePage
                setGlobalState={setGlobalState}
                isBeeRunning={isBeeRunning}
                hasPostageStamp={hasPostageStamp}
            />
        )
    }

    function insertAsset(reference: string) {
        setArticleContent((y: string) => `${y}\n\n![img alt here](http://localhost:1633/bzz/${reference}/)`)
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
            {showAssetPicker && <AssetPicker globalState={globalState} callback={assetPickerCallback} />}
            <Topbar
                setTab={setTab}
                articleContent={articleContent}
                globalState={globalState}
                isBeeRunning={isBeeRunning}
                hasPostageStamp={hasPostageStamp}
            />
            <main>
                <Sidebar
                    globalState={globalState}
                    setTab={setTab}
                    editing={editing}
                    setEditing={setEditing}
                    articleContent={articleContent}
                    setArticleContent={setArticleContent}
                    setArticleTitle={setArticleTitle}
                    setArticleBanner={setArticleBanner}
                    setArticleCategory={setArticleCategory}
                    setShowAssetBrowser={setShowAssetBrowser}
                    setArticleTags={setArticleTags}
                    setArticleCommentsFeed={setCommentsFeed}
                    setArticleType={setArticleType}
                />
                {tab === 'new-post' && (
                    <NewPostPage articleContent={articleContent} setArticleContent={setArticleContent} />
                )}
                {tab === 'global-settings' && (
                    <GlobalSettingsPage
                        globalState={globalState}
                        setGlobalState={setGlobalState}
                        setAssetPickerCallback={setAssetPickerCallback}
                        setShowAssetPicker={setShowAssetPicker}
                    />
                )}
                {tab === 'new-post' && (
                    <OptionsBar
                        globalState={globalState}
                        articleContent={articleContent}
                        articleTitle={articleTitle}
                        setArticleTitle={setArticleTitle}
                        articleBanner={articleBanner}
                        setArticleBanner={setArticleBanner}
                        articleCategory={articleCategory}
                        setArticleCategory={setArticleCategory}
                        articleTags={articleTags}
                        setArticleTags={setArticleTags}
                        editing={editing}
                        setEditing={setEditing}
                        commentsFeed={commentsFeed}
                        articleType={articleType}
                        setArticleType={setArticleType}
                        articleDate={articleDate}
                        setArticleDate={setArticleDate}
                        setShowAssetPicker={setShowAssetPicker}
                        setAssetPickerCallback={setAssetPickerCallback}
                    />
                )}
            </main>
        </>
    )
}

export default App
