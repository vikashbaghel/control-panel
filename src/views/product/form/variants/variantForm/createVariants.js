const constants = {
  defaultProductDetails: {
    price: 0,
    mrp_price: 0,
    description: "",
    specification: [],
    gst: 0.0,
    gst_exclusive: false,
    discount: 0,
    unit: "",
    mrp_unit: "",
    packaging_level: [],
    is_show_buyer_price: true,
    is_out_of_stock: false,
    is_published: true,
    hsn_code: "",
    video_link: "",
  },
  uniqueProductDetails: {
    code: "",
    pics: {
      imgs: [],
      default_img: {},
    },
  },
};

export class VariantData {
  constructor(options = {}) {
    this.options = {
      current: {},
      parent: {},
      default: {},
      variants: [],
      getHandler: (obj) => obj,
      ...options,
    };
  }
  validate(requiredFields) {
    return validateVariantsData(this.getAll(true), requiredFields);
  }
  getAll(identifierMap = false) {
    let obj = {};
    let arr = [];
    if (this.options.variants.length) {
      createVariantCombinations(this.options.variants, (id) => {
        if (identifierMap) {
          obj[id] = this.get(id);
        } else {
          arr.push(this.get(id));
        }
      });
    }
    return identifierMap ? obj : arr;
  }
  get(identifier) {
    if (isGroup(identifier)) {
      return this.getGroup(identifier);
    } else {
      let obj = getVariantDetails(
        this.options.default,
        { ...(this.options.parent || {}), ...this.options.current },
        identifier
      );
      this.options.current[identifier] = obj;
      return this.options.getHandler(obj);
    }
  }
  update(identifier, updatedValues) {
    this.options.current[identifier] = {
      ...this.get(identifier),
      ...updatedValues,
      identifier,
    };
  }
  getGroup(identifier) {
    return {
      identifier,
    };
  }
}

function isGroup(identifier) {
  return identifier.includes("Group-", "");
}

function getVariantDetails(defaultVariantData, currentVariantData, id) {
  let parentId = id.split("-").slice(0, -1).join("-");
  if ((defaultVariantData || {})[id]) {
    return {
      ...(defaultVariantData || {})[id],
      ...(currentVariantData[id] || currentVariantData[parentId] || {}),
      identifier: id,
    };
  }
  return {
    ...constants.defaultProductDetails,
    ...constants.uniqueProductDetails,
    ...(currentVariantData[id] || currentVariantData[parentId] || {}),
    identifier: id,
  };
}

function createVariantCombinations(
  variants,
  handler = (obj) => obj,
  Vi = 0,
  identifier = "",
  combinations = []
) {
  if (variants.length) {
    variants[Vi]["options"].map(({ option_id, name }, Oi) => {
      if (Oi === variants[Vi]["options"].length - 1 && !name) {
        return;
      } else {
        let id = identifier ? [identifier, option_id].join("-") : option_id;
        if (Vi < variants.length - 1) {
          createVariantCombinations(
            variants,
            handler,
            Vi + 1,
            id,
            combinations
          );
        } else {
          combinations.push(handler(id));
        }
      }
    });
  }
  if (!identifier) {
    return combinations;
  }
}

function validateVariantsData(variantData, requiredFields) {
  let errors = { initial: "" };
  Object.keys(variantData).map((ele, i) => {
    const missing_fields = [];
    requiredFields.map((field) => {
      if (field === "gst") {
        variantData[ele][field] ?? missing_fields.push(field);
      } else if (
        (field === "pics" && !variantData[ele][field]?.imgs?.length) ||
        (field === "packaging_level" &&
          !variantData[ele][field]?.[0]?.size &&
          !variantData[ele][field]?.[0]?.unit)
      ) {
        missing_fields.push(field);
      } else if (!variantData[ele][field]) {
        missing_fields.push(field);
      }
    });
    if (missing_fields.length) {
      if (!errors.initial) {
        errors.initial = ele;
      }
      errors = { ...errors, [ele]: { missing_fields } };
    }
  });
  return errors;
}

function getVariantGroups(
  variants,
  variantMap,
  activeFilters,
  targetVariant,
  targetOptions
) {
  let groups = [];
  let optionIndexMap = {};
  //creates groups
  targetOptions.map((option_id, index) => {
    groups.push({
      identifier: `Group-${option_id}`,
      isGroupHead: true,
      name: targetVariant.options[option_id]["name"],
      payload: targetVariant.options[option_id]["payload"] || {},
      children: [],
      children_ids: [],
    });
    optionIndexMap[option_id] = index;
    return option_id;
  });
  //creates children
  let { filterBy } = { ...activeFilters };
  createVariantCombinations(variants, (identifier) => {
    let optionMap = identifier.split("-");
    let targetOption = "";
    let contains = true;
    let name = [];
    optionMap.map((optId, Vi) => {
      let varId = variants[Vi]["variant_id"];
      //check if identifier belongs to current group
      if (targetOptions.includes(optId)) {
        targetOption = optId;
      }
      //check filters
      if ((filterBy[varId] || []).length) {
        if (!filterBy[varId].includes(optId)) {
          contains = false;
        }
      }
      //creates name for the variant combination
      if (optId !== targetOption) {
        let obj = variantMap[varId];
        name.push(obj.options[optId]?.["name"]);
      }
    });
    //push children to group
    if (targetOption && contains) {
      let groupIndex = optionIndexMap[targetOption];
      groups[groupIndex]["children_ids"].push(identifier);
      groups[groupIndex]["children"].push({
        identifier,
        isGroupHead: false,
        name: name.join(" "),
        parent_id: targetOption,
        parent_index: groupIndex,
      });
    }
  });
  return groups;
}

export function createDataSource(variants, variantMap, activeFilters) {
  let { groupBy, filterBy } = { ...activeFilters };
  if (Object.keys(variantMap).length && groupBy) {
    let superVariant = variantMap[groupBy];
    let targetOptions = [];
    //extract groups using groupby filter
    [...Object.keys(superVariant.options)].map((option_id, i) => {
      //check and remove proxy option
      if (
        i === Object.keys(superVariant.options).length - 1 &&
        !superVariant.options[option_id].name
      ) {
        return;
      }
      //check filters
      else if (
        (filterBy[superVariant.variant_id] || []).length &&
        !filterBy[superVariant.variant_id].includes(option_id)
      ) {
        return;
      } else {
        targetOptions.push(option_id);
      }
    });
    return getVariantGroups(
      variants,
      variantMap,
      activeFilters,
      superVariant,
      targetOptions
    );
  }
  return [];
}
