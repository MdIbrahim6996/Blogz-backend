const { generateToken } = require("../config/generateToken");
const { resetPasswordHtml } = require("../constants/resetPasswordHtml");
const { verifyAccountHtml } = require("../constants/verifyAccountHtml");
const User = require("../models/userModel");
const crypto = require("crypto");

const SibApiV3Sdk = require("sib-api-v3-sdk");

let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

exports.register = async (req, res, next) => {
  const { email } = req?.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      throw new Error("User already exists. Try another email!");
    }
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User does not exist. Register First!");
    }

    if (user?.isBlocked) {
      throw new Error("Your account has been blocked !!!");
    }

    if (user && (await user.isPasswordMatched(password))) {
      const responseUser = user?._doc;
      return res.json({ ...responseUser, token: generateToken(user?._id) });
    }
    res.status(401);
    throw new Error("Invalid Login Credentials");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.logout = async (req, res) => {
  try {
    res.send("logout");
  } catch (error) {}
};

///////////////////////////////////////////////////////////
//                FORGOT PASSWORD
///////////////////////////////////////////////////////////

exports.generateResetPasswordToken = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User Not Found");
    const resetToken = await user.createPasswordResetToken();
    await user.save();

    const link = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;

    sendSmtpEmail.subject = "{{params.subject}}";
    sendSmtpEmail.htmlContent = resetPasswordHtml;
    sendSmtpEmail.sender = {
      name: "Blog App CEO",
      email: "blogappceo@gmail.com",
    };
    sendSmtpEmail.to = [{ name: user?.firstName, email: user?.email }];

    sendSmtpEmail.params = {
      subject: "Reset Password",
      link,
    };

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.send(resetToken);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  try {
    const userFound = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!userFound) throw new Error("Token Expired");
    if (!password) throw new Error("Password is required");

    userFound.passwordResetToken = undefined;
    userFound.passwordResetExpires = undefined;
    userFound.password = password;
    await userFound.save();
    res.json(userFound);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

///////////////////////////////////////////////////////////
//                ACCOUNT VERIFICATION
///////////////////////////////////////////////////////////
exports.generateVerificationToken = async (req, res, next) => {
  const loginUserId = req.user.id;

  try {
    const user = await User.findById(loginUserId);
    const verificationToken = await user.createAccountVerificationToken();
    await user.save();

    console.log(verificationToken);
    const link = `${process.env.CLIENT_URL}/auth/verify-account/${verificationToken}`;

    sendSmtpEmail.subject = "{{params.subject}}";
    sendSmtpEmail.htmlContent = verifyAccountHtml;
    sendSmtpEmail.sender = {
      name: "Blog App CEO",
      email: "blogappceo@gmail.com",
    };
    sendSmtpEmail.to = [{ name: user?.firstName, email: user?.email }];

    sendSmtpEmail.params = {
      subject: "Account Verification",
      link,
    };

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.send(verificationToken);
  } catch (error) {}
};

exports.accountVerification = async (req, res, next) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  try {
    const userFound = await User.findOne({
      accountVerificationToken: hashedToken,
      accountVerificationTokenExpires: { $gt: new Date() },
    });

    if (!userFound) throw new Error("Token Expired");

    userFound.accountVerificationToken = undefined;
    userFound.accountVerificationTokenExpires = undefined;
    userFound.isAccountVerified = true;
    await userFound.save();
    res.json(userFound);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
