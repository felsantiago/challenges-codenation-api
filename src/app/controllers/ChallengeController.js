import CifraCesarService from '../services/ChallengeService';

class CifraCesarController {
  async challenge01(req, res) {
    const challenge01Solved = await CifraCesarService.challenge01();
    if (challenge01Solved.erro) {
      const status = challenge01Solved.data ? challenge01Solved.data.code : 400;
      return res.status(status).json(challenge01Solved);
    }

    return res.json(challenge01Solved);
  }
}

export default new CifraCesarController();
