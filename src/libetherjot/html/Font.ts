import { Binary } from 'cafe-utility'
import { articleFontData } from '../data/ArticleFont'
import { brandingFontData } from '../data/BrandingFont'
import { menuFontData } from '../data/MenuFont'

export function createNormalFontData() {
    return Binary.base64ToUint8Array(menuFontData)
}

export function createBrandingFontData() {
    return Binary.base64ToUint8Array(brandingFontData)
}

export function createArticleFontData() {
    return Binary.base64ToUint8Array(articleFontData)
}
