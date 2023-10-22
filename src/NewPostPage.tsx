import MDEditor from '@uiw/react-md-editor'
import './NewPostPage.css'

interface Props {
    articleContent: string
    setArticleContent: (content: string) => void
}

export function NewPostPage({ articleContent, setArticleContent }: Props) {
    return (
        <MDEditor
            value={articleContent}
            onChange={x => setArticleContent(x || '')}
            className="editor"
            height="90vh"
            data-color-mode="light"
        />
    )
}
