import { GlobalState, createDefaultGlobalState, getGlobalState } from 'libetherjot'
import { useState } from 'react'
import { Horizontal } from './Horizontal'
import { save } from './Saver'
import { SquareImage } from './SquareImage'
import './WelcomePage.css'

interface Props {
    beeApi: string
    setBeeApi: (beeApi: string) => void
    beeDebugApi: string
    setBeeDebugApi: (beeDebugApi: string) => void
    postageBatchId: string
    setPostageBatchId: (postageBatchId: string) => void
    setGlobalState: (state: GlobalState) => void
    isBeeRunning: boolean
    hasPostageStamp: boolean
}

export function WelcomePage({
    beeApi,
    setBeeApi,
    beeDebugApi,
    setBeeDebugApi,
    postageBatchId,
    setPostageBatchId,
    setGlobalState,
    isBeeRunning,
    hasPostageStamp
}: Props) {
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [blogName, setBlogName] = useState('')
    const [accepted, setAccepted] = useState(false)

    function onClick() {
        createDefaultGlobalState(blogName, { beeApi, beeDebugApi, postageBatchId })
            .then(json => getGlobalState(json))
            .then(async x => {
                await save(x)
                setGlobalState(x)
            })
    }

    return (
        <div className="welcome-page">
            {!showAdvanced && (
                <>
                    <h1>Welcome to Etherjot</h1>
                    <p>To get started with your blog, you need the following:</p>
                    <ul>
                        <li>
                            <Horizontal gap={8}>
                                <SquareImage size={32} src={isBeeRunning ? 'yes.png' : 'no.png'} />
                                Local Bee node
                            </Horizontal>
                        </li>
                        <li>
                            <Horizontal gap={8}>
                                <SquareImage size={32} src={hasPostageStamp ? 'yes.png' : 'no.png'} />
                                Usable postage stamp
                            </Horizontal>
                        </li>
                    </ul>
                    <Horizontal gap={8}>
                        <input id="agreement" type="checkbox" onChange={event => setAccepted(event.target.checked)} />I
                        understand that it is my responsibility to ensure that the postage stamp TTL does not run out.
                        If the stamp expires, I may lose my blog.
                    </Horizontal>
                    <Horizontal gap={8}>
                        <input
                            type="text"
                            placeholder="Enter your blog's name"
                            onChange={event => setBlogName(event.target.value)}
                            disabled={!hasPostageStamp}
                        />
                        <button onClick={onClick} disabled={!blogName || !accepted}>
                            Create
                        </button>
                    </Horizontal>
                </>
            )}
            <button onClick={() => setShowAdvanced(!showAdvanced)}>Toggle advanced settings</button>
            {showAdvanced && (
                <>
                    <h2>Advanced settings</h2>
                    <label>Bee API</label>
                    <input
                        type="text"
                        placeholder="Bee API"
                        onChange={event => setBeeApi(event.target.value)}
                        value={beeApi}
                    />
                    <label>Bee Debug API</label>
                    <input
                        type="text"
                        placeholder="Bee Debug API"
                        onChange={event => setBeeDebugApi(event.target.value)}
                        value={beeDebugApi}
                    />
                    <label>Postage Batch ID</label>
                    <input
                        type="text"
                        placeholder="Postage Batch ID"
                        onChange={event => setPostageBatchId(event.target.value)}
                        value={postageBatchId}
                    />
                </>
            )}
        </div>
    )
}
