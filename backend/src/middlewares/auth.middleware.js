import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";



export const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
     const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
 
     if(!token){
       throw new ApiError(401, "Unauthorized Access ")
     }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user =   await User.findById(decodedToken?._id).select("-password -refreshToken");
 
        if(!user) {
           throw new ApiError(401, "Invalid access token ");
        }
 
        req.user = user; 
        next();

    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid access token ")
    }
    
})

export const requireAdmin = (...roles) => {
  const allowed = roles.length ? roles : ['admin'];
  return asyncHandler(async (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.role)) {
      throw new ApiError(403, 'Forbidden: insufficient role');
    }
    next();
  });
};

