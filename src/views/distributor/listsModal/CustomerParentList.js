import { Modal } from "antd";
import { useContext } from "react";
import Context from "../../../context/Context";
import WrapText from "../../../components/wrapText";
import { BASE_URL_V2, org_id } from "../../../config";
import filterService from "../../../services/filter-service";
import customerIcon from "../../../assets/distributor/customer-img.svg";
import InfiniteScrollWrapper from "../../../components/infinite-scroll-wrapper/infiniteScrollWrapper";

export default function CustomerParentList({ data, setOpenParentDetailList }) {
  const context = useContext(Context);
  const { setOpenDistributorDrawer, setCustomerDrawerFilters } = context;

  return (
    <Modal
      key={`open-${data.id}`}
      open={data?.id}
      onCancel={() => setOpenParentDetailList({})}
      title={
        <div style={{ padding: "1em", textAlign: "center" }}>{data?.title}</div>
      }
      footer={null}
      style={{ fontFamily: "Poppins" }}
      width={600}
      centered
    >
      <div style={{ height: "60vh", paddingTop: "1em" }}>
        <InfiniteScrollWrapper
          apiUrl={`${BASE_URL_V2}/organization/${org_id}/customer/${data?.id}/mapping/parents/?selected=true&ignore_mapping=true&customer_level=${data?.level}`}
          height="60vh"
          filterBy="selected"
        >
          {(item) => (
            <div
              style={styles.customer_name_conatiner}
              onClick={() => {
                filterService.setFilters({ id: item.id });
                setOpenDistributorDrawer(true);
                setCustomerDrawerFilters({
                  activeTab: "insights",
                });
              }}
            >
              <img
                src={item?.logo_image_url || customerIcon}
                alt={item.name}
                style={styles.img_container}
              />
              <WrapText width={350}>{item.name}</WrapText>
            </div>
          )}
        </InfiniteScrollWrapper>
      </div>
    </Modal>
  );
}

const styles = {
  customer_name_conatiner: {
    gap: ".5em",
    display: "flex",
    alignItems: "center",
    padding: "0 1.5em 1em",
    borderBottom: "1px solid #FFFFFF",
    cursor: "pointer",
    color: "#727176",
    fontWeight: 600,
  },
  img_container: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
};
