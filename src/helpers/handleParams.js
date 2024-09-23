
export default function handleParams(
  searchParams,
  setSearchParams,
  addParams,
  removeParams = []
) {
  if (addParams === "") addParams = {};

  // current search params list
  let paramsList = {},
  existingParams = {};
  if (searchParams.size > 0) {
    for (const [key, value] of searchParams.entries()) {
      paramsList = { ...paramsList, [key]: value };
      existingParams = { ...existingParams, [key]: value };
    }
  }

  //append addParams
  if (getLength(addParams) > 0) {
    for (const [key, value] of Object.entries(addParams)) {
      if (getLength(paramsList) > 0 && existingParams[key] && !value)
        delete paramsList[key];
      if (value) paramsList = { ...paramsList, [key]: value };
    }
  }

  // for delete all the search params if exist
  if (getLength(paramsList) > 0 && removeParams[0] === "all") {
    let pageNo;
    if (paramsList["page"]) {
      pageNo = { page: paramsList["page"] };
      paramsList = pageNo;
      return;
    }
    paramsList = {};
  }

  // for removing removeParams
  if (getLength(paramsList) > 0 && removeParams.length > 0) {
    removeParams?.map((ele) => paramsList[ele] && delete paramsList[ele]);
  }

  //update params
  if (
    (existingParams["query"] && addParams["query"] === "") ||
    getLength(paramsList) !== getLength(existingParams)
  ) {
    setSearchParams(paramsList);
    return;
  }
  for (const key in paramsList) {
    if (paramsList[key] !== existingParams[key]) {
      setSearchParams(paramsList);
      return;
    }
  }
}

const getLength = (obj) => {
  return Object.keys(obj).length;
};
