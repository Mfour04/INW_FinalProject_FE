import { useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import CharacterCount from "@tiptap/extension-character-count"
import { MenuBar } from "./MenuBar/MenuBar"

export const RichTextEditor = () => {
  const [charCount, setCharCount] = useState(0)
  const [wordCount, setWordCount] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount.configure({
        limit: 5000,
      }),
    ],
    content: "<p>Hello world</p>",
    onCreate({ editor }) {
      setCharCount(editor.storage.characterCount.characters())
      setWordCount(editor.storage.characterCount.words())
    },
    onUpdate({ editor }) {
      setCharCount(editor.storage.characterCount.characters())
      setWordCount(editor.storage.characterCount.words())
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] w-full border border-gray-300 p-4 rounded-md focus:outline-none",
      },
    },
  })

  return (
    <div className="max-w-xl mx-auto mt-10">
      <MenuBar editor={editor}/>
      <EditorContent editor={editor} />
      <div className="mt-2 text-sm text-gray-600">
        Characters: {charCount} / 5000 — Words: {wordCount}
      </div>
    </div>
  )
}
