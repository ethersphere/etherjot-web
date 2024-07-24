export function determineContentType(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase()
    switch (ext) {
        case 'html':
            return 'text/html'
        case 'css':
            return 'text/css'
        case 'js':
            return 'text/javascript'
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg'
        case 'png':
            return 'image/png'
        case 'gif':
            return 'image/gif'
        case 'svg':
            return 'image/svg+xml'
        case 'json':
            return 'application/json'
        case 'md':
        case 'markdown':
            return 'text/markdown'
        default:
            return 'application/octet-stream'
    }
}
