import { useState } from 'react'
import { Horizontal } from './Horizontal'
import { save } from './Saver'
import { SquareImage } from './SquareImage'
import './WelcomePage.css'
import { GlobalState, createDefaultGlobalState, getGlobalState } from './libetherjot'

interface Props {
    setGlobalState: (state: GlobalState) => void
    isBeeRunning: boolean
    hasPostageStamp: boolean
}

export function WelcomePage({ setGlobalState, isBeeRunning, hasPostageStamp }: Props) {
    const [blogName, setBlogName] = useState('')
    const [accepted, setAccepted] = useState(false)
    const [loading, setLoading] = useState(false)

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
        <div className="welcome-page">
            <h1>Welcome to Etherjot</h1>
            <p>To get started with your blog, you need the following:</p>
            <ul>
                <li>
                    <Horizontal gap={8}>
                        <SquareImage size={32} src={isBeeRunning ? '/etherjot/yes.png' : '/etherjot/no.png'} />
                        Local Bee node
                    </Horizontal>
                </li>
                <li>
                    <Horizontal gap={8}>
                        <SquareImage size={32} src={hasPostageStamp ? '/etherjot/yes.png' : '/etherjot/no.png'} />
                        Usable postage stamp
                    </Horizontal>
                </li>
            </ul>
            <Horizontal gap={8}>
                <input id="agreement" type="checkbox" onChange={event => setAccepted(event.target.checked)} />I
                understand that it is my responsibility to ensure that the postage stamp TTL does not run out. If the
                stamp expires, I may lose my blog.
            </Horizontal>
            <Horizontal gap={8}>
                <input
                    type="text"
                    placeholder="Enter your blog's name"
                    onChange={event => setBlogName(event.target.value)}
                    disabled={!hasPostageStamp}
                />
                <button onClick={onClick} disabled={!blogName || !accepted || loading}>
                    {loading ? 'Creating...' : 'Create'}
                </button>
            </Horizontal>
        </div>
    )
}
