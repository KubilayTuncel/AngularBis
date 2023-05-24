import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {KeycloakService} from "keycloak-angular";
import {UsvService} from "../../../services/usv.service";
import {DateTimeService} from "../../../services/date-time-services/date-time.service";
import {GetSystemConfigService} from "../../../services/host-system-info-services/get-system-config.service";
import {GetNtpServerService} from "../../../services/ntp-server-services/get-ntp-server.service";
import {UpdateService} from "../../../services/update-services/update.service";
import {TranslocoService} from "@ngneat/transloco";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ntpServerModel} from "./ntp.server.model";
import {ToastrService} from "ngx-toastr";
import {usvModel} from "./usv.model";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../../dialog/confirm-dialog/confirm-dialog.component";
import {UserService} from "../../../core/user/user.service";
import {systemInfoModel} from "../sms/systemInfo.model";
import * as timezonesList from 'timezones-list';
import {DashboardComponent} from "../dashboard/dasboard.component";


@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss']
})
export class SettingComponent {
    actualDate : Date = new Date();
    systemInfo = new systemInfoModel();
    myTimezone = "";
    selectedTimeZone: string;
    updateCheck: any;
    location: string;
    timezones = timezonesList.default;
    versionNumber: string =this.dashboard_ts.versionNumber;
    dateAndTimeForm: FormGroup;
    ntpForm: FormGroup;
    systemConfigForm: FormGroup;
    upsForm: FormGroup;
    getNtpServerModel = new ntpServerModel();
    saveNtpServerModel = new ntpServerModel();
    getUsvData = new usvModel();
    saveUsvData = new usvModel();
    isAdmin: boolean = this.userService.isAdmin();

    constructor(public getNtpServerService: GetNtpServerService,
                public getSystemConfigService: GetSystemConfigService,
                private translocoService:TranslocoService,
                private toastrService:ToastrService,
                private dateTimeService: DateTimeService,
                private keycloak: KeycloakService,
                private router: Router,
                private updateService: UpdateService,
                private usvService: UsvService,
                private dialog: MatDialog,
                public userService: UserService,
                private dashboard_ts: DashboardComponent
    ) {
        this.myTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    ngOnInit() {

        this.dateAndTimeForm = new FormGroup({
            'date': new FormControl(null,[Validators.required]),
            'time' : new FormControl(null, Validators.required)
        });

        this.ntpForm = new FormGroup({
            'ntpServer': new FormControl(null, [Validators.required, Validators.pattern(/^[A-Za-z0-9._-]+$/)]),
            'timeZone': new FormControl(this.selectedTimeZone, [Validators.required])
        });

        this.systemConfigForm = new FormGroup({
            'location': new FormControl(null, [Validators.required])
        });

        this.upsForm = new FormGroup({
            'upsCode': new FormControl(null, [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)])
        });

        this.getNtpServer();
        this.getSystemInfo();
        this.getUsv();

        if (this.keycloak.isTokenExpired()) {
            this.router.navigateByUrl('/');
        };
    }

    saveDateAndTime() {
        const formattedTime = this.formatTime();
        const formattedDate = this.formatDate();

        this.dateTimeService.saveDateandTime(formattedDate,formattedTime).subscribe({
            next: next => {
                this.toastrService.success(this.translocoService.translate('setting.date-time.save.success'))
            },
            error: error => {
                if (error.status === 404) {
                    this.toastrService.error(this.translocoService.translate('setting.date-time.save.error'));
                } else if (error.status === 403) {
                    this.toastrService.error(this.translocoService.translate('setting.date-time.save.forbidden'));
                } else if (error.status === 400) {
                    this.toastrService.error(this.translocoService.translate('setting.date-time.save.bad-request'));
                } else if (error.status === 500) {
                    this.toastrService.error(this.translocoService.translate('setting.date-time.save.internal-server-error'));
                } else {
                    this.toastrService.error(this.translocoService.translate('setting.date-time.save.error'));
                }
            }
        });
    }

    private formatTime() {

        let time = this.dateAndTimeForm.value.time

        if (!time) {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            time = `${hours}:${minutes}`;

        }
        if (time.length == 7) {
            time = time.toString().substring(0, 4) + ":00";
        }
        else{
            time = time.toString().substring(0, 5) + ":00";
        }

        const formattedTime = time.length === 7 ? "0" + time : time;

        return formattedTime;
    }

    private formatDate() {
        const date = this.dateAndTimeForm.value.date;
        const options: Intl.DateTimeFormatOptions = { month: '2-digit', day: '2-digit', year: 'numeric' };
        let formattedDateString = date.toLocaleDateString('en-US',options);

        formattedDateString = formattedDateString.replace(formattedDateString.charAt(2),'-')
        formattedDateString = formattedDateString.replace(formattedDateString.charAt(5),'-')
        return formattedDateString;
    }

