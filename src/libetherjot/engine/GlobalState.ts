import { Objects, Types } from 'cafe-utility'
import { Wallet, ethers } from 'ethers'
import { Swarm } from '../../libswarm'
import { createFrontPage } from '../page/FrontPage'

export interface Asset {
    name: string
    contentType: string
    reference: string
}

interface Configuration {
    title: string
    header: {
        title: string
        logo: string
        description: string
        linkLabel: string
        linkAddress: string
    }
    main: {
        highlight: string
    }
    footer: {
        description: string
        links: {
            discord: string
            twitter: string
            github: string
            youtube: string
            reddit: string
        }
    }
    extensions: {
        ethereumAddress: string
        donations: boolean
        comments: boolean
    }
}

interface Page {
    title: string
    markdown: string
    html: string
    path: string
}

export interface Article {
    title: string
    preview: string
    markdown: string
    html: string
    category: string
    tags: string[]
    createdAt: number
    path: string
    banner: string
    kind: 'h1' | 'h2' | 'regular' | 'highlight'
    stamp: string
    commentsFeed: string
}

export interface GlobalStateOnDisk {
    beeApi: string
    postageBatchId: string
    privateKey: string
    configuration: Configuration
    feed: string
    pages: Page[]
    articles: Article[]
    collections: Record<string, string>
    assets: Asset[]
}

export interface GlobalState {
    beeApi: string
    postageBatchId: string
    swarm: Swarm
    wallet: Wallet
    configuration: Configuration
    feed: string
    pages: Page[]
    articles: Article[]
    collections: Record<string, string>
    assets: Asset[]
}

export async function getGlobalState(json: Record<string, any>): Promise<GlobalState> {
    const configuration = Types.asObject(json.configuration)
    const globalStateOnDisk: GlobalStateOnDisk = {
        privateKey: Types.asString(json.privateKey),
        beeApi: Types.asString(json.beeApi),
        postageBatchId: Types.asEmptiableString(json.postageBatchId),
        configuration: {
            title: Types.asString(configuration.title),
            header: {
                title: Types.asEmptiableString(Objects.getDeep(configuration, 'header.title')),
                logo: Types.asEmptiableString(Objects.getDeep(configuration, 'header.logo')),
                description: Types.asEmptiableString(Objects.getDeep(configuration, 'header.description')),
                linkLabel: Types.asEmptiableString(Objects.getDeep(configuration, 'header.linkLabel')),
                linkAddress: Types.asEmptiableString(Objects.getDeep(configuration, 'header.linkAddress'))
            },
            main: {
                highlight: Types.asEmptiableString(Objects.getDeep(configuration, 'main.highlight'))
            },
            footer: {
                description: Types.asEmptiableString(Objects.getDeep(configuration, 'footer.description')),
                links: {
                    discord: Types.asEmptiableString(Objects.getDeep(configuration, 'footer.links.discord')),
                    twitter: Types.asEmptiableString(Objects.getDeep(configuration, 'footer.links.twitter')),
                    github: Types.asEmptiableString(Objects.getDeep(configuration, 'footer.links.github')),
                    youtube: Types.asEmptiableString(Objects.getDeep(configuration, 'footer.links.youtube')),
                    reddit: Types.asEmptiableString(Objects.getDeep(configuration, 'footer.links.reddit'))
                }
            },
            extensions: {
                ethereumAddress: Types.asEmptiableString(Objects.getDeep(configuration, 'extensions.ethereumAddress')),
                donations: Types.asBoolean(Objects.getDeep(configuration, 'extensions.donations')),
                comments: Types.asBoolean(Objects.getDeep(configuration, 'extensions.comments'))
            }
        },
        feed: Types.asString(json.feed),
        pages: Types.asArray(json.pages).map((x: any) => ({
            title: Types.asString(x.title),
            markdown: Types.asString(x.markdown),
            html: Types.asString(x.html),
            path: Types.asString(x.path)
        })),
        articles: Types.asArray(json.articles).map((x: any) => {
            return {
                title: Types.asString(x.title),
                preview: Types.asString(x.preview),
                markdown: Types.asString(x.markdown),
                html: Types.asString(x.html),
                category: Types.asString(x.category),
                tags: Types.asArray(x.tags || []).map(Types.asString),
                createdAt: Types.asNumber(x.createdAt),
                path: Types.asString(x.path),
                banner: x.banner || null,
                kind: Types.asString(x.kind) as any,
                stamp: Types.asString(x.stamp),
                commentsFeed: Types.asString(x.commentsFeed)
            }
        }),
        collections: Types.asObject(json.collections || {}) as Record<string, string>,
        assets: Types.asArray(json.assets || []).map((x: any) => ({
            name: Types.asString(x.name),
            contentType: Types.asString(x.contentType),
            reference: Types.asString(x.reference)
        }))
    }
    return createGlobalState(globalStateOnDisk)
}

