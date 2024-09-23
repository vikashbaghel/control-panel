import { Form } from "antd";
import {
  ProductImageUploader,
  uploadImage,
} from "../../../../components/image-uploader/ImageUploader";


export default function ProductImageUpload() {
  return (
    <Form.Item label="Images" 
      name="pics"
      initialValue={{ 
        imgs: [], 
        default_img: {} 
      }} 
      rules={[
        { 
          required: true,
          validator: (_, value)=>{
            if (!((value || {}).imgs || []).length) {
              return Promise.reject("Image is required");
            }
            else return Promise.resolve();
          }
        }
      ]}>
      <Upload />
    </Form.Item>
  );
}

const Upload = ({ onChange, value }) => {
  return (
    <ProductImageUploader
      value={value}
      maxCount={6}
      onChange={(v) =>
        onChange({
          ...value,
          ...(v?.id || v?.uid ? { default_img: v } : { imgs: v }),
        })
      }
    />
  );
};

export const handleImages = async (pics = {}) => {
  if (!pics?.imgs?.length) return {};

  let oldImageList = (pics?.imgs || []).filter((data) => data.id);
  let newImageList = (pics?.imgs || []).filter((data) => !data.id);

  let pics_map = [...(oldImageList || [])];
  let pics_ids = (oldImageList || [])?.map((ele) => ele.id);
  let display_pic_map = pics?.default_img?.id? pics?.default_img : {};
  let display_pic = pics?.default_img?.id || -1;

  if (newImageList.length) {
    const response = await uploadImage(newImageList, ['id','url']) || [];
    if (response.length) {
      if (display_pic === -1) {
        (newImageList || []).map((item, index) => {
          if (item.uid === pics?.default_img?.uid) {
            display_pic_map = response[index];
            display_pic = display_pic_map.id;
          }
        });
      }
      pics_map = [...pics_map, ...response];
      pics_ids = pics_map?.map((ele) => ele?.id);
    }
  }
  //handle absence of display pic
  if (display_pic === -1) {
    if (pics_map.length) {
      display_pic_map = pics_map[0];
      display_pic = display_pic_map.id;
    }
  }

  return {
    pics: pics_ids,
    pics_map,
    display_pic,
    display_pic_map
  };
};
