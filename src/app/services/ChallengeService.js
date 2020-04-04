import FormData from 'form-data';
import * as Allchallenges from './challenges';
import api from '../../services/api';

const challenges = Object.values(Allchallenges).map((challenge) => ({
  name: challenge.key,
  challenge,
}));

class ChallengeService {
  async challenge01() {
    try {
      const response = await api.get('/v1/challenge/dev-ps/generate-data', {
        params: { token: process.env.TOKEN_CODENATION },
      });

      const { data } = response;

      const { challenge } = challenges.find((c) => c.name === 'challenge01');

      const fileJson = await challenge.createJson(data);

      if (fileJson.erro) throw fileJson;

      const savedChangesToJson = await challenge.saveChangesToJson();

      const readStream = await challenge.createdReadStream();

      const formData = new FormData();
      formData.append('answer', readStream);

      const responseSendChallenge = await api.post(
        '/v1/challenge/dev-ps/submit-solution',
        formData,
        {
          params: { token: process.env.TOKEN_CODENATION },
          headers: {
            ...formData.getHeaders(),
          },
        }
      );

      const { score } = responseSendChallenge.data;

      return {
        answer: savedChangesToJson,
        score,
      };
    } catch (err) {
      if (err.response.status) {
        return { erro: true, data: err.response.data };
      }
      return err;
    }
  }
}

export default new ChallengeService();
