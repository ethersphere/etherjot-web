interface Props {
    onChange: (value: string) => void
    title: string
    value: string
}

export function Setting({ title, onChange, value }: Props) {
    return (
        <div
            style={{
                display: 'inline-block',
                padding: '8px'
            }}
        >
            <p>{title}</p>
            <input type="text" onChange={event => onChange(event.target.value)} value={value} />
        </div>
    )
}
