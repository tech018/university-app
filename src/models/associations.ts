import Auth from "./auth";
import OTP from "./otp";

class Associations {
  public static associate() {
    Auth.hasMany(OTP, { foreignKey: "authId" });
    OTP.belongsTo(Auth, { foreignKey: "authId" });
  }

  static async sync() {
    try {
      this.associate();
      await Auth.sync();
      await OTP.sync();
    } catch (error) {
      console.log("erros", error);
    }
  }
}

export default Associations;
