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
  const [editing, setEditing] = useState<Article | false>(false)
  const [commentsEnabled, setCommentsEnabled] = useState<boolean>(false);
  const [commentsFeed, setCommentsFeed] = useState<string>("");
  const [showAssetBrowser, setShowAssetBrowser] = useState(false)  

  useEffect(() => {
    const storedState = localStorage.getItem('state')
    if (storedState) {
      const parsedState = JSON.parse(storedState)
      getGlobalState(parsedState).then(setGlobalState)
      setTab('new-post')
    }
  }, [])

  async function checkBee() {
    fetch('http://localhost:1635/addresses')
      .then(async () => {
        if (!isBeeRunning) {
          setBeeRunning(true)
        }
        const beeDebug = new BeeDebug('http://localhost:1635')
        const stamps = await beeDebug.getAllPostageBatch()
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
        setTab={setTab}
        globalState={globalState}
        isBeeRunning={isBeeRunning}
        hasPostageStamp={hasPostageStamp}
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
          setArticleComments={setCommentsEnabled}
          setArticleCommentsFeed={setCommentsFeed}
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
            commentsEnabled={commentsEnabled}
            setCommentsEnabled={setCommentsEnabled}
            commentsFeed={commentsFeed}
            setCommentsFeed={setCommentsFeed}
          />
        )}
      </main>
    </>
  )
}

export default App
