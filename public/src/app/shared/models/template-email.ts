export function forgotPassword(user) {
  const mailMessage = `
  <h3>Bonjour ${user.nom} ${user.prenom}.</h3>
  Cliquez sur le lien suivant pour réinitialiser votre mot de passe : <br/>
  <a href="http://localhost:4200/compte/init-password/${user.email}">Réinitialiser le mot de passe.</a>
  `;
  return mailMessage;
}
