import { BASE_URL_V2, org_id } from "../../../config";
import SingleSelectSearch from "../../../components/selectSearch/singleSelectSearch";

export default function SelectCustomerType({ onChange, value }) {
  return (
    <SingleSelectSearch
      apiUrl={`${BASE_URL_V2}/organization/${org_id}/customer/type/`}
      onChange={(data) => onChange && onChange(data?.name)}
      value={value}
      params={{ placeholder: "Search Customer Type" }}
    />
  );
}

export function SelectPricingGroup({ onChange, value }) {
  return (
    <SingleSelectSearch
      apiUrl={`${BASE_URL_V2}/organization/${org_id}/pricing-group/?dd=true`}
      onChange={(data) =>
        onChange &&
        onChange({
          name: data?.name || null,
          id: data?.id || 0,
        })
      }
      value={value?.name}
      params={{ placeholder: "Search Pricing Group" }}
    />
  );
}

export function SelectParent({ onChange, value, apiUrl }) {
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");
  return (
    <SingleSelectSearch
      apiUrl={apiUrl}
      onChange={(data) => {
        onChange &&
          onChange({
            id: data?.id || 0,
            name: data?.name || null,
          });
      }}
      value={value?.name}
      params={{
        placeholder: `Search`,
      }}
      optionFilter={(arr) => {
        return arr.filter((ele) => ele.id !== Number(id));
      }}
    />
  );
}
