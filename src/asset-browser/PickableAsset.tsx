import { Asset, GlobalState } from 'libetherjot'

interface Props {
    globalState: GlobalState
    asset: Asset
    callback: (asset: Asset) => void
}

export function PickableAsset({ globalState, asset, callback }: Props) {
    return (
        <div className="thumbnail" onClick={() => callback(asset)}>
            <img src={`${globalState.beeApi}/bzz/${asset.reference}`} />
            <div className="thumbnail-name">{asset.name}</div>
        </div>
    )
}
