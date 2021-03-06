import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ViolentsProvider } from '../../providers/violents/violents';
import { PaymentGatewayPage } from '../../pages/payment-gateway/payment-gateway';
import { SeizePage } from '../../pages/seize/seize';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastService } from '../../providers/toast/toast.service';
import { PrintReceiptPage } from '../../pages/print-receipt/print-receipt';

/**
 * Generated class for the AddViolationComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'add-violation',
  templateUrl: 'add-violation.html'
})
export class AddViolationComponent {

  text: string;
  totalCharge:number = 0.0;
  violenter;
  violentOpts: { title: string, subTitle: string };
  currentViolents:any[] = [];
  violentsList:any = [];
  violationIds: any = [];
  violations: any = [];
  loading: Loading;
  public challanForm:FormGroup
  cameraOptions: CameraOptions = {
    sourceType         : this.camera.PictureSourceType.CAMERA,
    destinationType    : this.camera.DestinationType.DATA_URL,
    encodingType       : this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  };
  imageUrls: any = [];
  files: any = [];


  constructor(public violent:ViolentsProvider,
              public navCtrl:NavController,
              public navParam:NavParams,
              private camera: Camera,
              public alertCtrl: AlertController,
              public toastService:ToastService,
              public fb:FormBuilder
  ) {
    // this.showLoading()
    this.toastService.showLoader('Loading Violations...')
    this.violent.getViolents().subscribe(response => {
      this.toastService.hideLoader();
      this.violentsList = response;
    }, error => {
      this.toastService.hideLoader();
    });
  }

  ionViewDidLoad() {
    this.violenter = this.navParam.get('data');        
  }

  getChallanForm(){
    this.currentViolents.forEach(element => {
      this.violationIds.push(element.ViolationId);
      this.violations.push(element.ViolationName);
    });
    return this.fb.group({
      BodyType: [''],
      ChassisNo: [''],
      Colour: [''],
      EngNo: [''],
      FatherName: [''],
      MakerModel: [''],
      DlNo:[''],
      MobileNumber: [''],
      OwnerName: [''],
      OwnerAddress: [''],
      RegistrationNo: [''],
      VehicleNo: [''],
      ViolationId:[this.violationIds.toString()],
      UserName: ["sa"],
      LocationName: ["GURGAON"],
      GeoLocation: ["GURGAON"],
      PaymentTypeName: ["Net-Banking"],
      PaymentId : ["TXN101043252612212383"] 
    });
  }

  subTotal(){
    let repeatedViolents = [];
    let createdDate:any = 0;
    let currentDate:any = 0; 
    let miliseconds:any = 0;  
    let h:any;
    if(this.violenter.PastViolations&&this.violenter.PastViolations.length)
    repeatedViolents = this.currentViolents.filter(element => {
      return this.violenter.PastViolations.findIndex(violent => {
        createdDate = new Date(violent.CreatedDate);
        currentDate = new Date();
        miliseconds = currentDate.getTime() - createdDate.getTime();
        h = ((miliseconds/1000)/60)/60;
        return (element.ViolationId === violent.ViolationId && h<=24);
      })>-1;
    });
    if(repeatedViolents.length){
      let repeatedViolentNames:string = '';
      repeatedViolents.forEach((element:any,index:number) => {
        repeatedViolentNames += index+1 + '. ' + element.ViolationName + "\n";
        this.currentViolents.splice(this.currentViolents.indexOf(element),1);
      });
      this.showError(repeatedViolentNames);
    }
    for(let i=0;i<this.currentViolents.length;i++){
      this.totalCharge += Number(this.currentViolents[i].ViolationFine);
    }
  }

  payment(){
      this.navCtrl.push(PaymentGatewayPage, { data: this.currentViolents, charge:this.totalCharge, violenter: this.violenter, files:this.files })
  }

  generateChallan(){
    this.challanForm = this.getChallanForm();
    this.challanForm.patchValue(this.violenter);
    this.challanForm.controls['VehicleNo'].patchValue(this.violenter.VehicleNo);
    this.toastService.showLoader();
    const formData = new FormData();
    Object.keys(this.challanForm.value).forEach(element => {
      formData.append(element,this.challanForm.value[element]);
    });
    this.files.forEach((file:any) => {
      formData.append('file',file);
    });
    formData.append('VehicleImageFile','abstreg');
    this.violent.generateChallan(formData).subscribe((response: any) => {
      this.toastService.hideLoader();
      this.challanForm.value['ChallanId'] = response.ChallanId;
      this.challanForm.value['ChallanDate'] = response.ChallanDate;
      this.challanForm.value['amount'] = this.totalCharge;
      this.challanForm.value['violations'] = this.violations;
      this.challanForm.value['VehicleNo'] = this.violenter.VehicleNo;
      this.challanForm.value['VehicleClass'] = this.violenter.VehicleClass;
      this.challanForm.value['DutyOfficer'] = response.DutyOfficer;
      this.navCtrl.push(PrintReceiptPage, {data: this.challanForm.value, currentViolents: this.currentViolents});
      // const violenterModal =  this.modalCtrl.create(PrintReceiptPage, {data: this.challanForm.value});
      // violenterModal.present();
      // this.navCtrl.popToRoot();
    },(error: any) => {
      this.toastService.hideLoader();
    })
  }

  seize(){
    this.navCtrl.push(SeizePage, { data: this.currentViolents, charge:this.totalCharge, violenter: this.violenter });
  }

  private capture(){
    this.camera.getPicture(this.cameraOptions).then((onSuccess)=>{
      this.imageUrls.push('data:image/jpeg;base64,' + onSuccess);
      const fileName:string = 'img'+new Date().toISOString().substring(0,10)+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.jpeg'; 
      this.files.push(this.dataURLtoFile('data:image/jpeg;base64,' + onSuccess,fileName));
      console.log(this.files);
      
    },(onError)=>{
      alert(onError);
    })
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  delImage(index:number){
    this.imageUrls.splice(index,1);
    this.files.splice(index,1);
  }

  showError(message){
    const alert = this.alertCtrl.create({
      title: 'Repeated Violation(s)',
      subTitle: message,
      buttons: ['OK']
    })
    alert.present();
  }

}
