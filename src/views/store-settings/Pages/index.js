import React, { useState, useEffect } from "react";
import { theme, Space, Card, Button, Row, Col, notification, Spin } from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { configurationService } from "../../../redux/action/storefrontAction";
import ckEditorUploadAdapter from "../../../helpers/ckEditorUploadAdapter";

export default function Pages() {
  const [form, setForm] = useState({});

  const updateConfiguration = async (values) => {
    const response = await configurationService.update(values);
    if (response) {
      const { data, message } = response;
      if (data) {
        notification.success({ message });
      } else if (message) {
        notification.error({ message });
      }
    }
  };

  const fetchConfiguration = async () => {
    const { data } = await configurationService.fetch();
    if (data) {
      setForm(data);
    }
  };

  useEffect(() => {
    fetchConfiguration();
  }, []);

  if (!Object.keys(form).length) {
    return (
      <Space align="middle">
        <Spin />
        <div>Fetching configurations</div>
      </Space>
    );
  }

  return (
    <Space direction="vertical" style={{ flex: 1 }}>      
      {[
        { label: "Privacy Policy", name: "privacy_policy" },
        { label: "Terms & Conditions", name: "tnc_policy" },
        { label: "Delivery Policy", name: "shipping_policy" },
        { label: "Return Policy", name: "refund_policy" },
      ].map((obj, i) => (
        <Card className='card-layout' key={i}>
          <Row justify={"space-between"}>
            <Col>
              <div style={styles.subheading}>{obj.label}</div>
            </Col>
            <Col>
              <button className="button_secondary"
                style={{ float: "right" }}
                onClick={() => {
                  let fobj = {};
                  fobj[obj.name] = form[obj.name];
                  updateConfiguration(fobj);
                }}
              >
                Save
              </button>
            </Col>
          </Row>
          <br />
          <CKEditor
          
            editor={ClassicEditor}
            data={form[obj.name]}
            config={{
              mediaEmbed: {
                  previewsInData: true
              },
              image: {
                toolbar: [ 'imageTextAlternative' ]
              }
            }}
            onReady={ editor => {
              //console.log(Array.from( editor.ui.componentFactory.names() ));
              editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
                return new ckEditorUploadAdapter( loader );
              };
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              let fobj = { ...form };
              fobj[obj.name] = data;
              setForm(fobj);
            }}
          />
        </Card>
      ))}
    </Space>
  );
}

const styles = {
  heading: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 22,
    color: "#000000",
  },
  subheading: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 16,
    color: "#000000",
  },
};
