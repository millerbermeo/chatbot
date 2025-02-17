import express from "express";
import webHookController from "../controllers/web-hook.controller";

const router = express.Router()

router.post('/webhook', webHookController.handleIncoming)
router.get('/webhook', webHookController.verifyWebHook)

export default router