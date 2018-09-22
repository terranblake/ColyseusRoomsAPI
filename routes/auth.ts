import { AuthActions } from '../controllers';
import { PlayfabActions } from '../controllers';

module.exports = (express) => {
    const router = express.Router();

    router.route('/login')
        .post((req, res) => {
            console.log('POST        /login      -   login with playfab');

            PlayfabActions.loginWithPlatformId(req.body.CustomId, res);
        })

    return router;
}