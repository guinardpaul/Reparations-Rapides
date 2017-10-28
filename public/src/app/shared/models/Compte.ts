export class Compte {
  _id?: number;
  nom?: string;
  prenom?: string;
  numTel?: string;
  email: string;
  adresse?: {
    rue: string,
    complementAdresse: string,
    cp: string,
    ville: string
  };
}
