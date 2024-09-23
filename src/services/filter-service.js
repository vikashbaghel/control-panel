import scrollToTop from "../helpers/scrollToTop";

const constants = {
  defaultConfig: {
    delimiter: "&",
  },
};

var filterState = {
  defaultPage: 1,
  excludePageReset: ["id", "edit_id"],
  eventListner: (obj) => {},
  config: constants.defaultConfig,
};

function _encodeFilterValue(v) {
  return encodeURIComponent(v).replace(/%2C/g, ",");
}

function setConfig(config) {
  filterState.config = {
    ...filterState.config,
    ...config,
  };
  return () => {
    filterState.config = {
      ...constants.defaultConfig,
    };
  };
}

function getFilters(search = "", delimiter = "") {
  let params = {};
  let str = (search || window.location.search).replace("?", "");
  if (str) {
    let pairs = str.split(delimiter || filterState.config.delimiter);
    pairs.map((pair) => {
      let [k, v] = pair.split("=");
      params[k] = decodeURIComponent(v);
    });
  }
  return params;
}

function setFilters(params) {
  let updatedFilters = {};
  let activeFilters = getFilters();
  let pageResetFlag = true;
  Object.keys(params).map((k) => {
    if (`${params[k]}` !== activeFilters[k]) {
      updatedFilters[k] = params[k];
    }
    if (filterState.excludePageReset.includes(k)) {
      pageResetFlag = false;
    }
  });
  if (Object.keys(updatedFilters).length) {
    let searchParams = {
      ...activeFilters,
      ...(pageResetFlag ? { page: 1 } : {}),
      ...updatedFilters,
    };
    let pairs = [];
    Object.keys(searchParams).map((k) => {
      if (searchParams[k]) {
        pairs.push([k, _encodeFilterValue(searchParams[k])].join("="));
      }
    });

    // manage default page
    if (pairs.length === 1 && searchParams.page) {
      if (params.page) {
        filterState.defaultPage = params.page;
      } else {
        pairs = [`page=${filterState.defaultPage}`];
      }
    }

    let str = "?" + pairs.join(filterState.config.delimiter);
    let { origin, pathname, search } = window.location;
    let href = origin + pathname + str;
    window.history.replaceState({}, "", href);
    filterState.eventListner(getFilters(str));
    if (pageResetFlag) {
      scrollToTop();
    }
  }
}

function setEventListener(callback) {
  filterState.eventListner = callback;
}

const filterService = {
  getFilters,
  setFilters,
  setEventListener,
  setConfig,
};

export default filterService;
