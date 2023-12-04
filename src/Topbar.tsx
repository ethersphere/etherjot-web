import { GlobalState } from 'libetherjot'
import Swal from 'sweetalert2'
import { DEFAULT_CONTENT } from './Constants'
import { Row } from './Row'
import { SquareImage } from './SquareImage'
import './Topbar.css'

interface Props {
    setTab: (tab: string) => void
    articleContent: string
    globalState: GlobalState
    isBeeRunning: boolean
    hasPostageStamp: boolean
}

export function Topbar({ setTab, articleContent, globalState, isBeeRunning, hasPostageStamp }: Props) {
    async function onSettings() {
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
        setTab('global-settings')
    }

    return (
        <div className="topbar">
            <div>
                <button onClick={onSettings}>Settings</button>
            </div>
            <div>
                <label>Swarm Hash</label>
                <input type="text" value={globalState.feed} readOnly />
                <a href={`http://localhost:1633/bzz/${globalState.feed}/`} target="_blank">
                    Open
                </a>
            </div>
            <div>
                <Row gap={16}>
                    <Row gap={4}>
                        <label>Bee</label>
                        <SquareImage size={32} src={isBeeRunning ? '/yes.png' : '/no.png'} />
                    </Row>
                    <Row gap={4}>
                        <label>Stamp</label>
                        <SquareImage size={32} src={hasPostageStamp ? '/yes.png' : '/no.png'} />
                    </Row>
                </Row>
            </div>
        </div>
    )
}
