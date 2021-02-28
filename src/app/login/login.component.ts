import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;
  registerFormGroup: FormGroup;
  register= false;
  constructor(private builder: FormBuilder, public auth: AuthService, private http: HttpClient, private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.formGroup = this.builder.group(
      {
        email: [
          '', [Validators.required]
        ],
        password: [
          '', [Validators.required]
        ]
      }
    )

    this.registerFormGroup = this.builder.group(
      {
        email: [
          '', [Validators.required]
        ],
        firstName: [
          '', [Validators.required]
        ],
        lastName: [
          '', [Validators.required]
        ],
        password: [
          '', [Validators.required]
        ],
        city: [
          '', [Validators.required]
        ],
        address: [
          '', [Validators.required]
        ],
        phone: [
          '', [Validators.required]
        ]
      }
    )

    if (!!localStorage.getItem("login")) {
      this.auth.email = localStorage.getItem("login");
      this.auth.loggedIn.next(true);
    }
  }
  logout() {
      localStorage.removeItem("login");
        this.auth.loggedIn.next(false);
        this.auth.email = null;
  }
  Register() {
    const formData = new FormData();
    formData.set("email", this.registerFormGroup.value['email']);
    formData.set("password", this.registerFormGroup.value['password']);
    formData.set("lastName", this.registerFormGroup.value['lastName']);
    formData.set("firstName", this.registerFormGroup.value['firstName']);
    formData.set("address1", this.registerFormGroup.value['address']);
    formData.set("city", this.registerFormGroup.value['city']);
    formData.set("phone", this.registerFormGroup.value['phone']);
    this.http.post(
      "http://localhost:5000/register",
      formData
    )
    .subscribe(
      n => {
        this.snackBar.open("با موفقیت ثبت نام شدید", "بستن", {
          direction: 'rtl'
        } );

        localStorage.setItem("login", this.registerFormGroup.value['email']);
        this.auth.loggedIn.next(true);
        this.auth.email = this.registerFormGroup.value['email'];
      }, e => {
      this.snackBar.open("حطا دوباره تلاش کنید", "بستن", {
          direction: 'rtl'
        } )
      }
    )
  }

  login () {
    const formData = new FormData();
    formData.set("email", this.formGroup.value['email']);
    formData.set("password", this.formGroup.value['password']);
    this.http.post(
      "http://localhost:5000/login",
      formData
    )
    .subscribe(
      n => {
        this.snackBar.open("با موفقیت وارد شدید", "بستن", {
          direction: 'rtl'
        } );

        localStorage.setItem("login", this.formGroup.value['email']);
        this.auth.loggedIn.next(true);
        this.auth.email = this.formGroup.value['email'];
      }, e => {
      this.snackBar.open("حطا دوباره تلاش کنید", "بستن", {
          direction: 'rtl'
        } )
      }
    )
  }

}
