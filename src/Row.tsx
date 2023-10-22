import './Row.css'

interface Props {
    children: React.ReactNode | React.ReactNode[]
}

export function Row({ children }: Props) {
    return <div className="row">{children}</div>
}
