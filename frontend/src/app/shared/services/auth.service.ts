import {Injectable} from '@angular/core';
import {AbstractService} from '@shared/services/abstract.service';

export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService extends AbstractService {
    //
    // private readonly AUTH_API_URL = `${environment.host}/auth`;
    // private readonly OAUTH2_API_URL = `${environment.host}/oauth2`;
    //
    // public userData: any;
    // public user: firebase.User;
    // public showLoader = false;
    //
    // constructor(public afs: AngularFirestore,
    //             public afAuth: AngularFireAuth,
    //             public router: Router,
    //             public ngZone: NgZone,
    //             public toster: ToastrService,
    //             protected injector: Injector) {
    //     super(injector);
    //
    //     this.afAuth.authState.subscribe(user => {
    //         if (user) {
    //             this.userData = user;
    //             this.cookieService.set('user', JSON.stringify(this.userData));
    //             localStorage.setItem('user', JSON.stringify(this.userData));
    //             JSON.parse(localStorage.getItem('user'));
    //         } else {
    //             localStorage.setItem('user', null);
    //             JSON.parse(localStorage.getItem('user'));
    //         }
    //     });
    // }
    //
    // // tslint:disable-next-line:contextual-lifecycle
    // public ngOnInit(): void {
    // }
    //
    // get isLoggedIn(): boolean {
    //     const user = JSON.parse(localStorage.getItem('user'));
    //     return (user != null && user.emailVerified !== false);
    // }
    //
    // /**
    //  *  로그인 체크
    //  */
    // public checkLogin(): Observable<any> {
    //     const options = new HttpOptions();
    //     // return this.get(`${this.AUTH_API_URL}/aa`, null);
    //     return this.get(`${this.AUTH_API_URL}/authentication`);
    // }
    //
    //
    // /**
    //  * 인증 폐기
    //  */
    // public invalidAuth(): Observable<any> {
    //     return this.get(`${this.AUTH_API_URL}/invalidate`);
    // }

    // sign in function
    // public SignIn(email, password): Promise<any> {
    //   return this.afAuth.auth.signInWithEmailAndPassword(email, password)
    //     .then((result) => {
    //       if (result.user.emailVerified !== true) {
    //         this.SetUserData(result.user);
    //         this.SendVerificationMail();
    //         this.showLoader = true;
    //       } else {
    //         this.showLoader = false;
    //         this.ngZone.run(() => {
    //           this.router.navigate(['/auth/login']);
    //         });
    //       }
    //     }).catch((error) => {
    //       this.toster.error('You have enter Wrong Email or Password.');
    //     });
    // }

    // main verification function
    // public SendVerificationMail(): Promise<any> {
    //   return this.afAuth.auth.currentUser.sendEmailVerification()
    //     .then(() => {
    //       this.router.navigate(['/dashboard/default']);
    //     });
    // }

    // Sign in with Facebook
    // signInFacebok() {
    //   return this.AuthLogin(new auth.FacebookAuthProvider());
    // }

    // Sign in with Twitter
    // signInTwitter() {
    //   return this.AuthLogin(new auth.TwitterAuthProvider());
    // }

    // Sign in with Google
    // GoogleAuth() {
    //   return this.AuthLogin(new auth.GoogleAuthProvider());
    // }

    // ForgotPassword(passwordResetEmail) {
    //   return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
    //     .then(() => {
    //       window.alert('Password reset email sent, check your inbox.');
    //     }).catch((error) => {
    //       window.alert(error);
    //     });
    // }

    // Authentication for Login
    // AuthLogin(provider) {
    //   return this.afAuth.auth.signInWithPopup(provider)
    //     .then((result) => {
    //       this.ngZone.run(() => {
    //         this.router.navigate(['/dashboard/default']);
    //       });
    //       this.SetUserData(result.user);
    //     }).catch((error) => {
    //       window.alert(error);
    //     });
    // }

    // Set user
    // SetUserData(user) {
    //   const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    //   const userData: User = {
    //     email: user.email,
    //     displayName: user.displayName,
    //     uid: user.uid,
    //     photoURL: user.photoURL || 'assets/dashboeard/boy-2.png',
    //     emailVerified: user.emailVerified
    //   };
    //   userRef.delete().then(() => {
    //   })
    //     .catch((error) => {
    //     });
    //   return userRef.set(userData, {
    //     merge: true
    //   });
    // }

    // Sign out
    // SignOut() {
    //   this.router.routeReuseStrategy.shouldReuseRoute = () => {
    //     return false;
    //   };
    //   return this.afAuth.auth.signOut().then(() => {
    //     this.showLoader = false;
    //     localStorage.clear();
    //     this.cookieService.deleteAll('user', '/auth/login');
    //     this.router.navigate(['/auth/login']);
    //   });
    // }

}
