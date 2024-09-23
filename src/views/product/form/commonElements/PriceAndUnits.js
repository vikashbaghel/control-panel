import { useState } from "react";
import { Col, Form, Input, Radio, Row, Select } from "antd";
import { decimalInputValidation } from "../../../../helpers/regex";
import SelectUnit from "../../../../components/selectUnit/selectUnit";

const gstList = [0, 0.25, 0.5, 3, 5, 12, 18, 28, 40];

export function MrpUnit() {
  const [error, setError] = useState(false);

  return (
    <Row gutter={12}>
      <Col span={12}>
        <Form.Item
          label="MRP"
          name="mrp_price"
          rules={[
            { required: true },
            {
              validator: (_, v) => {
                if (["0", 0].includes(v))
                  return Promise.reject(new Error("${label} is required"));
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            placeholder="Enter MRP"
            data-testid="MRP-Price"
            onKeyPress={(e) => decimalInputValidation(e, { decimalPlaces: 4 })}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Unit (e.g. kg, meter, piece)"
          name="mrp_unit"
          rules={[
            { required: true },
            {
              validator: (_, v) => {
                if (!v) {
                  setError(true);
                  return Promise.reject();
                }

                setError(false);

                return Promise.resolve();
              },
            },
          ]}
        >
          <SelectUnit error={error} />
        </Form.Item>
      </Col>
    </Row>
  );
}

export function BuyerPrice() {
  const [error, setError] = useState(false);

  return (
    <>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label="Buyer Price"
            name="price"
            rules={[
              { required: true },
              {
                validator: (_, v) => {
                  if (["0", 0].includes(v))
                    return Promise.reject(new Error("${label} is required"));
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              placeholder="Enter Buyer Price"
              data-testid="Buyer-Price"
              onKeyPress={(e) =>
                decimalInputValidation(e, { decimalPlaces: 4 })
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Unit (e.g. kg, meter, piece)"
            name="unit"
            rules={[
              { required: true },
              {
                validator: (_, v) => {
                  if (!v) {
                    setError(true);
                    return Promise.reject();
                  }
                  setError(false);
                  return Promise.resolve();
                },
              },
            ]}
          >
            <SelectUnit error={error} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label="GST (in %)"
            name="gst"
            rules={[{ required: true }]}
            style={{ marginBottom: 0 }}
          >
            <Select
              options={gstList.map((ele) => {
                return { label: ele, value: ele };
              })}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label=" " name="gst_exclusive">
            <Radio.Group>
              <Radio value={false}>Inclusive</Radio>
              <Radio value={true}>Exclusive</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}
