import express from "express";

import AuthControllers from "../controllers/auth.controller";

const router = express.Router();

/**
 * POST /register
 * Body: { email: string, password: string, token?: string }
 * If `token` is provided, it must match a pending invitation for that email.
 * If `token` is omitted (e.g. admin registration), handle accordingly.
 */
router.post("/register", AuthControllers.register);

//  Input : username/password via body
//  HTTP Success : 200, message and user infos.
//  HTTP Errors : 400, 401.
router.post("/login", AuthControllers.login);

//  Input : email via body.
//  HTTP Success : 200 and message.
//  HTTP Errors : 400, 404, 500, 503.
router.post("/login/forgot", AuthControllers.postLoginForgot);

//  Input : reset token via params, new password via body.
//  HTTP Success : 200 and message.
//  HTTP Errors : 400, 404, 500, 503.
router.post("/login/reset/:token", AuthControllers.postLoginReset);

//  Input : void, identified by session cookie.
//  HTTP Success : 200 and message.
//  HTTP Errors : 400, 500, 503.
router.post("/logout", AuthControllers.postLogout);

//  Input : email via body;
//  HTTP Success : 200 and message.
//  HTTP Errors : 400, 404, 500, 503.
// router.post("/send-confirmation", AuthControllers.postVerify);

// router.get("/confirmation/:token", AuthControllers.getConfirmation);

export default router;
