import Placeholder from '@tiptap/extension-placeholder'
import { type Editor, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useRef, useState } from 'react'
import { errorMessage } from '@/lib/error-message'
import { imageUploadService } from '@/services/image-upload-service'
import { ImageWithToolbar } from '@/ui/rich-description/image-extension'

interface Options {
  value: string
  editable?: boolean
  placeholder?: string
  onUpdate?: (html: string) => void
  onBlur?: (html: string) => void
}

export interface DescriptionEditorState {
  editor: Editor
  isUploading: boolean
  uploadError: string | null
}

function htmlOf(editor: Editor): string {
  return editor.isEmpty ? '' : editor.getHTML()
}

export function useDescriptionEditor({ value, editable = true, placeholder = 'Add description…', onUpdate, onBlur }: Options): DescriptionEditorState {
  const [isUploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const onUpdateRef = useRef(onUpdate)
  const onBlurRef = useRef(onBlur)
  onUpdateRef.current = onUpdate
  onBlurRef.current = onBlur

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      ImageWithToolbar.configure({ inline: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editable,
    editorProps: {
      attributes: { class: 'description-editor' },
      handlePaste: (_view, event) => {
        const file = [...(event.clipboardData?.items ?? [])].find((item) => item.type.startsWith('image/'))?.getAsFile()
        if (!file) {
          return false
        }
        event.preventDefault()
        void uploadAndInsert(file)
        return true
      },
      handleDrop: (_view, event) => {
        const file = [...(event.dataTransfer?.files ?? [])].find((candidate) => candidate.type.startsWith('image/'))
        if (!file) {
          return false
        }
        event.preventDefault()
        void uploadAndInsert(file)
        return true
      },
    },
    onUpdate: ({ editor }) => onUpdateRef.current?.(htmlOf(editor)),
    onBlur: ({ editor }) => onBlurRef.current?.(htmlOf(editor)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholder])

  async function uploadAndInsert(file: File) {
    setUploadError(null)
    setUploading(true)
    try {
      const url = await imageUploadService.upload(file)
      editor?.chain().focus().setImage({ src: url }).run()
    } catch (caught) {
      setUploadError(errorMessage(caught))
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    if (editor && !editor.isFocused && value !== htmlOf(editor)) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [value, editor])

  useEffect(() => {
    editor?.setEditable(editable)
  }, [editable, editor])

  return { editor, isUploading, uploadError }
}
