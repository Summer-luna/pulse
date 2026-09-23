import { EditorContent } from '@tiptap/react'
import { useDescriptionEditor } from '@/controllers/use-description-editor'

interface Props {
  value: string
  onSave: (value: string) => void
  placeholder?: string
  className?: string
}

/** Click-to-edit rich text description (detail pages): saves on blur. */
export function DescriptionEditor({ value, onSave, placeholder = 'Add description…', className = '' }: Props) {
  const { editor, isUploading, uploadError } = useDescriptionEditor({
    value,
    placeholder,
    onBlur: (html) => {
      if (html !== value) {
        onSave(html)
      }
    },
  })

  return (
    <div
      onClick={() => editor.chain().focus().run()}
      className={`min-h-8 cursor-text rounded-md border border-transparent px-2 py-1.5 leading-relaxed hover:border-line ${className}`}
    >
      <EditorContent editor={editor} />
      {isUploading && <p className="mt-1 text-xs text-dim">Uploading image…</p>}
      {uploadError && <p className="mt-1 text-xs text-danger">{uploadError}</p>}
    </div>
  )
}
