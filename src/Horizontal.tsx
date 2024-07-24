interface Props {
    children: React.ReactNode
    gap?: number
    between?: boolean
}

export function Horizontal({ children, gap = 0, between }: Props) {
    const style = {
        display: 'flex',
        flexDirection: 'row' as 'row',
        alignItems: 'center',
        justifyContent: between ? 'space-between' : 'flex-start',
        gap: `${gap}px`
    }

    return <div style={style}>{children}</div>
}
