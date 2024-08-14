import { Optional } from 'cafe-utility'
import { Asset, GlobalState } from '../libetherjot'
import { Modal } from '../Modal'
import './AssetBrowser.css'
import { PickableAsset } from './PickableAsset'

interface Props {
    globalState: GlobalState
    callback: (asset: Optional<Asset>) => void
}

export function AssetPicker({ globalState, callback }: Props) {
    return (
        <Modal title="Pick an asset" onClose={() => callback(Optional.empty())}>
            {globalState.assets.length === 0 && <p>You haven't uploaded any assets yet.</p>}
            <div className="thumbnail-container">
                {globalState.assets.map(x => (
                    <PickableAsset key={x.reference} asset={x} callback={callback} />
                ))}
            </div>
        </Modal>
    )
}
