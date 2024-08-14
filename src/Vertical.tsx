interface Props {
    children: React.ReactNode
    gap?: number
    left?: boolean
    full?: boolean
    exactWidth?: number
}

export function Vertical({ children, gap = 0, left = false, full = false, exactWidth }: Props) {
    const style = {
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: left ? 'flex-start' : 'center',
        gap: `${gap}px`,
        width: full ? '100%' : 'auto',
        maxWidth: exactWidth ? `${exactWidth}px` : 'none',
        marginLeft: exactWidth ? 'auto' : 'none',
        marginRight: exactWidth ? 'auto' : 'none'
    }

    return <div style={style}>{children}</div>
}
