import './Row.css'

interface Props {
    children: React.ReactNode | React.ReactNode[]
    gap?: number
}

export function Row({ children, gap = 0 }: Props) {
    const style = {
        columnGap: `${gap}px`
    }

    return (
        <div className="row" style={style}>
            {children}
        </div>
    )
}
