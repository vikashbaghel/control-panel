import { preferences } from "../constant"

const initialState={
    data:""
}
export const preferencesReducer=(state = initialState, action)=> {
    switch(action.type) {
            case preferences.GET_PREFERENCES:
                return { ...state, data: action.payload };
          
              default:
                return { ...state };
    }
}


export const staffPreferencesReducer=(state = initialState, action)=> {
    switch(action.type) {
            case preferences.GET_STAFF_PREFERENCES:
                return { ...state, data: action.payload };
          
              default:
                return { ...state };
    }
}


export const staffAddPreferencesReducer=(state = initialState, action)=> {
    switch(action.type) {
            case preferences.ADD_STAFF_PREFERENCES:
                return { ...state, data: action.payload };
          
              default:
                return { ...state };
    }
}
