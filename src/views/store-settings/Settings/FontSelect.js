import React, {useState} from 'react';
import {
    Modal,
    Form,    
    Input,
    Select,
    Slider,
    Divider
  } from "antd";
import fonts from './fonts.json';


const FontSelect = (props) => {
    const [selection, setSelection] = useState(props.values['font'] || 'Poppins');
    const [font_size, set_font_size] = useState(14);
    return (
        <Modal open={true}
            className='modal-layout'
            title={
                <div style={{ textAlign: 'center' }}>
                    {"Select Font Style"}
                </div>
            }
            okText="Save"
            onCancel={props.onClose}
            onOk={()=>{
                props.onFinish({ 'font': selection });
                props.onClose();
            }}>
            <Form layout='vertical'>
                <Form.Item>
                    <Select size="middle"
                        showSearch
                        options={[
                            ...fonts.map((font)=>(
                                {
                                    key: `${font}`,
                                    value: `${font}`, 
                                    label: <div key={`${font}`} style={{fontFamily: `${font}`}}>{`${font}`}</div>
                                }
                            ))
                        ]}
                        value={selection}
                        onChange={setSelection} 
                        
                        />
                </Form.Item>
            </Form>     
            <br/>
            <Input.TextArea
                style={{
                    fontSize: font_size,
                    fontFamily: selection
                }}                
                value={"The quick brown fox jumps over the lazy dog.\n\n"}
                readOnly
                autoSize
                />
            <Slider min={12} max={20}
                tooltip={{ formatter: (value) => `${value} px` }}
                value={font_size}
                onChange={set_font_size}
                 />
        </Modal>
    )
}


export default FontSelect;