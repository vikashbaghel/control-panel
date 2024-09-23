import { useEffect, useState } from "react";
import { Table, Modal, Input, Select, ColorPicker } from "antd";

const ColorForm = (props) => {
  const [input, setInput] = useState("");
  const [hexFlag, setHexFlag] = useState(false);
  const colorTypes = [
    { label: "Primary", value: "primary_color" },
    { label: "Secondary", value: "secondary_color" },
  ];
  const [selection, setSelection] = useState("");
  const [colorType, setColorType] = useState("primary_color");

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
          {props.values[colorType] ? "Update" : "Add"} Colour
        </div>
      }
      okText="Save"
      onCancel={props.onClose}
      onOk={() => {
        let obj = {};
        obj[colorType] = selection || props.values[colorType];
        props.onFinish(obj);
        props.onClose();
      }}
    >
      <Table
        pagination={false}
        dataSource={[
          {
            code: props.values[colorType],
          },
        ]}
        columns={[
          {
            title: "Color",
            dataIndex: "code",
            render: (code) => (
              <ColorPicker
                value={selection || code}
                onChange={(c, hex) => setInput(hex)}
              />
              /*
                            <div style={{
                                height: 46, 
                                width: 46,
                                borderRadius: 10,                                
                                backgroundColor: `${selection || code}`
                            }} />
                            */
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
          {
            title: "Select",
            dataIndex: "type",
            render: (type) => (
              <Select
                size="middle"
                options={colorTypes}
                value={colorType}
                onChange={setColorType}
              />
            ),
          },
        ]}
      />
    </Modal>
  );
};

export default ColorForm;
