/**
 * User class
 *
 * @export User
 * @class User
 */
export class User {
  _id?: number;
  nom?: string;
  prenom?: string;
  numTel?: string;
  email: string;
  password: string;
  validAccount?: boolean;
  adresse?: {
    rue: string,
    complementAdresse: string,
    cp: string,
    ville: string
  };
}
