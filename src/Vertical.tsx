interface Props {
    children: React.ReactNode
    gap?: number
}

export function Vertical({ children, gap = 0 }: Props) {
    const style = {
        display: 'flex',
        flexDirection: 'column' as any,
        alignItems: 'center',
        gap: `${gap}px`
    }

    return <div style={style}>{children}</div>
}
