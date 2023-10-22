interface Props {
    name: string
    contentType: string
    reference: string
    insertAsset: (reference: string) => void
}

export function Thumbnail({ name, contentType, reference, insertAsset }: Props) {
    return (
        <div className="thumbnail" onClick={() => insertAsset(reference)}>
            <img src={`http://localhost:1633/bzz/${reference}`} />
            <div className="thumbnail-name">{name}</div>
        </div>
    )
}
