import React, {useState} from 'react';
import {
    Form,
    Modal,
    Select,
    notification
  } from "antd";
import ImageUpload from '../../../components/imageUpload/imageUpload';

const LogoSelect = (props) => {
    const [form] = Form.useForm()
    const [fileId, setFileId] = useState(null);
    
    return (
        <Modal 
            className='modal-layout'
            open={true}
            key={`modal-closed-${!form}`}
            title={
                <div style={{ textAlign: 'center' }}>
                    {"Edit Logo"}
                </div>
            }
            okText="Save"
            onCancel={props.onClose}
            onOk={form.submit}>
            <br/>
            <Form 
                form={form}
                layout='vertical'
                onFinish={()=>{
                    if (fileId) {
                        props.onFinish(fileId);
                        props.onClose();
                    }
                    else {
                        notification.error({ 
                            message: 'Image is required' 
                        });
                    }
                }}>
            </Form>
            <ImageUpload 
                default={props.default || ''}
                onChange={setFileId} />
            <br/>            
        </Modal>
    )
}


export default LogoSelect;