import { Optional } from 'cafe-utility'
import { Asset, GlobalState } from '../libetherjot'
import './AssetBrowser.css'
import { PickableAsset } from './PickableAsset'

interface Props {
    globalState: GlobalState
    callback: (asset: Optional<Asset>) => void
}

export function AssetPicker({ globalState, callback }: Props) {
    return (
        <div id="asset-browser-wrapper">
            <div id="asset-browser">
                <div className="asset-browser-header">
                    <div className="asset-browser-title">Pick an asset</div>
                    <button onClick={() => callback(Optional.empty())}>Cancel</button>
                </div>
                <div className="thumbnail-container">
                    {globalState.assets.map(x => (
                        <PickableAsset key={x.reference} asset={x} callback={callback} />
                    ))}
                </div>
            </div>
        </div>
    )
}
