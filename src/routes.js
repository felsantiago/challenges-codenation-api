import { Router } from 'express';

import ChallengeController from './app/controllers/ChallengeController';

const routes = new Router();

routes.get('/', ChallengeController.challenge01);

export default routes;
