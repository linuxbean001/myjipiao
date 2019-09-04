import * as actionTypes from '../constants/options'
export function update(data) {
    return {
        type: actionTypes.OPTIONS_UPDATE,
        data
    }
}
