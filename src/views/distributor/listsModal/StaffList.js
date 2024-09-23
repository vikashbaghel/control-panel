import React from "react";
import { Modal } from "antd";
import InfiniteScrollWrapper from "../../../components/infinite-scroll-wrapper/infiniteScrollWrapper";
import WrapText from "../../../components/wrapText";
import { Staff } from "../../../assets/navbarImages";

const ListViewModal = ({ listModal, setListModal }) => {
  const { open, title, api, handleAction } = listModal;

  const onClose = () => {
    setListModal({ open: false, detail: {}, type: "", api: "" });
  };

  return (
    <Modal
      key={`open-${title}`}
      open={open}
      onCancel={onClose}
      title={<div style={{ padding: "1em", textAlign: "center" }}>{title}</div>}
      footer={null}
      style={{ fontFamily: "Poppins" }}
      width={600}
      centered
    >
      <InfiniteScrollWrapper apiUrl={api} height="60vh" filterBy="selected">
        {(item) => {
          console.log(item);
          return (
            <div
              style={styles.customer_name_conatiner}
              onClick={() => {
                //   filterService.setFilters({ id: item.id });
                //   setOpenDistributorDrawer(true);
                //   setCustomerDrawerFilters({
                //     activeTab: "insights",
                //   });
              }}
            >
              {title === "Staffs" && (
                <img
                  src={item?.logo_image_url || Staff}
                  alt={item.name}
                  style={styles.img_container}
                />
              )}
              <WrapText width={350}>{item.name}</WrapText>
            </div>
          );
        }}
      </InfiniteScrollWrapper>
    </Modal>
  );
};

export default ListViewModal;

const styles = {
  customer_name_conatiner: {
    gap: ".5em",
    display: "flex",
    alignItems: "center",
    padding: "0 1.5em 1em",
    borderBottom: "1px solid #FFFFFF",
    // cursor: "pointer",
    color: "#727176",
    fontWeight: 600,
  },
  img_container: {
    width: 40,
    height: 40,
    borderRadius: 50,
    background: "#fff",
  },
};
