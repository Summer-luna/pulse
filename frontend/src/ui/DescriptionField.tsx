import { EditorContent } from '@tiptap/react'
import { useDescriptionEditor } from '@/controllers/use-description-editor'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

/** Continuously-controlled rich text description (create dialogs, entity doesn't exist yet). */
export function DescriptionField({ value, onChange, placeholder = 'Add description…', className = '' }: Props) {
  const { editor, isUploading, uploadError } = useDescriptionEditor({ value, placeholder, onUpdate: onChange })

  return (
    <div onClick={() => editor.chain().focus().run()} className={`cursor-text ${className}`}>
      <EditorContent editor={editor} />
      {isUploading && <p className="mt-1 text-xs text-dim">Uploading image…</p>}
      {uploadError && <p className="mt-1 text-xs text-danger">{uploadError}</p>}
    </div>
  )
}
