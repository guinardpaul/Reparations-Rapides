import { Compte } from './Compte';


/**
 * Forgot password template
 *
 * @param {Compte} compte compte Object
 * @returns {string} mail message
 */
export function forgotPassword(compte: Compte): string {
  const mailMessage = `
  <h3>Bonjour ${compte.nom} ${compte.prenom}.</h3>
  Cliquez sur le lien suivant pour réinitialiser votre mot de passe : <br/>
  <a href="http://localhost:4200/compte/init-password/${compte._id}">Réinitialiser le mot de passe.</a>
  `;
  return mailMessage;
}


/**
 * Validate account template
 *
 * @param {Compte} compte compte object
 * @returns {string} mail message
 */
export function validateAccount(compte: Compte): string {
  const mailMessage = `
  <h3>Bonjour ${compte.nom} ${compte.prenom}.</h3>
  Merci de vous être enregistrer sur #NOM APPLI#. <br/>
  Plus qu'une étape avant d'utiliser votre compte. <br/> <br/>
  Cliquez sur le lien suivant pour valider votre compte :
  <a href="http://localhost:4200/compte-valide/${compte._id}">Validation du compte.</a>
  `;
  return mailMessage;
}
