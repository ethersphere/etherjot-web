import { BeeDebug } from '@ethersphere/bee-js'
import { Dates, Strings } from 'cafe-utility'
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
import { AssetPicker } from './asset-browser/AssetPicker'

function App() {
    const [beeApi, setBeeApi] = useState<string>('http://localhost:1633')
    const [beeDebugApi, setBeeDebugApi] = useState<string>('http://localhost:1635')
    const [postageBatchId, setPostageBatchId] = useState<string>('')
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
    const [assetPickerCallback, setAssetPickerCallback] = useState<any>(() => {})

    useEffect(() => {
        const storedState = localStorage.getItem('state')
        if (storedState) {
            const parsedState = JSON.parse(storedState)
            getGlobalState(parsedState).then(setGlobalState)
            setTab('new-post')
        }
    }, [])

    async function checkBee() {
        const api = globalState?.beeDebugApi ?? beeDebugApi
        fetch(Strings.joinUrl(api, 'health'))
            .then(async () => {
                if (!isBeeRunning) {
                    setBeeRunning(true)
                }
                const beeDebug = new BeeDebug(api)
                if (postageBatchId) {
                    setHasPostageStamp(true)
                    return
                }
                try {
                    const stamps = await beeDebug.getAllPostageBatch()
                    if (stamps.some(x => x.usable)) {
                        if (!hasPostageStamp) {
                            setHasPostageStamp(true)
                        }
                    } else {
                        setHasPostageStamp(false)
                    }
                } catch {
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
    }, [globalState, postageBatchId, beeApi, beeDebugApi])

    if (!globalState) {
        return (
            <WelcomePage
                beeApi={beeApi}
                setBeeApi={setBeeApi}
                beeDebugApi={beeDebugApi}
                setBeeDebugApi={setBeeDebugApi}
                postageBatchId={postageBatchId}
                setPostageBatchId={setPostageBatchId}
                setGlobalState={setGlobalState}
                isBeeRunning={isBeeRunning}
                hasPostageStamp={hasPostageStamp}
            />
        )
    }

    function insertAsset(reference: string) {
        setArticleContent(((y: string) => `${y}\n\n![img alt here](${globalState!.beeApi}/bzz/${reference}/)`) as any)
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
