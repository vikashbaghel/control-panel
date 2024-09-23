import { useState, useEffect } from "react";
import styles from "./searchInput.module.css";
import { SearchOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";

const SearchInput = ({
  searchValue,
  placeholder = "Search . . .",
  value,
  defaultQuery = true,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKey = defaultQuery ? searchParams.get("query") || "" : "";

  const [search, setSearch] = useState(searchKey || value);

  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (search === undefined) return;
    if (timer) {
      clearTimeout(timer);
    }

    const delayDebounceFn = setTimeout(() => {
      // Perform filtering logic here
      searchValue(search);
    }, 1000);

    setTimer(delayDebounceFn);
  }, [search]);
  
  useEffect(() => {
    setSearch(value);
  }, [value]);

  return (
    <label className={styles.search_bar}>
      <input
        onChange={(event) => setSearch(event.target.value)}
        placeholder={placeholder}
        value={search}
      />
      <SearchOutlined />
    </label>
  );
};

export default SearchInput;
