import styles from "../staff.module.css";
import { BASE_URL_V1, BASE_URL_V2, org_id } from "../../../config";
import SingleSelectSearch from "../../../components/selectSearch/singleSelectSearch";

export function SelectStaffRole({ onChange, value }) {
  return (
    <SingleSelectSearch
      apiUrl={`${BASE_URL_V1}/RBAC/${org_id}/role/?dd=true`}
      onChange={(data) => onChange && onChange(data?.name ? [data?.name] : [])}
      value={value[0]}
      params={{
        placeholder: "Search Staff Roles",
      }}
    />
  );
}

export function SelectReportingManager({ onChange, value }) {
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id") || 0;

  return (
    <SingleSelectSearch
      apiUrl={`${BASE_URL_V2}/organization/${org_id}/staff/?dd=true&get_assignable_managers=${
        id ? id : ""
      }`}
      onChange={(data) =>
        onChange && onChange({ id: data?.id, name: data?.name })
      }
      value={value?.name}
      params={{ placeholder: "Search Reporting Manager" }}
    />
  );
}

export function ToggleButton({ onChange, value }) {
  return (
    <div className={styles.auto_assign}>
      <div>Auto Assign New Customers</div>
      <div
        className={`custom-toggle-container ${value ? "active" : ""}`}
        onClick={() => onChange && onChange(!value)}
      >
        <div className={`custom-toggle-track ${value ? "active" : ""}`}>
          <div className={`custom-toggle-thumb ${value ? "active" : ""}`} />
        </div>
      </div>
    </div>
  );
}
