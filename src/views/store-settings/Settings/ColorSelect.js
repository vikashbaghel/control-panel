import { useEffect, useState } from "react";
import { Table, Modal, Input, ColorPicker } from "antd";

const ColorSelect = (props) => {
  const [input, setInput] = useState("");
  const [hexFlag, setHexFlag] = useState(false);
  const [selection, setSelection] = useState("");

  useEffect(() => {
    if (input.length === 7 || input.length === 9) {
      setSelection(input);
    }
  }, [input]);

  return (
    <Modal
      open={true}
      className="modal-layout"
      title={
        <div style={{ textAlign: "center" }}>
          {props.default ? "Update" : "Add"} Colour
        </div>
      }
      okText="Save"
      onCancel={props.onClose}
      onOk={() => {
        props.onFinish(selection || props.default);
        props.onClose();
      }}
    >
      <Table
        pagination={false}
        dataSource={[{ code: props.default }]}
        columns={[
          {
            title: "Color",
            dataIndex: "code",
            render: (code) => (
              <ColorPicker
                value={selection || code}
                onChange={(c, hex) => setInput(hex)}
              />
            ),
          },
          {
            title: "Code",
            dataIndex: "code",
            render: (code) => (
              <Input
                size="middle"
                //prefix="#"
                defaultValue={code}
                placeholder={selection || code}
                maxLength={hexFlag ? 7 : undefined}
                value={input}
                onChange={(e) => {
                  let value = e.target.value.toUpperCase();
                  if (e.nativeEvent.data) {
                    if (value === "#") {
                      setHexFlag(true);
                    } else if (
                      !"0123456789ABCDEF".includes(
                        e.nativeEvent.data.toUpperCase()
                      )
                    ) {
                      return false;
                    }
                  }
                  setInput(value);
                }}
              />
            ),
          },
        ]}
      />
    </Modal>
  );
};

export default ColorSelect;
