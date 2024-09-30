const { adams } = require('../Ibrahim/adams');
const { ajouterUtilisateurAvecWarnCount, getWarnCountByJID, resetWarnCountByJID, getWarningHistoryByJID } = require('../lib/warn');
const s = require("../config");

adams(
  {
    nomCom: 'warn',
    categorie: 'Group',
    description: 'Warn a user in the group',
    usage: '.warn [reason] | .warn reset'
  },
  async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, superUser, verifGroupe, verifAdmin, msgRepondu, auteurMsgRepondu } = commandeOptions;

    if (!verifGroupe) {
      repondre('This is a group command');
      return;
    }

    if (verifAdmin || superUser) {
      if (!msgRepondu) {
        repondre('Reply to a message to warn the user');
        return;
      }

      const reason = arg.join(' ');
      if (!reason || reason === '') {
        repondre('Please provide a reason for the warning');
        return;
      }

      const warnCount = await getWarnCountByJID(auteurMsgRepondu);
      const warningLimit = s.WARN_COUNT;
      const warningThreshold = s.WARN_THRESHOLD; // new feature: warning threshold

      if (warnCount >= warningThreshold) {
        await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "remove");
        repondre(`This user has reached the warning limit of ${warningThreshold} and has been kicked from the group`);
      } else {
        await ajouterUtilisateurAvecWarnCount(auteurMsgRepondu, reason);
        const newWarnCount = await getWarnCountByJID(auteurMsgRepondu);
        const remainingWarnings = warningThreshold - newWarnCount;
        repondre(`This user has been warned for ${reason}. They have ${remainingWarnings} warnings remaining before being kicked`);
      }

      // new feature: warning history
      const warningHistory = await getWarningHistoryByJID(auteurMsgRepondu);
      repondre(`Warning history: ${warningHistory.map((warning) => `#${warning.id} - ${warning.reason}`).join(', ')}`);
    } else if (arg[0] === 'reset') {
      await resetWarnCountByJID(auteurMsgRepondu);
      repondre('Warning count reset for this user');
    } else {
      repondre('Invalid command usage. Use `.warn [reason]` or `.warn reset`');
    }
  }
);