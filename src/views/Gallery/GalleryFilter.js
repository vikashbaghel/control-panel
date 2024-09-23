import { Col, Collapse } from "antd";
import { stateList } from "../../generic/list/stateList";
import "./galleryStyles.css";
import FilterScroll from "./infinitescroll";
import { BASE_URL_V2, org_id } from "../../config";
import { CaretDownOutlined } from "@ant-design/icons";

export const staticActivityTypes = ["Order", "Payment"];

const galleryFilter = ({ value, onChange }) => {
  const items = [
    {
      key: 1,
      label: (
        <>
          Activity Type
          <CaretDownOutlined style={{ color: "#727176" }} />
        </>
      ),
      children: (
        <Col>
          <FilterScroll
            allowSearch={false}
            apiUrl={`${BASE_URL_V2}/organization/${org_id}/activity/followup/?dd=true`}
            dataFilter={(arr) => {
              return arr.concat(
                staticActivityTypes.map((name) => ({ name, id: -1 }))
              );
            }}
            selectBy="name"
            onSelect={(values, selectAll = false) => {
              onChange({
                sub_module_type: values.join(","),
                all_activities: selectAll,
              });
            }}
            value={
              value?.sub_module_type ? value?.sub_module_type?.split(",") : []
            }
          />
        </Col>
      ),
    },
    {
      key: 2,
      label: (
        <>
          State
          <CaretDownOutlined style={{ color: "#727176" }} />
        </>
      ),
      children: (
        <FilterScroll
          dataList={stateList}
          selectBy="value"
          onSelect={(state) => {
            onChange({ state: state.join(",") });
          }}
          value={value?.state?.split(",")}
        />
      ),
    },
    {
      key: 3,
      label: (
        <>
          Customer
          <CaretDownOutlined style={{ color: "#727176" }} />
        </>
      ),
      children: (
        <FilterScroll
          apiUrl={`${BASE_URL_V2}/organization/${org_id}/customer/?dd=true`}
          selectBy="id"
          onSelect={(customer_ids) => {
            onChange({ customer_ids: customer_ids.join(",") });
          }}
          value={value?.customer_ids?.split(",")}
          img={true}
        />
      ),
    },
    {
      key: 4,
      label: (
        <>
          Staff
          <CaretDownOutlined style={{ color: "#727176" }} />
        </>
      ),
      children: (
        <FilterScroll
          apiUrl={`${BASE_URL_V2}/organization/${org_id}/staff/?dd=true`}
          selectBy="user_id"
          onSelect={(user_ids) => {
            onChange({ user_ids: user_ids.join(",") });
          }}
          value={value?.user_ids?.split(",")}
          img={true}
        />
      ),
    },
  ];

  return (
    <div className="gallery-filter">
      <Collapse accordion items={items} className="picture-sorting" />
    </div>
  );
};

export default galleryFilter;
