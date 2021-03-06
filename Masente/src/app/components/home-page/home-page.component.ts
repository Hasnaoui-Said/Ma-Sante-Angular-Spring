import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AdminService} from "../../service/admin.service";
import {PatientsService} from "../../service/patient.service";
import {DoctorsService} from "../../service/doctors.service";
import {Router} from "@angular/router";
import {TraitementService} from "../../service/traitement.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  espace: string = "";
  statusMsg: string = "";
  statusLogin: boolean = false;
  openModale: boolean = false;
  frGroup?:FormGroup;
  submitted:boolean=false;
  loginAs(as :string){
    this.espace = as;
    this.statusLogin = false;
  }

  patientFormGroup?:FormGroup;
  submittedSu:boolean=false;
  signup: Boolean = false;



  onSavePatient() {
    this.submittedSu=true;
    if(this.patientFormGroup?.invalid) return;
    this.patientsService.save(this.patientFormGroup?.value).subscribe(data=>{
      alert("Patient ajouté avec succès");
    });
    this.signup = false;
  }
  constructor(private fb:FormBuilder,
              private adminService:AdminService,
              private router: Router,
              private patientsService:PatientsService,
              private traitement:TraitementService,
              private doctorsService:DoctorsService) { }

  ngOnInit(): void {
    this.patientFormGroup=this.fb.group({
      nom:["",Validators.required],
      preNom:["",Validators.required],
      dateNaissance:["",Validators.required],
      numTel:["",Validators.required],
      typeSexe:["",Validators.required],
      email:["",Validators.required],
      pswd:["",Validators.required],
    });
    this.frGroup=this.fb.group({
      email:["",Validators.required],
      pswd:["",Validators.required]
    });
    this.loginAs('Patients');
  }

  onLogin() {
    this.submitted=true;
    //if(this.adminFormGroup?.invalid) return;
    if (this.espace === 'Patients'){
      this.patientsService.searchPatient(this.frGroup?.value).subscribe(data=>{
        if(data === null) {
          sessionStorage.removeItem('connect')
          this.statusMsg = 'UserName Or Password is failed';
        }else{
          sessionStorage.setItem('connect', 'ok');
          sessionStorage.setItem('espace', 'patient');
          sessionStorage.setItem('idPatient', data.id+"");
          //this.statusMsg = 'Connect Patients '+ this.traitement.islogin();
          //this.router.navigate(['home']);
        }
        this.statusLogin = true;
      });
    }else if (this.espace === 'Admin'){
      this.adminService.searchAdmin(this.frGroup?.value).subscribe(data=>{
        if(data===null) {
          this.statusLogin = true;
          this.statusMsg = 'There was a problem with your login.';
          //window.location.href = 'http://localhost:4200/admin';
        }else {
          this.statusLogin = true;
          this.statusMsg = 'Connect Admin';
          sessionStorage.setItem('connect', 'ok');
          sessionStorage.setItem('espace', 'Admin');
          sessionStorage.setItem('id', data+"");
        }
      });
    }else if (this.espace === 'Doctor'){
      this.doctorsService.searchLoginDoctors(this.frGroup?.value).subscribe(data=>{
        if(data===null) {
          this.statusLogin = true;
          this.statusMsg = 'UserName Or Password is failed';
        }else{
          this.statusLogin = true;
          this.statusMsg = 'Connect Doctor';
          sessionStorage.setItem('connect', 'ok');
          sessionStorage.setItem('espace', 'Doctor');
          sessionStorage.setItem('idDoctor', data.id + "");
          //this.router.navigate(['home']);
        }
      });
    }
    this.isUserLoggedIn();
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem('connect')
    //console.log(!(user === null))
    this.traitement.setBol(!(user === null));

    return this.traitement.islogin();
  }

  logOut() {
    sessionStorage.removeItem('patientConnect')
  }

  open() {
    this.openModale = true;
    return this.openModale;
  }
  close() {
    this.openModale = false;
    return this.openModale;
  }

  isSignup() {
    this.signup = true;
  }
  isNotSignup() {
    this.signup = false;
  }
}
