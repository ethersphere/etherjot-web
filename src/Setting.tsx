interface Props {
    onChange: (value: string) => void
    title: string
    value: string
    type?: 'text' | 'textarea' | 'select'
    values?: { name: string; value: string }[]
}

export function Setting({ title, onChange, value, type = 'text', values }: Props) {
    return (
        <div>
            <p style={{ paddingLeft: '8px', paddingBottom: '8px' }}>{title}</p>
            {type === 'text' && <input type="text" onChange={event => onChange(event.target.value)} value={value} />}
            {type === 'textarea' && (
                <textarea onChange={event => onChange(event.target.value)} value={value}></textarea>
            )}
            {type === 'select' && values && (
                <select onChange={event => onChange(event.target.value)} value={value}>
                    {values.map(x => (
                        <option key={x.value} value={x.value}>
                            {x.name}
                        </option>
                    ))}
                </select>
            )}
        </div>
    )
}
