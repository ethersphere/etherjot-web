import Swal from 'sweetalert2'
import { Button } from './Button'
import { DEFAULT_CONTENT } from './Constants'
import { Horizontal } from './Horizontal'
import { SquareImage } from './SquareImage'
import './Topbar.css'
import { GlobalState } from './libetherjot'

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
                <Button onClick={onSettings}>Settings</Button>
            </div>
            <div>
                <label>Swarm Hash</label>
                <input type="text" value={globalState.feed} readOnly />
                <a href={`http://localhost:1633/bzz/${globalState.feed}/`} target="_blank">
                    Open
                </a>
            </div>
            <div>
                <Horizontal gap={16}>
                    <Horizontal gap={4}>
                        <label>Bee</label>
                        <SquareImage size={32} src={isBeeRunning ? '/assets/yes.png' : '/assets/no.png'} />
                    </Horizontal>
                    <Horizontal gap={4}>
                        <label>Stamp</label>
                        <SquareImage size={32} src={hasPostageStamp ? '/assets/yes.png' : '/assets/no.png'} />
                    </Horizontal>
                </Horizontal>
            </div>
        </div>
    )
}
