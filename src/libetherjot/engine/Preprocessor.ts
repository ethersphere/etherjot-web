import { Strings } from 'cafe-utility'

interface PreprocessedPage {
    html: string
    tableOfContents: string[]
}

export async function preprocess(html: string): Promise<PreprocessedPage> {
    const tableOfContents = Strings.extractAllBlocks(html, {
        opening: 'id="',
        closing: '"',
        exclusive: true
    })
    return { html, tableOfContents }
}
