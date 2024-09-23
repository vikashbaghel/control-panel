import { Form, Input, Modal } from "antd";
import { regex } from "../../../components/form-elements/regex";
import { useState } from "react";
import { InfoCircleFilled } from "@ant-design/icons";

export default function VideoUrlInput() {
  const [videoAddInfo, setVideoAddInfo] = useState(false);

  return (
    <>
      <Form.Item
        label="Product Video URL"
        name="video_link"
        rules={[
          {
            validator: (_, v) => {
              if (!v || regex["youtubeUrl"].test(v)) return Promise.resolve();
              return Promise.reject(
                new Error("Please enter or paste a valid URL")
              );
            },
          },
        ]}
      >
        <Input
          placeholder="Enter Product Video URL "
          data-testid="Product-Video-URL"
        />
      </Form.Item>
      <div style={{ paddingBottom: 20 }}>
        URL Info.:{" "}
        <span
          style={styles.link}
          onClick={() => setVideoAddInfo(true)}
          data-testid="Video-url-info"
        >
          How to add product video URL
        </span>
      </div>
      <Modal
        centered
        open={videoAddInfo}
        onCancel={() => setVideoAddInfo(false)}
        title={
          <div style={{ padding: 20 }}>
            <div style={styles.title}>
              <div>
                <InfoCircleFilled />
              </div>
              How to add product video URL
            </div>

            <div style={styles.grid}>
              <div style={styles.color_faded}>Sign In to YouTube</div>
              <div>Go to Youtube and sign in with your Google account.</div>
              <div style={styles.color_faded}>Upload Your Video</div>
              <div>
                <div>
                  1. Click the camera icon with a "+" and select "Upload video."
                </div>
                <div>
                  2. Click "Publish" and copy the video link from the
                  confirmation screen.
                </div>
              </div>
              <div style={styles.color_faded}>Copy the Video URL</div>
              <div>
                Ensure the URL looks like
                https://www.youtube.com/watch?v=XXXXXXX.
              </div>
              <div style={styles.color_faded}>
                Paste the URL in the Product Form
              </div>
              <div>
                <div>1. Go to product form page on our web portal or app.</div>
                <div>
                  2. Open the product form and paste the copied YouTube link
                  into the "Video URL" field.
                </div>
              </div>
              <div style={styles.color_faded}>Save the Form</div>
              <div>
                Ensure all other necessary details are filled out and click
                "Save"
              </div>
            </div>
          </div>
        }
        footer={null}
        width={750}
      />
    </>
  );
}

const styles = {
  link: {
    color: "#322E80",
    textDecoration: "underline",
    cursor: "pointer",
  },
  title: {
    display: "flex",
    fontSize: 20,
    gap: 5,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    rowGap: 15,
    paddingTop: 20,
  },
  color_faded: {
    color: "#727176",
  },
};
