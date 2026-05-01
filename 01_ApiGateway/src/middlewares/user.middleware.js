const { ClientErrorsCodes } = require("../utlis/Errors/https_codes");
const { JwtHelper } = require("../utlis/index");

class UserMiddleware {
  async verifyAdmin(req, res, next) {
    const token = req?.headers["x-access-token"];
    if (!token) {
      return res.status(ClientErrorsCodes.BAD_REQUEST).json({
        data: {},
        message: "token is missing   ",
        success: false,
      });
    }

    try {
      const token = req?.headers["x-access-token"];
      const response = await JwtHelper.verifyToken(token);

      const role = response?.data?.role;
      if (role.toLowerCase() == "admin") return next();

      return res.status(ClientErrorsCodes.UNAUTHORIZED).json({
        data: {},
        message: "You are not admin",
        success: false,
      });
    } catch (error) {
      return res.status(ClientErrorsCodes.UNAUTHORIZED).json({
        data: {},
        message: "Invalid token or failed Token expired",
        success: false,
      });
    }
  }

  async verifyUser(req, res, next) {
    const token = req?.headers["x-access-token"];
    if (!token) {
      return res.status(ClientErrorsCodes.BAD_REQUEST).json({
        data: {},
        message: "token is missing   ",
        success: false,
      });
    }

    try {
      const response = await JwtHelper.verifyToken(token);
      const role = response?.data?.role;
      console.log(" res =:  ", role);
      if (role == "CUSTOMER") {
        return next();
      }
      return res.status(ClientErrorsCodes.UNAUTHORIZED).json({
        data: {},
        message: "Invalid or Token Expired",
        success: false,
      });
    } catch (error) {
      return res.status(ClientErrorsCodes.UNAUTHORIZED).json({
        data: {},
        message: "Invalid acess token or Token expired",
        success: false,
      });
    }
  }

  async verifyToken(req, res, next) {
    const token = req?.headers["x-access-token"];
    
    if (!token) {
      return res.status(ClientErrorsCodes.BAD_REQUEST).json({
        data: {},
        message: "token is missing   ",
        success: false,
      });
    }

    return next();
   
  }
}

const userMiddlewares = new UserMiddleware();

module.exports = userMiddlewares;
