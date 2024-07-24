import { GlobalState, recreateMantaray, saveGlobalState } from './libetherjot'

export async function save(globalState: GlobalState) {
    await recreateMantaray(globalState)
    await saveGlobalState(globalState).then(async state => {
        localStorage.setItem('state', JSON.stringify(state))
    })
}
