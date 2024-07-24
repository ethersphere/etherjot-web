interface Props {
    children: React.ReactNode
    gap?: number
    left?: boolean
    full?: boolean
}

export function Vertical({ children, gap = 0, left = false, full = false }: Props) {
    const style = {
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: left ? 'flex-start' : 'center',
        gap: `${gap}px`,
        width: full ? '100%' : 'auto'
    }

    return <div style={style}>{children}</div>
}
