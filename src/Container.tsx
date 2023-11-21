interface Props {
    children: React.ReactNode
}

export function Container({ children }: Props) {
    return (
        <div
            style={{
                display: 'flex',
                borderRadius: '4px',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '16px',
                backgroundColor: '#f0f0f0',
                padding: '16px',
                boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)'
            }}
        >
            {children}
        </div>
    )
}
