import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    res.send('Hello, this is the Tutor Finder API!');
});

router.get('/health', (req, res) => {
    res.send('API is healthy');
});

export default router;