import { Strings, Types } from 'cafe-utility'
import { GlobalState } from 'libetherjot'
import { useState } from 'react'
import Swal from 'sweetalert2'
import { save } from '../Saver'
import './AssetBrowser.css'
import { Thumbnail } from './Thumbnail'

interface Props {
    globalState: GlobalState
    setGlobalState: (state: GlobalState) => void
    setShowAssetBrowser: (show: boolean) => void
    insertAsset: (reference: string) => void
}

export function AssetBrowser({ globalState, setGlobalState, setShowAssetBrowser, insertAsset }: Props) {
    const [_, rerender] = useState(0)

    async function onNewAsset() {
        await Swal.fire({
            title: 'Please Select Image File',
            input: 'file',
            inputAttributes: {
                accept: 'image/*',
                'aria-label': 'Select Image'
            },
            showLoaderOnConfirm: true,
            preConfirm: result => {
                const reader = new FileReader()
                reader.onload = event => {
                    if (!event.target) {
                        return
                    }
                    const dataUri = Types.asString(event.target.result)
                    const contentType = Strings.betweenNarrow(dataUri, 'data:', ';')
                    const base64String = Strings.after(dataUri, 'base64,')
                    const byteArray = Strings.base64ToUint8Array(base64String)
                    Swal.fire({
                        title: 'Uploading on Swarm...',
                        imageUrl: event.target.result as string,
                        imageHeight: 200,
                        imageWidth: 200,
                        imageAlt: 'The uploaded picture',
                        didOpen: async () => {
                            Swal.showLoading()
                            const hash = await (
                                await globalState.swarm.newResource('upload', byteArray, contentType)
                            ).save()
                            globalState.assets.push({
                                reference: hash.hash,
                                contentType,
                                name: result.name
                            })
                            await save(globalState)
                            Swal.close()
                            setGlobalState({ ...globalState })
                        }
                    })
                }
                reader.readAsDataURL(result)
            }
        })
    }

    return (
        <div id="asset-browser-wrapper">
            <div id="asset-browser">
                <div className="asset-browser-header">
                    <button className="asset-browser-close" onClick={onNewAsset}>
                        Add New
                    </button>
                    <div className="asset-browser-title">Asset Browser</div>
                    <button className="asset-browser-close" onClick={() => setShowAssetBrowser(false)}>
                        Close
                    </button>
                </div>
                <div className="asset-browser-header">
                    <p>Click on an image to insert it in the article.</p>
                </div>
                <div className="thumbnail-container">
                    {globalState.assets.map(x => (
                        <Thumbnail
                            globalState={globalState}
                            key={x.reference}
                            contentType={x.contentType}
                            name={x.name}
                            reference={x.reference}
                            insertAsset={insertAsset}
                            rerender={rerender}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
