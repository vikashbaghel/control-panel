import Context from "../../context/Context";
import { useContext, useEffect } from "react";
import styles from "./pagination.module.css";
import { useSearchParams } from "react-router-dom";
import handleParams from "../../helpers/handleParams";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import scrollToTop from "../../helpers/scrollToTop";

const Pagination = ({ list, search = false, toRemove = [] }) => {
  list = list || [];

  const context = useContext(Context);
  const { setLoading } = context;

  const [searchParams, setSearchParams] = useSearchParams();
  const pageNo = Number(searchParams.get("page")) || 1;
  const searchPageNo = Number(searchParams.get("search_page")) || 1;

  const handlePrevPage = () => {
    setLoading(true);

    if (search) {
      handleParams(
        searchParams,
        setSearchParams,
        {
          search_page: searchPageNo - 1,
        },
        toRemove
      );
      return;
    }
    handleParams(searchParams, setSearchParams, { page: pageNo - 1 }, toRemove);
  };

  const handleNextPage = () => {
    if (list.length !== 30) return;

    setLoading(true);
    if (search) {
      handleParams(
        searchParams,
        setSearchParams,
        {
          search_page: searchPageNo + 1,
        },
        toRemove
      );

      return;
    }
    handleParams(searchParams, setSearchParams, { page: pageNo + 1 }, toRemove);
  };

  useEffect(() => {
    if (searchParams.size > 0) {
      handleParams(searchParams, setSearchParams, "", "");
    }
    scrollToTop();
  }, [pageNo, searchPageNo]);

  useEffect(() => {
    if (search) {
      handleParams(searchParams, setSearchParams, {
        search_page: searchPageNo,
      });
      return;
    }
    if (searchParams.get("search_page")) {
      handleParams(searchParams, setSearchParams, "", ["search_page"]);
    }
  }, [search]);

  return (
    <div className={styles.pagination_container}>
      <button
        onClick={handlePrevPage}
        disabled={
          search && searchPageNo === 1
            ? true
            : !search && pageNo === 1
            ? true
            : false
        }
      >
        <CaretLeftOutlined />
      </button>
      Page {search ? searchPageNo : pageNo}
      <button onClick={handleNextPage} disabled={list?.length < 30}>
        <CaretRightOutlined />
      </button>
    </div>
  );
};

export default Pagination;
