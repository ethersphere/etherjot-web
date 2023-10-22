import { GlobalState } from 'libetherjot'
import { useState } from 'react'
import { save } from './Saver'
import { Setting } from './Setting'

interface Props {
    globalState: GlobalState
    setGlobalState: (state: GlobalState) => void
}

export function GlobalSettingsPage({ globalState, setGlobalState }: Props) {
    const [title, setTitle] = useState(globalState.configuration.title)
    const [headerTitle, setHeaderTitle] = useState(globalState.configuration.header.title)
    const [headerDescription, setHeaderDescription] = useState(globalState.configuration.header.description)
    const [headerLink, setHeaderLink] = useState(globalState.configuration.header.link)
    const [mainHighlight, setMainHighlight] = useState(globalState.configuration.main.highlight)
    const [footerDescription, setFooterDescription] = useState(globalState.configuration.footer.description)
    const [footerDiscord, setFooterDiscord] = useState(globalState.configuration.footer.links.discord)
    const [footerTwitter, setFooterTwitter] = useState(globalState.configuration.footer.links.twitter)
    const [footerGitHub, setFooterGitHub] = useState(globalState.configuration.footer.links.github)
    const [footerYouTube, setFooterYouTube] = useState(globalState.configuration.footer.links.youtube)
    const [footerReddit, setFooterReddit] = useState(globalState.configuration.footer.links.reddit)

    async function onSave() {
        globalState.configuration.title = title
        globalState.configuration.header.title = headerTitle
        globalState.configuration.header.description = headerDescription
        globalState.configuration.header.link = headerLink
        globalState.configuration.main.highlight = mainHighlight
        globalState.configuration.footer.description = footerDescription
        globalState.configuration.footer.links.discord = footerDiscord
        globalState.configuration.footer.links.twitter = footerTwitter
        globalState.configuration.footer.links.github = footerGitHub
        globalState.configuration.footer.links.youtube = footerYouTube
        globalState.configuration.footer.links.reddit = footerReddit
        await save(globalState)
        setGlobalState({ ...globalState })
    }

    return (
        <div className="global-settings">
            <Setting title="Title" value={title} onChange={setTitle} />
            <Setting title="Header > Title" value={headerTitle} onChange={setHeaderTitle} />
            <Setting title="Header > Description" value={headerDescription} onChange={setHeaderDescription} />
            <Setting title="Header > Link" value={headerLink} onChange={setHeaderLink} />
            <Setting title="Main > Highlight" value={mainHighlight} onChange={setMainHighlight} />
            <Setting title="Footer > Description" value={footerDescription} onChange={setFooterDescription} />
            <Setting title="Footer > Discord" value={footerDiscord} onChange={setFooterDiscord} />
            <Setting title="Footer > Twitter" value={footerTwitter} onChange={setFooterTwitter} />
            <Setting title="Footer > GitHub" value={footerGitHub} onChange={setFooterGitHub} />
            <Setting title="Footer > YouTube" value={footerYouTube} onChange={setFooterYouTube} />
            <Setting title="Footer > Reddit" value={footerReddit} onChange={setFooterReddit} />
            <button onClick={onSave}>Save</button>
        </div>
    )
}
