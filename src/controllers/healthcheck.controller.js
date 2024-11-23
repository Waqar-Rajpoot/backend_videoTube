import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynHandler } from "../utils/asynHandler.js";

const healthcheck = asynHandler(async (req, res) => {
    
  try {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Yeh! 😊 everything is okay!"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while checking the health of the server");
  }
});

export { healthcheck };