    private getNtpServer() {
        this.getNtpServerService.getNtp().subscribe({
            next:(ntpServer)=>{
                this.getNtpServerModel = ntpServer;
                this.setNtpAndTimeZone(this.getNtpServerModel);
            },
            error:(error)=>{
                if (error.status === 404) {
                    this.toastrService.error(this.translocoService.translate('setting.ntp.ntp-server.load.error'));
                } else if (error.status === 500) {
                    this.toastrService.error(this.translocoService.translate('setting.ntp.ntp-server.load.internal-server-error'));
                } else {
                    this.toastrService.error(this.translocoService.translate('setting.ntp.ntp-server.load.error'));
                }
                this.getNtpServerModel = null;
            }
        })
    }

    private setNtpAndTimeZone(ntpServer: ntpServerModel) {
        this.ntpForm.controls['ntpServer'].setValue(ntpServer.ntpServerUrl)
        this.ntpForm.controls['timeZone'].setValue(ntpServer.timezone)
    }

    saveNtpServer() {
        this.saveNtpServerModel.ntpServerUrl = this.ntpForm.value.ntpServer.trim();
        this.saveNtpServerModel.timezone = this.ntpForm.value.timeZone;
        this.getNtpServerService.saveNtpServer(this.saveNtpServerModel).subscribe({
            next: () => {
                this.toastrService.success(this.translocoService.translate('setting.ntp.ntp-server.create.success'))
            },
            error:error=>{
                if (error.status === 404) {
                    this.toastrService.error(this.translocoService.translate('setting.ntp.ntp-server.create.error'));
                } else if (error.status === 409) {
                    this.toastrService.error(this.translocoService.translate('setting.ntp.ntp-server.create.error-conflict'));
                } else if (error.status === 403) {
                    this.toastrService.error(this.translocoService.translate('setting.ntp.ntp-server.create.forbidden'));
                } else if (error.status === 400) {
                    this.toastrService.error(this.translocoService.translate('setting.ntp.ntp-server.create.bad-request'));
                } else if (error.status === 500) {
                    this.toastrService.error(this.translocoService.translate('setting.ntp.ntp-server.create.internal-server-error'));
                } else {
                    this.toastrService.error(this.translocoService.translate('setting.ntp.ntp-server.create.error'));
                }
            }
        });
    }

    private getSystemInfo() {
        this.getSystemConfigService.getSysInfo().subscribe({
            next:res=> {
                this.systemInfo = res
                this.systemConfigForm.controls['location'].setValue(this.systemInfo.location);
            },
            error:error => {
                if (error.status === 404) {
                    this.toastrService.error(this.translocoService.translate('setting.system-config.system-info.load.error'));
                } else if (error.status === 500) {
                    this.toastrService.error(this.translocoService.translate('setting.system-config.system-info.load.internal-server-error'));
                } else {
                    this.toastrService.error(this.translocoService.translate('setting.system-config.system-info.load.error'));
                }
            }});
    }

    saveHostInfo() {
        this.systemInfo.location = this.systemConfigForm.value.location.trim()
        this.getSystemConfigService.putSysInfo(this.systemInfo).subscribe({
            next:() => {
                this.toastrService.success(this.translocoService.translate('setting.system-config.location.save.success'))
            },
            error:error =>{
                if (error.status === 404) {
                    this.toastrService.error(this.translocoService.translate('setting.system-config.location.save.error'));
                } else if (error.status === 403) {
                    this.toastrService.error(this.translocoService.translate('setting.system-config.location.save.forbidden'));
                } else if (error.status === 400) {
                    this.toastrService.error(this.translocoService.translate('setting.system-config.location.save.bad-request'));
                } else if (error.status === 500) {
                    this.toastrService.error(this.translocoService.translate('setting.system-config.location.save.internal-server-error'));
                } else {
                    this.toastrService.error(this.translocoService.translate('setting.system-config.location.save.error'));
                }
            }
        });
    }

    updateHostInfo() {
        this.getSystemConfigService.getSysSync().subscribe({
            next:()=>{
                this.toastrService.success(this.translocoService.translate('setting.system-config.system-info.update.success'))
                this.getSystemConfigService.getSysInfo();
            },
            error:error =>{
                if (error.status === 404) {
                    this.toastrService.error(this.translocoService.translate('setting.system-config.system-info.update.error'));
                } else if (error.status === 500) {
                    this.toastrService.error(this.translocoService.translate('setting.system-config.system-info.update.internal-server-error'));
                } else {
                    this.toastrService.error(this.translocoService.translate('setting.system-config.system-info.update.error'));
                }
            }
        });
    }

