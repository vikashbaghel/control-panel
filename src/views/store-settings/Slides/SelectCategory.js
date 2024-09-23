import { BASE_URL_V1, org_id } from "../../../config";
import SingleSelectSearch from "../../../components/selectSearch/singleSelectSearch";

export default function SelectCategory({ onChange, value }) {
  return (
    <SingleSelectSearch
      apiUrl={`${BASE_URL_V1}/organization/${org_id}/category/?is_with_id=true`}
      onChange={(v) => onChange(v?.id ? { name: v?.name, id: v?.id } : null)}
      value={value?.name}
      params={{ placeholder: "Search Product Category", size: "middle" }}
    />
  );
}
