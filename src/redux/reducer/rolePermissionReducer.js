import { rolesPermission } from "../constant"

const initialState = {
  data: ""
}
export const rolePermissionReducer = (state = initialState, action) => {
  switch (action.type) {
    case rolesPermission.SET_STAFF_ROLES_PERMISSION:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
}


export const permissionReducer = (state = initialState, action) => {
  switch (action.type) {
    case rolesPermission.SET_PERMISSION:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
}


export const staffRoleAddReducer = (state = initialState, action) => {
  switch (action.type) {
    case rolesPermission.SET_STAFF_ROLE_ADD:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};


export const staffRoleEditReducer = (state = initialState, action) => {
  switch (action.type) {
    case rolesPermission.SET_STAFF_ROLE_EDIT:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};


export const staffRoleDeleteReducer = (state = initialState, action) => {
  switch (action.type) {
    case rolesPermission.SET_STAFF_ROLE_DELETE:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};