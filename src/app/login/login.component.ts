import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertService } from '../_services/alert.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any ={
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage='';
  roles: string[] = [];
  loading = false; // control login button only click once
  submitted = false;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private alertService: AlertService) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()){
      this.isLoggedIn=true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }
  onSubmit(): void{
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if(this.form.invalid){
      return;
    }

    this.loading = true;
    const {username,  password } = this.form;
    this.authService.login(username, password).subscribe({
      next: data=>{
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed=false;
        this.isLoggedIn=true;
        this.roles=this.tokenStorage.getUser().roles;
        this.reloadPage(); 
      },
      error: err=>{
        this.alertService.error(err);
        this.errorMessage=err.errorMessage;
        this.isLoginFailed=true;
        this.loading = false;
      }
    });
  }
  
  reloadPage(): void{
    window.location.reload();
  }

}
