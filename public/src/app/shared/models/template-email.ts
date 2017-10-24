import { User } from './User';

export function forgotPassword(user: User) {
  const mailMessage = `
  <h3>Bonjour ${user.nom} ${user.prenom}.</h3>
  Cliquez sur le lien suivant pour réinitialiser votre mot de passe : <br/>
  <a href="http://localhost:4200/compte/init-password/${user._id}">Réinitialiser le mot de passe.</a>
  `;
  return mailMessage;
}

export function validateAccount(user: User) {
  const mailMessage = `
  <h3>Bonjour ${user.nom} ${user.prenom}.</h3>
  Merci de vous être enregistrer sur #NOM APPLI#. <br/>
  Plus qu'une étape avant d'utiliser votre compte. <br/> <br/>
  Cliquez sur le lien suivant pour valider votre compte :
  <a href="http://localhost:4200/compte-valide/${user._id}">Validation du compte.</a>
  `;
  return mailMessage;
}
