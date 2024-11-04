import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynHandler} from "../utils/asynHandler.js"


const healthcheck = asynHandler(async (req, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message
})

export {
    healthcheck
    }
    