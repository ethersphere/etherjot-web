import { useState } from 'react'
import { Button } from '../Button'
import { Horizontal } from '../Horizontal'
import { Modal } from '../Modal'
import { TextInput } from '../TextInput'
import { Vertical } from '../Vertical'

interface Props {
    onClose: () => void
}

export function AccountModal({ onClose }: Props) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    function onRegister() {
        window.open('https://create.fairdatasociety.org/', '_blank')
    }

    function onConnect() {
        onClose()
    }

    return (
        <Modal title="Connect FDS Account" onClose={onClose}>
            <Vertical gap={32} exactWidth={360}>
                <p>The FDS Account gives access to a personal storage where all your posts and assets are stored.</p>
                <TextInput label="Username" value={username} setter={setUsername} full />
                <TextInput label="Password" value={password} setter={setPassword} full password />
                <Horizontal>
                    <Button onClick={onConnect}>Connect</Button>
                    <Button secondary onClick={onRegister}>
                        I don't have an account
                    </Button>
                </Horizontal>
            </Vertical>
        </Modal>
    )
}
