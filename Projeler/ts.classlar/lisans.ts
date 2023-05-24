import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../core/user/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslocoService} from '@ngneat/transloco';
import {ToastrService} from 'ngx-toastr';
import {LicenseService} from '../license.service';
import {Mandator} from '../../mandator/mandator.model';
import {Module} from '../../module/module.modul';
import {KeyPair} from '../../key-pair/key-pair.model';
import {DateAdapter} from '@angular/material/core';
import {filter, Observable} from 'rxjs';
import {License} from '../license.model';
import {LicenseToSave} from '../license-to-save.model';
import {MandatorService} from '../../mandator/mandator.service';
import {KeyPairService} from '../../key-pair/key-pair.service';
import {ModuleService} from '../../module/module.service';
import {dateRangeValidator} from '../dateRangeValidator';

@Component({
    selector: 'ebc-license-editor',
    templateUrl: './license-editor.component.html',
    styleUrls: ['./license-editor.component.scss']
})
export class LicenseEditorComponent implements OnInit {

    licenseForm: FormGroup;

    mandators: Mandator[];
    modules: Module[];
    keyPairs: KeyPair[];

    selectedMandator: string;
    selectedKeyPair: string;
    selectedModules: string[] = [];

    startDate: number = new Date().getDate();
    minDate: Date = new Date(2022, 0, 1);
    maxDate: Date = new Date(2099, 11, 31);
    currentLicense: License = new License();
    uuid = this.activeRoute.snapshot.params['uuid'];
    isAdmin: boolean = this.userService.isAdmin();
    editMode: boolean = false;

    constructor(
        public userService: UserService,
        private activeRoute: ActivatedRoute,
        private translocoService: TranslocoService,
        private toastrService: ToastrService,
        private licenseService: LicenseService,
        private mandatorService: MandatorService,
        private keyPairService: KeyPairService,
        private moduleService: ModuleService,
        private dateAdapter: DateAdapter<Date>,
        private router: Router
    ) {
        this.dateAdapter.setLocale('gr');
        this.activateTranslationEvents();
    }

