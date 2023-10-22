interface Props {
    size: number
    src: string
}

export function SquareImage({ size, src }: Props) {
    return (
        <img
            style={{
                width: `${size}px`,
                height: `${size}px`
            }}
            src={src}
        />
    )
}