    getUsv() {
        this.usvService.getUsv().subscribe(
            {
                next: (usvData)=>{
                    this.getUsvData = usvData
                    this.upsForm.controls['upsCode'].setValue(usvData.usvCode);
                },
                error:error=>{
                    if (error.status === 404) {
                        this.toastrService.error(this.translocoService.translate('setting.ups.ups-code.load.error'));
                    } else if (error.status === 500) {
                        this.toastrService.error(this.translocoService.translate('setting.ups.ups-code.load.internal-server-error'));
                    } else {
                        this.toastrService.error(this.translocoService.translate('setting.ups.ups-code.load.error'));
                    }
                    this.getUsvData = null;
                }
            });
    }

    saveUsv() {
        this.saveUsvData.usvCode = this.upsForm.value.upsCode.trim()
        this.usvService.putUsv(this.saveUsvData).subscribe({
            next:()=>{
                this.toastrService.success(this.translocoService.translate('setting.ups.ups-code.save.success'))
            },
            error:error=>{
                if (error.status === 404) {
                    this.toastrService.error(this.translocoService.translate('setting.ups.ups-code.save.error'));
                } else if (error.status === 409) {
                    this.toastrService.error(this.translocoService.translate('setting.ups.ups-code.save.error-conflict'));
                } else if (error.status === 403) {
                    this.toastrService.error(this.translocoService.translate('setting.ups.ups-code.save.forbidden'));
                } else if (error.status === 400) {
                    this.toastrService.error(this.translocoService.translate('setting.ups.ups-code.save.bad-request'));
                } else if (error.status === 500) {
                    this.toastrService.error(this.translocoService.translate('setting.ups.ups-code.save.internal-server-error'));
                } else {
                    this.toastrService.error(this.translocoService.translate('setting.ups.ups-code.save.error'));
                }
            }
        });
    }

    deleteUsv(id) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent,
            {
                data:{
                    title: 'setting.ups.ups-code.dialog.confirm.title',
                    message: 'setting.ups.ups-code.dialog.confirm.message',
                    confirm: 'setting.ups.ups-code.dialog.confirm.confirm'
                }
            });
        dialogRef.afterClosed().subscribe((result)=>{
            if (result){
                this.executeDeleteUsvCode(id)
            }
        })
    }

    executeDeleteUsvCode(id){
        this.usvService.deleteUsv(id).subscribe({
            next:()=>{
                this.toastrService.success(this.translocoService.translate('setting.ups.ups-code.delete.success'))
            },
            error:error=>{
                if (error.status === 403) {
                    this.toastrService.error(this.translocoService.translate('setting.ups.ups-code.delete.forbidden'));
                } else if (error.status === 404) {
                    this.toastrService.error(this.translocoService.translate('setting.ups.ups-code.delete.not-found'));
                } else if (error.status === 500) {
                    this.toastrService.error(this.translocoService.translate('setting.ups.ups-code.delete.internal-server-error'));
                } else {
                    this.toastrService.error(this.translocoService.translate('setting.ups.ups-code.delete.error'));
                }
            }
        })
    }
    softwareUpdate() {
        this.updateService.checkUpdate().subscribe({
            next: res => this.updateCheck = res,
            error:error=>{
                if (error.status === 404) {
                    this.toastrService.error(this.translocoService.translate('setting.software-update.error.update-error'));
                } else if (error.status === 500) {
                    this.toastrService.error(this.translocoService.translate('setting.software-update.error.internal-server-error'));
                } else {
                    this.toastrService.error(this.translocoService.translate('setting.software-update.error.update-error'));
                }
            }
        })
    }

    public hasDateFieldErrorRequired(): boolean {
        return this.dateAndTimeForm.controls['date'].hasError('required');
    }

    public hasTimeFieldErrorRequired(): boolean {
        return this.dateAndTimeForm.controls['time'].hasError('required');
    }

    public hasNtpServerFieldErrorRequired(): boolean {
        return  this.ntpForm.controls['ntpServer'].hasError('required');
    }

    public hasNtpServerFieldErrorPattern(): boolean {
        return  this.ntpForm.controls['ntpServer'].hasError('pattern');
    }

    public hasTimeZoneFieldErrorRequired(): boolean {
        return this.ntpForm.controls['timeZone'].hasError('required');
    }

    public hasLocationFieldErrorRequired(): boolean {
        return this.systemConfigForm.controls['location'].hasError('required');
    }

    public hasUpsCodeFieldErrorRequired(): boolean {
        return this.upsForm.controls['upsCode'].hasError('required');
    }

    public hasUpsCodeFieldErrorPattern(): boolean {
        return this.upsForm.controls['upsCode'].hasError('pattern');
    }

}