    ngOnInit(): void {
        if (this.activeRoute.snapshot.params['uuid']) {
            const uuid = this.activeRoute.snapshot.params['uuid'];
            this.editMode = true;
            this.getLicense(uuid);
        }

        this.getAllModules();
        this.getAllMandators();
        this.getAllKeyPairs();

        this.licenseForm = new FormGroup({
            'name': new FormControl(null, [Validators.required, Validators.maxLength(100),
                Validators.pattern(/^(?=.*[a-zA-ZßäÄöÖüÜ])[a-zA-Z0-9ßäÄöÖüÜ]*( ?[-/._& ] ?[a-zA-Z0-9ßäÄöÖüÜ]+)*$/)]),
            'note': new FormControl(null, [Validators.maxLength(65535)]),
            'mandator': new FormControl(null,[Validators.required]),
            'module': new FormControl(null,[Validators.required]),
            'keyPair': new FormControl(null,[Validators.required]),
            'date' : new FormGroup({
                'startDate': new FormControl(null,[Validators.required]),
                'endDate': new FormControl(null,[Validators.required]),
            }, {validators: dateRangeValidator}),
            'userCount': new FormControl(null, [Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/), Validators.max(99999), Validators.min(2)])
        });
    }


    setLicenseFormValues(license: License): void {
        this.licenseForm.controls['name'].setValue(license.name);
        this.licenseForm.controls['note'].setValue(license.note);
        this.licenseForm.get('date.startDate').setValue(license.startDate);
        this.licenseForm.get('date.endDate').setValue(license.endDate);
        this.licenseForm.controls['userCount'].setValue(license.numberOfUsers);
        this.selectedMandator = license.mandator.uuid;
        this.selectedKeyPair = license.keyPair.uuid;

        license.modules.forEach((m)=> {
            this.selectedModules.push(m.uuid);
        });

        this.licenseForm.controls['mandator'].setValue(this.selectedMandator);
        this.licenseForm.controls['mandator'].updateValueAndValidity();

        this.licenseForm.controls['keyPair'].setValue(this.selectedKeyPair);
        this.licenseForm.controls['keyPair'].updateValueAndValidity();

        this.licenseForm.controls['module'].setValue(this.selectedModules);
        this.licenseForm.controls['module'].updateValueAndValidity();
    }

    onLicenseSaveButtonClicked(): void {
        const licenseForSaveRequest =  this.createLicenseForSaving();
        this.doRequestForCreation(licenseForSaveRequest).subscribe({
            next: () => {
                this.toastrService.success(this.translocoService.translate('license.editor.notification.create.success'));
                this.router.navigate(['/ui/license/overview']);
            },
            error: (error) => {
                if (error.status === 404) {
                    this.toastrService.error(this.translocoService.translate('license.editor.notification.load.error'));
                } else if (error.status === 409) {
                    this.toastrService.error(this.translocoService.translate('license.editor.notification.create.error-conflict'));
                } else if (error.status === 403) {
                    this.toastrService.error(this.translocoService.translate('license.editor.notification.create.forbidden'));
                } else if (error.status === 400) {
                    this.toastrService.error(this.translocoService.translate('license.editor.notification.create.bad-request'));
                } else if (error.status === 500) {
                    this.toastrService.error(this.translocoService.translate('license.editor.notification.create.internal-server-error'));
                } else {
                    this.toastrService.error(this.translocoService.translate('license.editor.notification.create.error'));
                }
            }
        });
    }

    onCancel(): void{
        this.licenseForm.reset();
    }

    activateTranslationEvents(): void {
        this.translocoService.events$.pipe(
            filter(e => e.type === 'translationLoadSuccess')
        ).subscribe(() => this.setLocale());

        this.translocoService.events$.pipe(
            filter(e => e.type === 'langChanged')
        ).subscribe(() => this.setLocale());
    }

    public hasNameFieldErrorRequired(): boolean {
        return this.licenseForm.controls['name'].hasError('required');
    }

    public hasNameFieldErrorMaxLength(): boolean {
        return this.licenseForm.controls['name'].hasError('maxlength');
    }

    public hasNameFieldErrorPattern(): boolean {
        return this.licenseForm.controls['name'].hasError('pattern');
    }

    public hasNoteFieldErrorMaxLength(): boolean {
        return this.licenseForm.controls['note'].hasError('maxlength');
    }

    public hasMandatorFieldErrorRequired(): boolean {
        return this.licenseForm.controls['mandator'].hasError('required');
    }

    public hasModuleFieldErrorRequired(): boolean {
        return this.licenseForm.controls['module'].hasError('required');
    }

    public hasKeyPairFieldErrorRequired(): boolean {
        return this.licenseForm.controls['keyPair'].hasError('required');
    }

    public hasStartDateFieldErrorRequired(): boolean {
        return this.licenseForm.get('date.startDate').hasError('required');
    }

    public hasEndDateFieldErrorRequired(): boolean {
        return this.licenseForm.get('date.endDate').hasError('required');
    }

    public hasStartDateFieldErrorMaxDate(): boolean {
        return this.licenseForm.get('date.startDate').hasError('maxDateError');
    }

    public hasStartDateFieldErrorMinDate(): boolean {
        return this.licenseForm.get('date.startDate').hasError('minDateError');
    }

    public hasEndDateFieldErrorInvalidDate(): boolean {
        return this.licenseForm.get('date.endDate').hasError('invalidDateRange');
    }

    public hasEndDateFieldErrorMaxDate(): boolean {
        return this.licenseForm.get('date.endDate').hasError('maxDateError');
    }

    public hasEndDateFieldErrorMinDate(): boolean {
        return this.licenseForm.get('date.endDate').hasError('minDateError');
    }

    public hasUserCountFieldErrorRequired(): boolean {
        return this.licenseForm.controls['userCount'].hasError('required');
    }

    public hasUserCountFieldErrorMaxCount(): boolean {
        return this.licenseForm.controls['userCount'].hasError('max');
    }

    public hasUserCountFieldErrorMinCount(): boolean {
        return this.licenseForm.controls['userCount'].hasError('min');
    }

    private createLicenseForSaving(): LicenseToSave {
        const licenseToSave: LicenseToSave = new LicenseToSave();

        licenseToSave.uuid = this.uuid;
        licenseToSave.name = this.licenseForm.value.name.trim();
        licenseToSave.mandatorUuid = this.licenseForm.value.mandator;
        licenseToSave.keyPairUuid = this.licenseForm.value.keyPair;
        licenseToSave.modulesUuids = this.setModuleUuid(this.licenseForm.value.module);
        licenseToSave.startDate = this.licenseForm.value.date.startDate;
        licenseToSave.endDate = this.licenseForm.value.date.endDate;
        licenseToSave.numberOfUsers = this.licenseForm.value.userCount;
        if (this.licenseForm.value.note != null) {this.licenseForm.value.note.trim();}
        licenseToSave.note = this.licenseForm.value.note;

        return licenseToSave;
    }

    private getLicense(uuid): void {
        this.licenseService.getLicense(uuid).subscribe({
            next: (license) => {
                this.currentLicense = license;
                this.setLicenseFormValues(this.currentLicense);
            },
            error: (error) => {
                if (error.status === 404) {
                    this.toastrService.error(this.translocoService.translate('license.overview.notification.load.error'));
                } else if (error.status === 500) {
                    this.toastrService.error(this.translocoService.translate('license.overview.notification.load.internal-server-error'));
                } else {
                    this.toastrService.error(this.translocoService.translate('license.overview.notification.load.error'));
                }
                this.currentLicense = null;
            }
        });
    }
    private doRequestForCreation(license: LicenseToSave): Observable<LicenseToSave>{
        if (license.uuid){
            return this.licenseService.postLicenseWithUuid(license);
        } else {
            return this.licenseService.postLicense(license);
        }
    }

    private setModuleUuid(modules: string[]): string[] {
        const modulesUuid: string[] = [];
        modules.forEach((module)=> {
            modulesUuid.push(module);
        });
        return modulesUuid;
    }

    private getAllModules(): void {
        this.moduleService.getModulesList().subscribe({
            next:(module)=> {
                this.modules = module;
            }
        });
    }

    private getAllMandators(): void {
        this.mandatorService.getMandatorsList().subscribe({
            next:(mandators)=> {
                this.mandators = mandators;
            }
        });
    }

    private getAllKeyPairs(): void {
        this.keyPairService.getKeyPairsList().subscribe({
            next:(keyPairs)=> {
                this.keyPairs = keyPairs;
            }
        });
    }



    private setLocale(): void{
        if (this.translocoService.getActiveLang() === 'de') {
            this.dateAdapter.setLocale('gr');
        } else if (this.translocoService.getActiveLang() === 'en') {
            this.dateAdapter.setLocale('en-GB');
        }
    }

}


