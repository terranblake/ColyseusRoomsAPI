const PlayFabClient = require('../node_modules/playfab-sdk/Scripts/PlayFab/PlayFabClient.js');
const PlayFab = require('../node_modules/playfab-sdk/Scripts/PlayFab/PlayFab.js');

const retrieveAccountInfo = async (PlayFabId, res) => {
    await PlayFabClient.GetAccountInfo({ PlayFabId }, (error, result) => {
        if (error) return res.status(400).send({ error });

        res.status(200).send({ result });
    });
}

const loginWithPlatformId = async (CustomId, res) => {
    await PlayFabClient.LoginWithCustomID({ CustomId, TitleId: process.env.PLAYFAB_TITLE_ID }, (error, result) => {
        if (error) return res.status(401).send({ error });

        res.status(200).send({
            LastLoginTime: result.data.LastLoginTime,
            SessionTicket: result.data.SessionTicket,
            PlayFabId: result.data.PlayFabId,
            EntityToken: result.data.EntityToken
        });
    })
}

export {
    retrieveAccountInfo,
    loginWithPlatformId
}