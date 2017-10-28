export class RegisterUserCompte {
  _id?: number;
  nom: string;
  prenom: string;
  numTel: string;
  email: string;
  password: string;
  adresse: {
    rue: string,
    complementAdresse: string,
    cp: string,
    ville: string
  };
  validAccount?: boolean;
}
