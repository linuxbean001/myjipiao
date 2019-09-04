import * as actionTypes from '../constants/step'
export function addItem(payload) {
    return {
        type: actionTypes.STEP_ADD_ITEM,
        id: payload.id,
        payload
    }
}

export function addMultiItem(payload) {
    return {
        type: actionTypes.STEP_ADD_MULTI_ITEM,
        payload
    }
}

export function updateItem(payload) {
    return {
        type: actionTypes.STEP_UPDATE_ITEM,
        id: payload.id,
        payload
    }
}

export function updateMultiItem(payload) {
    return {
        type: actionTypes.STEP_UPDATE_MULTI_ITEM,
        payload
    }
}

export function removeItem(payload) {
    return {
        type: actionTypes.STEP_REMOVE_ITEM,
        id: payload,
    }
}

export function removeMultiItem(payload) {
    return {
        type: actionTypes.STEP_REMOVE_MULTI_ITEM,
        payload
    }
}


export function addArrayItem(payload) {
    return {
        type: actionTypes.STEP_ADD_ARRAY_ITEM,
        id: payload.id,
        payload
    }
}

export function updateArrayItem(payload) {
    return {
        type: actionTypes.STEP_UPDATE_ARRAY_ITEM,
        id: payload.id,
        payload
    }
}

export function removeArrayItem(payload) {
    return {
        type: actionTypes.STEP_REMOVE_ARRAY_ITEM,
        id: payload.id,
        payload
    }
}

export function updateArrayLength(payload) {
    return {
        type: actionTypes.STEP_UPDATE_ARRAY_LENGTH,
        id: payload.id,
        payload
    }
}

export function clearArray(payload) {
    return {
        type: actionTypes.STEP_CLEAR_ARRAY,
        id: payload,
    }
}

export function clearMultiArray(payload) {
    return {
        type: actionTypes.STEP_CLEAR_MULTI_ARRAY,
        payload,
    }
}
