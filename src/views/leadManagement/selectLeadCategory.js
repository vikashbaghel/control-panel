import styles from "./lead.module.css";
import { useSelector } from "react-redux";
import Context from "../../context/Context";
import { BASE_URL_V2, org_id } from "../../config";
import Permissions from "../../helpers/permissions";
import { useContext, useEffect, useState } from "react";
import SingleSelectSearch from "../../components/selectSearch/singleSelectSearch";

export default function SelectLeadCategory({ onChange, value }) {
  const context = useContext(Context);
  const { setEditLeadCategoryViewOpen } = context;

  // const [callCategoryAgain, setCallCategoryAgain] = useState(false);
  const [singleSelectSearch, setSingleSelectSearch] = useState(false);

  const state = useSelector((state) => state);
  const { addLeadCategory } = state;

  const createLeadPermission = Permissions("CREATE_LEAD_CATEGORY");

  useEffect(() => {
    if (addLeadCategory.data && !addLeadCategory.data.data.error)
      singleSelectSearch.reset();
  }, [state]);

  return (
    <div className={styles.lead_category_input}>
      <div style={{ width: "95%" }}>
        <SingleSelectSearch
          className={styles.lead_category_input_search}
          apiUrl={`${BASE_URL_V2}/organization/${org_id}/leadcategory/`}
          onChange={(data) => onChange({ id: data?.id, name: data?.name })}
          value={value?.name}
          params={{
            placeholder: "Search Lead Category",
          }}
          setInterface={setSingleSelectSearch}
        />
      </div>

      {createLeadPermission && (
        <div
          className={styles.new_lead_category}
          style={{ width: "5%" }}
          onClick={() => setEditLeadCategoryViewOpen(true)}
        >
          New
        </div>
      )}
    </div>
  );
}