export async function saveGlobalState(globalState: GlobalState): Promise<GlobalStateOnDisk> {
    const globalStateOnDisk: GlobalStateOnDisk = {
        beeApi: globalState.beeApi,
        postageBatchId: globalState.postageBatchId,
        privateKey: globalState.wallet.privateKey,
        configuration: globalState.configuration,
        feed: globalState.feed,
        pages: globalState.pages,
        articles: globalState.articles,
        collections: globalState.collections,
        assets: globalState.assets
    }
    return globalStateOnDisk
}

interface DefaultStateParams {
    beeApi?: string
    postageBatchId?: string
}

export async function createDefaultGlobalState(
    websiteName: string,
    params?: DefaultStateParams
): Promise<GlobalStateOnDisk> {
    const beeApi = params?.beeApi || 'http://localhost:1633'
    const postageBatchId = params?.postageBatchId || ''
    const swarm = new Swarm({
        beeApi,
        postageBatchId
    })
    const wallet = ethers.Wallet.createRandom()
    const collection = await swarm.newCollection()
    await collection.addRawData('index.html', await swarm.newRawData('hello', 'text/html'))
    await collection.save()
    console.log('Saved initial collection, got address:', collection.getHash())
    const website = await swarm.newWebsite(wallet.privateKey, collection)
    const feed = await website.generateAddress()
    console.log('Generated feed:', feed)
    const publishResults = await website.publish(0)
    console.log('Published website:', publishResults)
    const globalStateOnDisk: GlobalStateOnDisk = {
        beeApi,
        postageBatchId,
        privateKey: wallet.privateKey,
        pages: [],
        articles: [],
        feed,
        configuration: {
            title: websiteName,
            header: {
                title: '',
                logo: '',
                description: '',
                linkLabel: '',
                linkAddress: ''
            },
            main: {
                highlight: ''
            },
            footer: {
                description: '',
                links: {
                    discord: '',
                    twitter: '',
                    github: '',
                    youtube: '',
                    reddit: ''
                }
            },
            extensions: {
                ethereumAddress: '',
                donations: false,
                comments: false
            }
        },
        collections: {},
        assets: []
    }
    await createFrontPage(createGlobalState(globalStateOnDisk))
    return globalStateOnDisk
}

function createGlobalState(globalStateOnDisk: GlobalStateOnDisk): GlobalState {
    const globalState: GlobalState = {
        beeApi: globalStateOnDisk.beeApi,
        postageBatchId: globalStateOnDisk.postageBatchId,
        swarm: new Swarm({
            beeApi: globalStateOnDisk.beeApi,
            postageBatchId: globalStateOnDisk.postageBatchId || undefined
        }),
        wallet: new ethers.Wallet(
            globalStateOnDisk.privateKey.startsWith('0x')
                ? globalStateOnDisk.privateKey.slice(2)
                : globalStateOnDisk.privateKey
        ),
        configuration: globalStateOnDisk.configuration,
        feed: globalStateOnDisk.feed,
        pages: globalStateOnDisk.pages,
        articles: globalStateOnDisk.articles,
        collections: globalStateOnDisk.collections,
        assets: globalStateOnDisk.assets
    }
    return globalState
}
