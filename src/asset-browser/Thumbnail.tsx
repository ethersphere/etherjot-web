import Swal from 'sweetalert2'
import { Button } from '../Button'
import { Horizontal } from '../Horizontal'
import { GlobalState } from '../libetherjot'

interface Props {
    globalState: GlobalState
    name: string
    contentType: string
    reference: string
    insertAsset: (reference: string) => void
    rerender: (callback: (x: number) => number) => void
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
        rerender(x => x + 1)
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
        rerender(x => x + 1)
    }

    return (
        <div className="thumbnail">
            <img src={`http://localhost:1633/bytes/${reference}`} />
            <div className="thumbnail-name">{name}</div>
            <Horizontal gap={8}>
                <Button small onClick={() => insertAsset(reference)}>
                    Insert
                </Button>
                <Button small onClick={onRename}>
                    Rename
                </Button>
                <Button small onClick={onDelete}>
                    Delete
                </Button>
            </Horizontal>
        </div>
    )
}
