import { GlobalState } from '../engine/GlobalState'
import { createImage } from './Image'
import { createLogoSvg } from './LogoSvg'
import { createNav } from './Nav'

export async function createHeader(globalState: GlobalState, depth: number, active: string, variant = 'h1') {
    const title = globalState.configuration.header.title || globalState.configuration.title
    const description = globalState.configuration.header.description
    const linkLabel = globalState.configuration.header.linkLabel
    const linkAddress = globalState.configuration.header.linkAddress
    const descriptionHtml = description ? `<p class="blog-description">${description}</p>` : ''
    const linkHtml =
        linkLabel && linkAddress
            ? `<div class="blog-link">
            <a href="${linkAddress}" target="_blank">${linkLabel}</a>
        </div>`
            : ''
    const logo = globalState.configuration.header.logo
        ? globalState.assets.find(x => x.reference === globalState.configuration.header.logo)
        : null

    return `
    <header>
        <div class="content-area">
            <div class="header-top-row">
                <a href="${'../'.repeat(depth)}">
                    <div class="blog-name-row">
                        ${logo ? createImage(logo, depth) : createLogoSvg()}
                        <${variant} class="blog-name">${title}</${variant}>
                    </div>
                </a>
                <div class="row">
                    ${linkHtml}
                </div>
            </div>
            ${descriptionHtml}
            ${createNav(globalState, depth, active)}
        </div>
    </header>`
}
