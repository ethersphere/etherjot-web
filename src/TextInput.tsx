import { Vertical } from './Vertical'

interface Props {
    label: string
    value: string
    setter: (value: string) => void
    full?: boolean
    password?: boolean
}

export function TextInput({ label, value, setter, full, password }: Props) {
    return (
        <Vertical gap={8} left full>
            <label>{label}</label>
            <input
                type={password ? 'password' : 'text'}
                value={value}
                style={{ width: full ? '100%' : 'auto' }}
                onChange={e => setter(e.target.value)}
            />
        </Vertical>
    )
}
