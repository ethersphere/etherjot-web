import { Objects } from 'cafe-utility'
import { GlobalState } from '../engine/GlobalState'
import { createLogoSvg } from './LogoSvg'
import { createNav } from './Nav'

export async function createHeader(globalState: GlobalState, depth: number, active: string, variant = 'h1') {
    const title = Objects.getFirstDeep(globalState.configuration as any, ['header.title', 'title'])
    const description = Objects.getDeep(globalState.configuration as any, 'header.description')
    const linkLabel = Objects.getDeep(globalState.configuration as any, 'header.linkLabel')
    const linkAddress = Objects.getDeep(globalState.configuration as any, 'header.linkAddress')
    const descriptionHtml = description ? `<p class="blog-description">${description}</p>` : ''
    const linkHtml =
        linkLabel && linkAddress
            ? `<div class="blog-link">
            <a href="${linkAddress}" target="_blank">${linkLabel}</a>
        </div>`
            : ''

    return `
    <header>
        <div class="content-area">
            <div class="header-top-row">
                <a href="${'../'.repeat(depth)}">
                    <div class="blog-name-row">
                        ${
                            globalState.configuration.header.logo
                                ? `<img src="${'../'.repeat(depth + 1)}${globalState.configuration.header.logo}" />`
                                : createLogoSvg()
                        }
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
