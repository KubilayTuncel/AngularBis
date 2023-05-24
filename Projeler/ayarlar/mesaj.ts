import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {simInfoModel} from "./simInfoModel";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {TranslocoService} from "@ngneat/transloco";
import {UserService} from "../../../core/user/user.service";
import {SmsService} from "../../../services/sms-services/sms-service.service";
import { smsModel } from './sms.model';

@Component({
    selector: 'app-sms',
    templateUrl: './sms.component.html',
    styleUrls: ['./sms.component.scss']
})
export class SmsComponent implements OnInit, OnDestroy{

    private destroy$ = new Subject<void>();
    pin: string;
    puk: string;
    receivedMessages: smsModel[] = [];
    sentMessages: smsModel[] = [];
    phoneInfoModel = new simInfoModel() ;
    smsModel = new smsModel();
    smsForm: FormGroup;
    pinForm: FormGroup;
    pukForm: FormGroup;
    resetPinForm: FormGroup;
    pukIsActive=false;
    pinVerification= false;
    pukVerification= false;
    pinVerificationCount= 3;
    pukVerificationCount=10;
    isAdmin: boolean = this.userService.isAdmin();

    constructor(private smsService: SmsService,
                private toastrService: ToastrService,
                private translocoService: TranslocoService,
                public userService: UserService) {
    }

    ngOnInit() {

        this.smsForm = new FormGroup({
            'phoneNumber': new FormControl(null,[Validators.required,
                Validators.pattern(/^((\+49)|0)[1-9][0-9]{1,2}[ -]?[1-9][0-9]{2,3}[ -]?[0-9]{4}$/)]),
            'message': new FormControl(null, [Validators.maxLength(65535)]),
            'method': new FormControl(null,[Validators.required])
        });

        this.pinForm = new FormGroup({
            'pin': new FormControl(null,[Validators.required, Validators.pattern(/^\d{4}$/),
                this.pinVerificationCountError.bind(this)])
        })

        this.pukForm = new FormGroup({
            'puk': new FormControl(null, [Validators.required, Validators.pattern(/^\d{10}$/),
                this.pukVerificationCountError.bind(this)])
        })

        this.resetPinForm = new FormGroup({
            'resetPin': new FormControl(null, [Validators.required, Validators.pattern(/^\d{4}$/)]),
            'resetPinControl': new FormControl(null, [Validators.required, Validators.pattern(/^\d{4}$/)])
        }, {validators: this.resetPinControlError})

        this.getSimInfo();
        this.getSentSms();
        this.getSmsReceived();

    }

    onSubmit() {
        this.sendSms()
    }

