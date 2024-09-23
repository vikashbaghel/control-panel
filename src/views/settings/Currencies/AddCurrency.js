import { Col, Form, Input, Modal, Row, Select, notification } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { Currency } from "../../../redux/action/currencyAction";
import { decimalInputValidation } from "../../../helpers/regex";

const { Option } = Select;

const AddCurrency = ({ createModal, setCreateModal }) => {
  const [form] = Form.useForm();

  const [countriesList, setCountriesList] = useState([]);

  const handleCancel = (isUpdate = false) => {
    setCreateModal({ open: false, data: null, isUpdate });
    form.resetFields();
  };

  const handleSubmit = async (value) => {
    if (Number(value.conversion_rate) > 0) {
      Object.assign(value, { conversion_rate: Number(value.conversion_rate) });
      if (createModal.data) {
        await Currency.updateCurrency(createModal.data.id, value)
          .then((res) => {
            handleCancel(true);
          })
          .catch((err) => console.log(err));
        return;
      }
      await Currency.createCurrency(value)
        .then((res) => {
          handleCancel(true);
        })
        .catch((err) => console.log(err));
      return;
    }
    notification.warning({ message: "Conversion rate cannot be zero" });
  };

  const fetchCountryData = async () => {
    await Currency.fetchCountryCurrencyData().then((res) =>
      setCountriesList(res.data)
    );
  };

  useEffect(() => {
    fetchCountryData();
  }, []);

  useEffect(() => {
    createModal.data &&
      form.setFieldsValue({
        currency_code: createModal.data["currency_code"],
        conversion_rate: createModal.data["conversion_rate"],
      });
  }, [createModal.data]);

  const filterOption = (inputValue, option) =>
    option.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1;

  return (
    <div style={{ fontFamily: "Poppins" }}>
      <Modal
        open={createModal.open}
        onCancel={handleCancel}
        centered
        title={
          <div style={{ textAlign: "center", fontSize: 20, padding: "10px 0" }}>
            Add New Currency
          </div>
        }
        footer={[
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 20,
              padding: "13px 20px",
              background: "#fff",
              borderRadius: "0 0 10px 10px",
            }}
          >
            <button
              className="button_secondary"
              style={{ borderRadius: 5 }}
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="button_primary"
              style={{ borderRadius: 5 }}
              onClick={form.submit}
            >
              Save
            </button>
          </div>,
        ]}
        width={700}
      >
        <Form
          layout="vertical"
          style={{ padding: "20px 20px 0 20px" }}
          form={form}
          onFinish={handleSubmit}
        >
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Select Currency" name="currency_code">
                <Select
                  placeholder="Select Currency"
                  showSearch={true}
                  optionFilterProp="name"
                  filterOption={filterOption}
                >
                  {countriesList?.map((item, index) => {
                    return (
                      <Option
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 30,
                        }}
                        label={item.name}
                        value={item.currency_code}
                      >
                        {item.symbol}
                        &nbsp;&nbsp;&nbsp;
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={9}>
              <Form.Item
                label="Conversion Rate"
                name="conversion_rate"
                style={{ display: "flex", alignItems: "center", gap: 15 }}
              >
                <Input
                  placeholder="Enter Conversion Rate"
                  addonAfter={"INR"}
                  maxLength={9}
                  onKeyPress={decimalInputValidation}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AddCurrency;
