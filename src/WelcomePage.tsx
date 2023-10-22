import { GlobalState, createDefaultGlobalState, getGlobalState } from 'libetherjot'
import { useState } from 'react'
import { Horizontal } from './Horizontal'
import { save } from './Saver'
import { SquareImage } from './SquareImage'
import './WelcomePage.css'

interface Props {
    setGlobalState: (state: GlobalState) => void
}

export function WelcomePage({ setGlobalState }: Props) {
    const [blogName, setBlogName] = useState('')

    function onClick() {
        createDefaultGlobalState(blogName)
            .then(json => getGlobalState(json))
            .then(async x => {
                await save(x)
                setGlobalState(x)
            })
    }

    return (
        <div className="welcome-page">
            <h1>Hello</h1>
            <p>It looks like this is your first time using Etherjot.</p>
            <p>To get started with your blog, you need the following:</p>
            <ul>
                <li>
                    <Horizontal gap={8}>
                        <SquareImage size={32} src="/yes.png" />
                        Local Bee node
                    </Horizontal>
                </li>
                <li>
                    <Horizontal gap={8}>
                        <SquareImage size={32} src="/yes.png" />
                        Usable postage stamp
                    </Horizontal>
                </li>
            </ul>
            <Horizontal>
                <input
                    type="text"
                    placeholder="Enter your blog's name"
                    onChange={event => setBlogName(event.target.value)}
                />
                <button onClick={onClick} disabled={blogName === ''}>
                    Create
                </button>
            </Horizontal>
        </div>
    )
}