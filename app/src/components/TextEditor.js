import React, { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { useDispatch } from 'react-redux';
import { updateForm } from '../features/flashcardSlice';

const TextEditor = ({ value, name, formType }) => {
    // the controlled input value and the name of the input (e.g. front/ back) is passed as props

    const dispatch = useDispatch();
    const editorRef = useRef(null);
    // const log = () => {
    //   if (editorRef.current) {
    //     console.log(editorRef.current.getContent());
    //   }
    // };

    const handleChange = (content) => {
        dispatch(updateForm({formType, name, value:content }))
    }

    return (
      <>
        <Editor
                tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={value}
                init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
                value={value}
                onEditorChange={handleChange}
        />
      </>
    );
}


export default TextEditor