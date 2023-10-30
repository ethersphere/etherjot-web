import { GlobalState } from 'libetherjot'
import { Row } from './Row'
import { SquareImage } from './SquareImage'
import './Topbar.css'

interface Props {
    setTab: (tab: string) => void
    globalState: GlobalState
    isBeeRunning: boolean
    hasPostageStamp: boolean
}

export function Topbar({ setTab, globalState, isBeeRunning, hasPostageStamp }: Props) {
    return (
        <div className="topbar">
            <div>
                <button onClick={() => setTab('global-settings')}>Configure {globalState.configuration.title}</button>
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
