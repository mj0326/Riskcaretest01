// export class User {
//   emailAddress: string;
//   historyId: string;
//   messagesTotal: number;
//   threadsTotal: number;
// }
export class User {
  email: string;
  'family_name': string;
  'given_name': string;
  hd: string;
  id: string;
  locale: string;
  name: string;
  picture: string;
  'verified_email': boolean;
}

export class AllUser {
    admin: boolean;
    creationTime: {value: number, dateOnly: boolean, timeZoneShift: number};
    delegatedAdmin: boolean;
    familyName: string;
    fullName: string;
    givenName: string;
    id: string;
    lastLoginTime: {value: number, dateOnly: boolean, timeZoneShift: number}
    orgUnitPath: string;
    primaryEmail: string;
    recoveryEmail: string;
    recoveryPhone: string;

    // ForUI
    emailWithName: string;
}
