import { FdpStorage } from '@fairdatasociety/fdp-storage'
import { useState } from 'react'
import { Button } from './Button'
import { Horizontal } from './Horizontal'
import { save } from './Saver'
import { SquareImage } from './SquareImage'
import './WelcomePage.css'
import { AccountModal } from './account/AccountModal'
import { GlobalState, createDefaultGlobalState, getGlobalState } from './libetherjot'

interface Props {
    setGlobalState: (state: GlobalState) => void
    isBeeRunning: boolean
    hasPostageStamp: boolean
    fdp: FdpStorage | null
    setFdp: (fdp: FdpStorage) => void
}

export function WelcomePage({ setGlobalState, isBeeRunning, hasPostageStamp, fdp, setFdp }: Props) {
    const [blogName, setBlogName] = useState('')
    const [accepted, setAccepted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showAccountModal, setShowAccountModal] = useState(false)

    function onClick() {
        setLoading(true)
        createDefaultGlobalState(blogName)
            .then(json => getGlobalState(json))
            .then(async x => {
                await save(x)
                setGlobalState(x)
            })
    }

    return (
        <>
            <div className="welcome-page">
                <h1>Welcome to Etherjot</h1>
                <p>To get started with your blog, you need the following:</p>
                <ul>
                    <li>
                        <Horizontal gap={8}>
                            <SquareImage size={32} src={isBeeRunning ? '/assets/yes.png' : '/assets/no.png'} />
                            Local Bee node
                        </Horizontal>
                    </li>
                    <li>
                        <Horizontal gap={8}>
                            <SquareImage size={32} src={hasPostageStamp ? '/assets/yes.png' : '/assets/no.png'} />
                            Usable postage stamp
                        </Horizontal>
                    </li>
                    <li>
                        <Horizontal gap={8}>
                            <SquareImage size={32} src={fdp !== null ? '/assets/yes.png' : '/assets/no.png'} />
                            FDS Account
                            {fdp === null && (
                                <Button secondary small onClick={() => setShowAccountModal(true)}>
                                    Connect
                                </Button>
                            )}
                        </Horizontal>
                    </li>
                </ul>
                <Horizontal gap={8}>
                    <input id="agreement" type="checkbox" onChange={event => setAccepted(event.target.checked)} />I
                    understand that it is my responsibility to ensure that the postage stamp TTL does not run out. If
                    the stamp expires, I lose my blog.
                </Horizontal>
                <Horizontal gap={8}>
                    <input
                        type="text"
                        placeholder="Enter your blog's name"
                        onChange={event => setBlogName(event.target.value)}
                        disabled={!hasPostageStamp}
                    />
                    <Button onClick={onClick} disabled={!blogName || !accepted || loading}>
                        {loading ? 'Creating...' : 'Create'}
                    </Button>
                </Horizontal>
            </div>
            {showAccountModal && <AccountModal onClose={() => setShowAccountModal(false)} />}
        </>
    )
}
