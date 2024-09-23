import { BASE_URL_V1, org_id } from "../../../config";
import SingleSelectSearch from "../../../components/selectSearch/singleSelectSearch";

export default function SelectProduct({ onChange, value }) {
  return (
    <SingleSelectSearch
      apiUrl={`${BASE_URL_V1}/organization/${org_id}/product/es/?is_published=true&dd=true`}
      onChange={(v) => onChange(v?.id ? { name: v?.name, id: v?.id } : null)}
      value={value?.name}
      params={{ placeholder: "Search Product Category", size: "middle" }}
    />
  );
}
