import { GlobalState } from 'libetherjot'
import Swal from 'sweetalert2'
import { Horizontal } from '../Horizontal'

interface Props {
    globalState: GlobalState
    name: string
    contentType: string
    reference: string
    insertAsset: (reference: string) => void
    rerender: any
}

export function Thumbnail({ globalState, name, contentType, reference, insertAsset, rerender }: Props) {
    async function onRename() {
        const newName = await Swal.fire({
            title: 'New Name',
            input: 'text',
            inputValue: name,
            showCancelButton: true
        })
        if (!newName.value) {
            return
        }
        globalState.assets.find(x => x.reference === reference)!.name = newName.value!
        rerender((x: any) => x + 1)
    }

    async function onDelete() {
        const confirmed = await Swal.fire({
            title: 'Are you sure?',
            showCancelButton: true
        })
        if (!confirmed.isConfirmed) {
            return
        }
        globalState.assets = globalState.assets.filter(x => x.reference !== reference)
        rerender((x: any) => x + 1)
    }

    return (
        <div className="thumbnail">
            <img src={`${globalState.beeApi}/bzz/${reference}`} />
            <div className="thumbnail-name">{name}</div>
            <Horizontal gap={8}>
                <button className="button-xs" onClick={() => insertAsset(reference)}>
                    Insert
                </button>
                <button className="button-xs" onClick={onRename}>
                    Rename
                </button>
                <button className="button-xs" onClick={onDelete}>
                    Delete
                </button>
            </Horizontal>
        </div>
    )
}
