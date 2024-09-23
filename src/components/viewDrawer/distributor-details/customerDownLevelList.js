import { useContext } from "react";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Context from "../../../context/Context";
import CustomerFilters from "./customerFilters";
import CustomerDetailCard from "./customerDetailCard";
import { useDispatch, useSelector } from "react-redux";
import SearchInput from "../../search-bar/searchInput";
import noDataIcon from "../../../assets/globle/no-results.svg";
import { customerDistributor as customerDistributorAPI } from "../../../redux/action/customerAction";
import InfiniteScrollWrapper from "../../infinite-scroll-wrapper/infiniteScrollWrapper";
import { BASE_URL_V2, org_id } from "../../../config";

export default function CustomerDownLevelList({ data }) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const customerLevel = data?.customer_level
    ? "LEVEL-" +
      (Number(data?.customer_level[data?.customer_level?.length - 1]) + 1)
    : "";

  const initialFilters = {
    sort_by: "name",
    sort_order: "ASC",
    staff_id: "",
    customer_type: "",
  };

  const [search, setSearch] = useState();
  const [filters, setFilters] = useState(initialFilters);

  // useEffect(() => {
  //   data.id &&
  //     dispatch(
  //       customerDistributorAPI(
  //         customerLevel,
  //         1,
  //         filters.staff_id || 0,
  //         data?.id,
  //         search,
  //         filters.sort_by || "name",
  //         filters.sort_order || "ASC",
  //         filters.customer_type,
  //         true
  //       )
  //     );
  // }, [data?.id, filters, search]);

  useEffect(() => {
    if (
      state.deleteCustomer.data &&
      !state.deleteCustomer.data.data.error &&
      !state?.deleteCustomer?.data?.params?.check_children
    ) {
      dispatch(customerDistributorAPI(customerLevel, "", 0, data?.id, true));
    }
  }, [state]);

  useEffect(() => {
    if (data?.id) {
      setSearch();
    }
  }, [data?.id]);

  return (
    <div className={styles.flex_col}>
      <SearchInput
        defaultQuery={false}
        searchValue={(data) =>
          setTimeout(() => {
            setSearch(data);
          }, 500)
        }
        value={search}
      />
      <CustomerFilters
        selectedValue={(data) => {
          setFilters({
            sort_by: data.sortBy,
            sort_order: data.sortOrder,
            staff_id: data.staff_id || "",
            customer_type: data.customerTypeList.join(","),
          });
        }}
      />
      <InfiniteScrollWrapper
        apiUrl={`${BASE_URL_V2}/organization/${org_id}/customer/?customer_level=${customerLevel}&page_no=1&staff_id=${
          filters.staff_id
        }&customer_parent_id=${data?.id}&name=${search || ""}&sort_by=${
          filters.sort_by || "name"
        }&sort_order=${filters.sort_order || "ASC"}&customer_type=${
          filters.customer_type
        }&dd=true`}
        height={480}
      >
        {(customerList) => (
          <CustomerDetailCard
            key={customerList?.id}
            data={customerList}
            isCustomerClient={true}
            hideActionButton={true}
          />
        )}
      </InfiniteScrollWrapper>
    </div>
  );
}
