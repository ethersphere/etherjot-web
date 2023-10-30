import { GlobalState } from 'libetherjot'
import { useState } from 'react'
import Swal from 'sweetalert2'
import { Container } from './Container'
import { save } from './Saver'
import { Setting } from './Setting'

interface Props {
    globalState: GlobalState
    setGlobalState: (state: GlobalState) => void
}

export function GlobalSettingsPage({ globalState, setGlobalState }: Props) {
    const [title, setTitle] = useState(globalState.configuration.title)
    const [headerTitle, setHeaderTitle] = useState(globalState.configuration.header.title)
    const [headerLogo, setHeaderLogo] = useState(globalState.configuration.header.logo)
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
        globalState.configuration.header.logo = headerLogo
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
        Swal.fire({
            title: 'Saved!',
            timer: 1000,
            timerProgressBar: true
        })
    }

    return (
        <div className="global-settings">
            <h2>Website</h2>
            <Container>
                <Setting title="Title" value={title} onChange={setTitle} />
            </Container>
            <h2>Header</h2>
            <Container>
                <Setting title="Title" value={headerTitle} onChange={setHeaderTitle} />
                <Setting title="Link" value={headerLink} onChange={setHeaderLink} />
                <Setting
                    title="Logo"
                    type="select"
                    value={headerLogo}
                    onChange={setHeaderLogo}
                    values={globalState.assets.map(x => ({ name: x.name, value: x.reference }))}
                />
            </Container>
            <Container>
                <Setting
                    title="Description"
                    type="textarea"
                    value={headerDescription}
                    onChange={setHeaderDescription}
                />
            </Container>
            <h2>Front page</h2>
            <Container>
                <Setting title="Highlight" value={mainHighlight} onChange={setMainHighlight} />
            </Container>
            <h2>Footer</h2>
            <Container>
                <Setting
                    title="Description"
                    type="textarea"
                    value={footerDescription}
                    onChange={setFooterDescription}
                />
            </Container>
            <Container>
                <Setting title="Discord" value={footerDiscord} onChange={setFooterDiscord} />
                <Setting title="Twitter" value={footerTwitter} onChange={setFooterTwitter} />
                <Setting title="GitHub" value={footerGitHub} onChange={setFooterGitHub} />
                <Setting title="YouTube" value={footerYouTube} onChange={setFooterYouTube} />
                <Setting title="Reddit" value={footerReddit} onChange={setFooterReddit} />
            </Container>
            <h2>Apply changes</h2>
            <button onClick={onSave}>Save</button>
        </div>
    )
}
