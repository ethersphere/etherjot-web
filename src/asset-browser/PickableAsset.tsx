import { Asset } from '../libetherjot'

interface Props {
    asset: Asset
    callback: (asset: Asset) => void
}

export function PickableAsset({ asset, callback }: Props) {
    return (
        <div className="thumbnail" onClick={() => callback(asset)}>
            <img src={`http://localhost:1633/bzz/${asset.reference}`} />
            <div className="thumbnail-name">{asset.name}</div>
        </div>
    )
}
