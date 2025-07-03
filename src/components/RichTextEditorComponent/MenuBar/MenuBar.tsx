type MenuBarProps = {
  editor: any;
};

export const MenuBar = ({ editor }: MenuBarProps) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`px-3 py-1 border rounded ${
          editor.isActive('bold') ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
        }`}
      >
        Bold
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`px-3 py-1 border rounded ${
          editor.isActive('italic') ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
        }`}
      >
        Italic
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-3 py-1 border rounded ${
          editor.isActive('heading', { level: 2 })
            ? 'bg-blue-500 text-white'
            : 'hover:bg-gray-200'
        }`}
      >
        H2
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-3 py-1 border rounded ${
          editor.isActive('heading', { level: 3 })
            ? 'bg-blue-500 text-white'
            : 'hover:bg-gray-200'
        }`}
      >
        H3
      </button>
    </div>
  );
};
