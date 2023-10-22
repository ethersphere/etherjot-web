interface Props {
    children: React.ReactNode
    gap?: number
}

export function Horizontal({ children, gap = 0 }: Props) {
    const style = {
        display: 'flex',
        flexDirection: 'row' as any,
        alignItems: 'center',
        gap: `${gap}px`
    }

    return <div style={style}>{children}</div>
}
