import { Form } from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function TextAreaWithFeature({ value, onChange }) {
  const customToolbar = [
    "undo",
    "redo",
    "|",
    "bold",
    "italic",
    "|",
    "bulletedList",
    "numberedList",
    "|",
    "outdent",
    "indent",
    "alignment",
  ];

  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      config={{
        toolbar: {
          items: customToolbar,
        },
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange && onChange(data);
      }}
    />
  );
}

export function Description() {
  return (
    <Form.Item label="Description" name="description">
      <TextAreaWithFeature data-testid="description-data" />
    </Form.Item>
  );
}

export function RenderHTMLString({ htmlString }) {
  return <p dangerouslySetInnerHTML={{ __html: htmlString }} />;
}
