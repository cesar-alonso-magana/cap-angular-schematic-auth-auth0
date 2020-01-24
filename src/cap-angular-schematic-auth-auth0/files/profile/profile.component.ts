import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormControl, Validators, } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileUserForm: FormGroup;
  userUpdated: boolean;
  user: any;
  errorUpdate: boolean;
  verifiedUser: boolean;
  emailSend: boolean;
  errorEmailSend: boolean;
  validatedForm: boolean;
  userId: string;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.userId = localStorage.getItem('User') ? JSON.parse(localStorage.getItem('User')).id : this.router.navigate(['/']);
    }
    this.userUpdated = false;
    this.errorUpdate = false;
    this.verifiedUser = false;
    this.emailSend = false;
    this.errorEmailSend = false;
    this.validatedForm = false;
  }

  ngOnInit() {
    this.getProfile();
  }

  emailToVerifySent() {
    this.authenticationService.getAuth0Token().subscribe((token: string) => {
      this.authenticationService.verifyEmail(this.userId, token).subscribe((status: any) => {
        if (status) {
          this.emailSend = true;
        }
      }, (error => this.errorEmailSend = true));
    });
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  getProfile() {
    this.authenticationService.getAuth0Token().subscribe((token: string) => {
      this.authenticationService.getUser(this.userId, token).subscribe((user: any) => {
        if (user && user.email_verified) {
          this.user = user;
          this.profileUserForm = new FormGroup({
            'name': new FormControl(user.name, [Validators.required]),
            'family_name': new FormControl(user.family_name, [Validators.required]),
            'nickname': new FormControl(user.nickname, [Validators.required]),
          });
        } else if (!user.email_verified) {
          this.verifiedUser = true;
        }
      }, (error => this.router.navigate(['/'])));
    });
  }

  editProfile() {
    if (this.profileUserForm.valid) {
      this.authenticationService.getAuth0Token().subscribe((token: string) => {
        this.authenticationService.updateProfile(this.profileUserForm.value, this.userId, token).subscribe((userUpdated: any) => {
          if (userUpdated) {
            this.user = userUpdated;
            this.userUpdated = true;
            setTimeout(() => {
              this.userUpdated = false;
            }, 3000);
          }
        }, (error => {
          this.errorUpdate = true;
          setTimeout(() => {
            this.errorUpdate = false;
          }, 3000);
        }));
      });
    } else {
      this.validatedForm = true;
    }
  }
}