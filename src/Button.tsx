interface Props {
    children: string
    onClick: () => void
    small?: boolean
    secondary?: boolean
    disabled?: boolean
}

export function Button({ children, onClick, small, secondary, disabled }: Props) {
    let classes = 'button'
    if (small) {
        classes += ' button-small'
    }
    if (secondary) {
        classes += ' button-secondary'
    }
    return (
        <button className={classes} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    )
}
