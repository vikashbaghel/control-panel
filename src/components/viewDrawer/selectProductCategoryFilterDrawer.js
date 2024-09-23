import React, { useContext, useEffect, useState } from "react";
import { Drawer, List } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL_V1, org_id } from "../../config.js";
import Context from "../../context/Context";
import { useDispatch } from "react-redux";
import VirtualList from "rc-virtual-list";
import { searchProduct } from "../../redux/action/productAction";
import Cookies from "universal-cookie";

const ProductCategorySelect = () => {
  const context = useContext(Context);
  const dispatch = useDispatch();
  const {
    productCategorySelect,
    setProductCategorySelect,
    productCategorySelectOpen,
    setProductCategorySelectOpen,
    selectFilterValue,
    setSelectFilterValue,
  } = context;
  const [pageNo, setPageNo] = useState(1);
  const cookies = new Cookies();

  const appendData = () => {
    const url = `${BASE_URL_V1}/organization/${org_id}/category/?page_no=${Number(
      pageNo
    )}`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    axios.get(url, { headers }).then((response) => {
      setProductCategorySelectOpen(
        productCategorySelectOpen.concat(response.data.data)
      );
      setPageNo(pageNo + 1);
    });
  };
  useEffect(() => {
    appendData();
  }, []);

  // const onScroll = (e) => {
  //   if (
  //     e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
  //     ContainerHeight
  //   ) {
  //     appendData();
  //   }
  // };

  const onClose = () => {
    setProductCategorySelect(false);
  };

  // const ContainerHeight = 550;

  const onSelectCategory = (value) => {
    let apiData = {
      category: value,
      customer_id: window.localStorage.getItem("rupyzDistributorId"),
      page_no: 1,
    };
    dispatch(searchProduct(apiData));
  };

  useEffect(() => {
    dispatch(searchProduct("", "", selectFilterValue));
  }, [selectFilterValue]);

  return (
    <>
      <Drawer
        title={
          <>
            <CloseOutlined onClick={onClose} />
            &nbsp;&nbsp;&nbsp; Select Product Category
          </>
        }
        width={520}
        closable={false}
        onClose={onClose}
        open={productCategorySelect}
        // style={{ overflowY: "auto" }}
      >
        <div>
          <List>
            <VirtualList
              data={productCategorySelectOpen}
              // height={ContainerHeight}
              itemHeight={0}
              itemKey="email"
              // onScroll={onScroll}
            >
              {(ele) => (
                // <List.Item key={ele.id} style={{ padding: "0" }}>
                <List.Item key={ele.name} style={{ padding: "0" }}>
                  <List.Item.Meta
                    avatar={<></>}
                    title={
                      <>
                        <a
                          onClick={() => {
                            onSelectCategory(ele.name);
                            setSelectFilterValue(ele.name);
                            setProductCategorySelect(false);
                          }}
                        >
                          {ele.name}
                        </a>
                      </>
                    }
                  />
                </List.Item>
              )}
            </VirtualList>
          </List>
        </div>
      </Drawer>
    </>
  );
};

export default ProductCategorySelect;

const contentStyle = {
  margin: "auto ",
  height: "300px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
  alignItems: "center",
};