    private sendSms() {
        this.smsModel.phoneNumber = this.smsForm.value.phoneNumber;
        this.smsModel.text = this.smsForm.value.message.trim();
        this.smsService.sendSms(this.smsModel).subscribe({
            next:() =>{
                window.location.reload()
                this.toastrService.success(this.translocoService.translate('sms.send-test-sms.message.send-success'))
            },
            error:error => {
                if (error.status === 404) {
                    this.toastrService.error(this.translocoService.translate('sms.send-test-sms.message.error.load-error'));
                } else if (error.status === 403) {
                    this.toastrService.error(this.translocoService.translate('sms.send-test-sms.message.error.forbidden'));
                } else if (error.status === 400) {
                    this.toastrService.error(this.translocoService.translate('sms.send-test-sms.message.error.bad-request'));
                } else if (error.status === 500) {
                    this.toastrService.error(this.translocoService.translate('sms.send-test-sms.message.error.internal-server-error'));
                } else {
                    this.toastrService.error(this.translocoService.translate('sms.send-test-sms.message.error.general-error'));
                }
            }
        })
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    pinControl() {
        const pinNumber = this.getPin()
        if (this.pinForm.controls['pin'].value !== pinNumber){
            this.pinVerificationCount--;
            this.pinVerificationCountError(this.pinVerificationCount)
            if (this.pinVerificationCount<=0) {
                this.pukIsActive = true;
                this.pukVerification = false;
                this.pinForm.reset();
            }
        }else {
            this.pinVerification = true
            this.smsService.activatePin(this.pin).subscribe({
                error:error => {
                    if (error.status === 500){
                        this.toastrService.error(this.translocoService.translate('sms.sms-configuration.pin-number.activate.load.internal-server-error'))
                    }else {
                        this.toastrService.error(this.translocoService.translate('sms.sms-configuration.pin-number.activate.load.error'))
                    }
                }
            });
        }
    }

    pukControl() {
        const pukNumber = this.smsService.getPuk();
        if (this.pukForm.controls['puk'].value != pukNumber){
            this.pukVerificationCount--;
            this.pukVerificationCountError(this.pukVerificationCount)
            if (this.pukVerificationCount<=0){
                this.toastrService.error(this.translocoService.translate('sms.sms-configuration.puk-number.not-enough-trail-error'))

            }
        }else {
            this.pukVerification = true;
            this.pinVerificationCount=3;
            this.pukForm.reset()
            this.smsService.activatePuk(this.puk).subscribe({
                error:error => {
                    if (error.status === 500){
                        this.toastrService.error(this.translocoService.translate('sms.sms-configuration.puk-number.activate.load.internal-server-error'))
                    }else {
                        this.toastrService.error(this.translocoService.translate('sms.sms-configuration.puk-number.activate.load.error'))
                    }
                }
            });
        }
    }

    pinDeactivatedButton() {
        this.pinVerification = false;
        this.smsService.disableSim().subscribe({
            next: next =>this.getSimInfo(),
            error:error => {
                if (error.status === 500){
                    this.toastrService.error(this.translocoService.translate('sms.sms-configuration.pin-number.deactivate.load.internal-server-error'))
                }else {
                    this.toastrService.error(this.translocoService.translate('sms.sms-configuration.pin-number.deactivate.load.error'))
                }
            }
        });
    }

    pinResetButton() {
        this.pukIsActive = false;
        this.resetPinForm.reset();
        this.pukVerificationCount = 10;
        //pinReset request
    }

    private getSimInfo() {
        this.smsService
            .getSimInfo()
            .subscribe({next: (sms) => {
                    this.phoneInfoModel =  sms
                },
                error: error => {
                    if (error.status === 500){
                        this.toastrService.error(this.translocoService.translate('sms.sms-configuration.sim-info.load.internal-server-error'))
                    }else {
                        this.toastrService.error(this.translocoService.translate('sms.sms-configuration.sim-info.load.error'))
                    }
                }})
    }

    private getPin() {
        this.smsService.getPin().subscribe({
            next: (pin)=>{this.pin = pin},
            error:(error) => {
                if (error.status === 500){
                    this.toastrService.error(this.translocoService.translate('sms.sms-configuration.pin-number.load.internal-server-error'))
                }else {
                    this.toastrService.error(this.translocoService.translate('sms.sms-configuration.pin-number.load.error'))
                }
            }
        })};

    private getSmsReceived() {
        this.smsService.getReceivedSms().subscribe({
            next: receivedMessages => this.receivedMessages = receivedMessages,
            error:error =>{
                if (error.status === 404) {
                    this.toastrService.error(this.translocoService.translate('sms.sms-history.sms-incoming.load.error'));
                } else if (error.status === 500) {
                    this.toastrService.error(this.translocoService.translate('sms.sms-history.sms-incoming.load.internal-server-error'));
                } else {
                    this.toastrService.error(this.translocoService.translate('sms.sms-history.sms-incoming.load.error'));
                }
            }
        })
    };

    private getSentSms() {
        this.smsService.getSentSms().subscribe({
            next: sentMessages=> this.sentMessages = sentMessages,
            error:error => {
                if (error.status === 404) {
                    this.toastrService.error(this.translocoService.translate('sms.sms-history.sms-outgoing.load.error'));
                } else if (error.status === 500) {
                    this.toastrService.error(this.translocoService.translate('sms.sms-history.sms-outgoing.load.internal-server-error'));
                } else {
                    this.toastrService.error(this.translocoService.translate('sms.sms-history.sms-outgoing.load.error'));
                }
            }
        });
    }

    public hasPhoneNumberFieldErrorRequired(): boolean {
        return this.smsForm.controls['phoneNumber'].hasError('required');
    }
    public hasPhoneNumberFieldErrorPattern(): boolean {
        return this.smsForm.controls['phoneNumber'].hasError('pattern');
    }

    public hasNoteFieldErrorMaxLength(): boolean {
        return this.smsForm.controls['message'].hasError('maxlength');
    }

    public hasPinFieldErrorRequired(): boolean {
        return this.pinForm.controls['pin'].hasError('required');
    }

    public hasPinFieldErrorPattern(): boolean {
        return this.pinForm.controls['pin'].hasError('pattern');
    }

    public hasPinFieldErrorValue(): boolean {
        return this.pinForm.controls['pin'].hasError('pinValueError');
    }

    pinVerificationCountError(count:number): {[s:string]:boolean} | null {
        if (count<3) {
            this.pinForm.get('pin')?.setErrors({pinValueError:true})
        }
        return null;
    }

    public hasPukFieldErrorRequired(): boolean {
        return this.pukForm.controls['puk'].hasError('required');
    }

    public hasPukFieldErrorPattern(): boolean {
        return this.pukForm.controls['puk'].hasError('pattern');
    }

    public hasPukFieldErrorValue(): boolean {
        return this.pukForm.controls['puk'].hasError('pukValueError');
    }

    pukVerificationCountError(count:number): {[s:string]:boolean} | null {
        if (0<count && count<10) {
            this.pukForm.get('puk')?.setErrors({pukValueError: true})
        }
        return null
    }

    public hasResetPinFieldErrorRequired(): boolean {
        return this.resetPinForm.controls['resetPin'].hasError('required');
    }

    public hasResetPinFieldErrorPattern(): boolean {
        return this.resetPinForm.controls['resetPin'].hasError('pattern');
    }

    public hasResetPinControlFieldErrorRequired(): boolean {
        return this.resetPinForm.controls['resetPinControl'].hasError('required');
    }

    public hasResetPinControlFieldErrorPattern(): boolean {
        return this.resetPinForm.controls['resetPinControl'].hasError('pattern');
    }

    public hasResetPinControlFieldErrorMatch(): boolean{
        return this.resetPinForm.controls['resetPinControl'].hasError('pinMatch');
    }

    resetPinControlError(control: AbstractControl): {[s:string]:boolean} | null {
        const resetPin = control.get('resetPin')?.value;
        const resetPinAgain = control.get('resetPinControl')?.value
        if (resetPinAgain !== resetPin){
            control.get('resetPinControl')?.setErrors({pinMatch: true})
        }
        return null
    }
}
