import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, Loading, LoadingController, ViewController } from 'ionic-angular';
import { AddViolationComponent } from '../../components/add-violation/add-violation';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ViolentsProvider } from '../../providers/violents/violents';
import { PrintReceiptPage } from '../print-receipt/print-receipt';
import * as KMSWIPE from 'cordova-plugin-k-mswipe';
import { ToastService } from '../../providers/toast/toast.service';
declare const KMswipe :any;

declare let require;
var parseString = require('xml2js').parseString;

declare let lmProcessPay;
declare let $;
/**
 * Generated class for the PaymentGatewayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-gateway',
  templateUrl: 'payment-gateway.html',
})
export class PaymentGatewayPage implements OnInit{

  public currenViolations;
  public charge;
  // public violenter;
  // public challanForm:FormGroup
  // violationIds: any = [];
  // loading: Loading;
  // violations: any = [];
  // files: any = [];
  paymentMethod: any;
  generatedObject: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController, 
              public alertCtrl:AlertController, 
              public fb:FormBuilder,
              // public violent:ViolentsProvider,
              // public modalCtrl:ModalController,
              // public generateCtrl:LoadingController,
              // public toastService:ToastService
  ) {
    this.currenViolations = this.navParams.get('currentViolations')
    this.generatedObject = this.navParams.get('data');
    this.charge = this.generatedObject.amount;
    // this.violenter = this.navParams.get('violenter')
    // this.files = this.navParams.get('files');
  }

  ngOnInit(){
    // this.challanForm = this.getChallanForm();
    // this.challanForm.patchValue(this.violenter);
    // this.challanForm.controls['VehicleNo'].patchValue(this.violenter.VehicleNo);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentGatewayPage');
    console.log('payment',this.navParams.get('data'));
    console.log('currentViolations',this.navParams.get('currentViolations'));
  }

  // confirm(){
    
  //   let alert = this.alertCtrl.create({
  //     title: 'Payment Gateway',
  //     subTitle: 'App will be redirected to a gateway, Click Success for successfull trnansaction page or Error for unsuccessfull transaction',
  //     buttons: [
  //       {
  //         text: 'Error',
  //         role: 'cancel',
  //         handler: () => {
  //           this.violent
  //           this.navCtrl.popTo(AddViolationComponent)
  //         }
  //       },
  //       {
  //         text: 'Success',
  //         handler: () => {
  //           this.toastService.showLoader();
  //           const formData = new FormData();
  //           Object.keys(this.challanForm.value).forEach(element => {
  //             formData.append(element,this.challanForm.value[element]);
  //           });
  //           this.files.forEach((file:any) => {
  //             formData.append('file',file);
  //           });
  //           formData.append('VehicleImageFile','abstreg');
  //           this.violent.generateChallan(formData).subscribe((response: any) => {
  //             this.toastService.hideLoader();
  //             this.challanForm.value['ChallanId'] = response.ChallanId;
  //             this.challanForm.value['ChallanDate'] = response.ChallanDate;
  //             this.challanForm.value['amount'] = this.charge;
  //             this.challanForm.value['violations'] = this.violations;
  //             this.challanForm.value['VehicleNo'] = this.violenter.VehicleNo;
  //             this.challanForm.value['VehicleClass'] = this.violenter.VehicleClass;
  //             this.challanForm.value['DutyOfficer'] = response.DutyOfficer;

  //             const violenterModal =  this.modalCtrl.create(PrintReceiptPage, {data: this.challanForm.value});
  //             violenterModal.present();
  //             this.navCtrl.popToRoot();
  //           },(error: any) => {
  //             this.toastService.hideLoader();
  //           })
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  //   // this.showLoading('Verifying Marchent..');
  //   // KMswipe.verifyMarchent({
  //   //   'userId': '8971178109',
  //   //   'pin': '123456'
  //   // }, success => {
  //   //   this.loading.dismissAll();
  //   //   this.showLoading('Marchent Verified');
  //   //   this.loading.dismissAll();
  //   //   this.showLoading('Payment Processing');
  //   //   // alert(JSON.stringify(success));
  //   //   KMswipe.pay({ 'amount': this.charge, 'mobileNumber': this.violenter.MobileNumber, 'invoiceNumber': 'abc123asd' },
  //   //     success => {
  //   //       // alert(JSON.stringify(success));
  //   //       console.log("success",success);          
  //   //       switch (success.message) {
  //   //         case KMSWIPE.WisePadConnection.DIS_CONNECTED:
  //   //         case KMSWIPE.WisePadConnection.NOT_CONNECTED:
  //   //           // show error unable to connect
  //   //           break; 
  //   //         case KMSWIPE.CardProcess.WAITING_FOR_CARD:
  //   //         case KMSWIPE.CardProcess.WAITING_FOR_SWIPE_OR_INSERT:
  //   //           this.showLoading(success.message);
  //   //           break; 
  //   //         case KMSWIPE.CardProcessResults.CANCEL_CHECK_CARD:
  //   //           this.loading.dismiss();
  //   //           this.toastService.showToast(success.message);
  //   //           break; 
  //   //         case KMSWIPE.CardProcess.PIN_ENTRY_ICC_CARD:
  //   //           this.loading.dismiss();
  //   //           this.toastService.showToast(success.message);
  //   //           break; 
  //   //         case KMSWIPE.CardProcessResults.BAD_SWIPE:
  //   //           this.toastService.showToast(success.message);
  //   //           break; 
  //   //         default:
  //   //           this.toastService.showToast(success.message);
  //   //           this.loading.dismissAll();
  //   //           break;
  //   //       }
  //   //       // this.toastService.showToast(success.message);
  //   //       // this.toastService.showToast('Payment Successfully completed');
  //   //       // this.recordSaving();
  //   //     },
  //   //     err => {
  //   //       alert(JSON.stringify(err));
  //   //       this.loading.dismiss();
  //   //     });
  //   // },
  //   // err => {
  //   //   alert(JSON.stringify(err));
  //   // });
  // }

  // recordSaving(){
  //   this.toastService.showLoader();
  //   const formData = new FormData();
  //   Object.keys(this.challanForm.value).forEach(element => {
  //     formData.append(element,this.challanForm.value[element]);
  //   });
  //   this.files.forEach((file:any) => {
  //     formData.append('file',file);
  //   });
  //   formData.append('VehicleImageFile','abstreg');
  //   this.violent.generateChallan(formData).subscribe((response: any) => {
  //     this.toastService.hideLoader();
  //     this.challanForm.value['ChallanId'] = response.ChallanId;
  //     this.challanForm.value['ChallanDate'] = response.ChallanDate;
  //     this.challanForm.value['amount'] = this.charge;
  //     this.challanForm.value['violations'] = this.violations;
  //     this.challanForm.value['VehicleNo'] = this.violenter.VehicleNo;
  //     this.challanForm.value['VehicleClass'] = this.violenter.VehicleClass;
  //     this.challanForm.value['DutyOfficer'] = response.DutyOfficer;

      // const violenterModal =  this.modalCtrl.create(PrintReceiptPage, {data: this.challanForm.value});
      // violenterModal.present();
  //     this.navCtrl.popToRoot();
  //   },(error: any) => {
  //     this.toastService.hideLoader();
  //     this.toastService.showToast(error.error);
  //   });
  // }

  // getChallanForm(){
  //   this.currenViolations.forEach(element => {
  //     this.violationIds.push(element.ViolationId);
  //     this.violations.push(element.ViolationName);
  //   });
  //   return this.fb.group({
  //     BodyType: [''],
  //     ChassisNo: [''],
  //     Colour: [''],
  //     EngNo: [''],
  //     FatherName: [''],
  //     MakerModel: [''],
  //     DlNo:[''],
  //     MobileNumber: [''],
  //     OwnerName: [''],
  //     OwnerAddress: [''],
  //     RegistrationNo: [''],
  //     VehicleNo: [''],
  //     ViolationId:[this.violationIds.toString()],
  //     UserName: ["sa"],
  //     LocationName: ["GURGAON"],
  //     GeoLocation: ["GURGAON"],
  //     PaymentTypeName: ["Net-Banking"],
  //     PaymentId : ["TXN101043252612212383"] 
  //   });
  // }

  // showLoading(msg:string){
  //   this.loading =  this.generateCtrl.create({
  //     content:msg,
  //     dismissOnPageChange:true
  //   })
  //   this.loading.present()
  // }

  confirm(){
    const response = lmProcessPay('EFKON','800081','36PVB8S8CIC2KPXEIL4JBX7U',this.generatedObject.ChallanId, this.generatedObject.VehicleNo, this.generatedObject.OwnerName, this.generatedObject.MobileNumber);
    let that = this;
    parseString(response, function(err, result){
      console.log(result);
      
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
