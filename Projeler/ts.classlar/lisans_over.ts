import {Component} from '@angular/core';
import {UserService} from '../../../core/user/user.service';
import {License} from '../license.model';
import {Sort, SortDirection} from '@angular/material/sort';
import {ActivatedRoute} from '@angular/router';
import {TranslocoService} from '@ngneat/transloco';
import {ToastrService} from 'ngx-toastr';
import {PageEvent} from '@angular/material/paginator';
import {PagedResponse} from '../../key-pair/paged-response';
import {LicenseService} from '../license.service';
import {FileService} from '../../../core/file/file.service';
import {MandatorService} from '../../mandator/mandator.service';
import {KeyPairService} from '../../key-pair/key-pair.service';
import {ModuleService} from '../../module/module.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../dialog/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'ebc-license-overview',
    templateUrl: './license-overview.component.html',
    styleUrls: ['./license-overview.component.scss']
})
export class LicenseOverviewComponent {

    static readonly pageIndexDefault = 0;
    static readonly pageSizeDefault = 10;
    static readonly sortFieldDefault = 'name';
    static readonly sortDirectionDefault: SortDirection = 'asc';

    pageIndex = LicenseOverviewComponent.pageIndexDefault;
    pageSize = LicenseOverviewComponent.pageSizeDefault;
    sortField = LicenseOverviewComponent.sortFieldDefault;
    sortDirection = LicenseOverviewComponent.sortDirectionDefault;

    totalElements: number = 0;

    showLicensesOfMandator: boolean = false;
    showLicensesOfKeyPair: boolean = false;
    showLicensesOfModule: boolean = false;
    showAllLicenses: boolean = false;

    isAdmin: boolean = this.userService.isAdmin();

    keyPairName: string;
    mandatorName: string;
    moduleName: string;
    licenses: License[] = [];

    displayedColumns: string[] = ['name', 'mandator', 'keyPair', 'modules', 'startDate', 'endDate',
        'userCount', 'createdAt', 'buttons'];

    constructor(
        private activeRoute: ActivatedRoute,
        private dialog: MatDialog,
        public userService: UserService,
        private translocoService: TranslocoService,
        private toastrService: ToastrService,
        private licenseService: LicenseService,
        private fileService: FileService,
        private mandatorService: MandatorService,
        private keyPairService: KeyPairService,
        private moduleService: ModuleService) {
    }

    ngOnInit(): void {
        this.loadLicenses();
    }

    loadLicenses(): void {
        if (this.activeRoute.snapshot.params['uuid']) {
            this.licenseService.getLicenses(this.pageIndex, this.pageSize, this.sortField, this.sortDirection).subscribe({
                next: (pagedLicenses) => {
                    this.updateSpecificLicenses(pagedLicenses);
                },
                error: (error) => {
                    if (error.status === 500) {
                        this.toastrService.error(this.translocoService.translate('license.overview.notification.load.internal-server-error'));
                    } else {
                        this.toastrService.error(this.translocoService.translate('license.overview.notification.load.error'));
                    }
                    this.licenses = [];
                }
            });
        } else {
            this.showAllLicenses = true;
            this.licenseService.getLicenses(this.pageIndex, this.pageSize, this.sortField, this.sortDirection).subscribe({
                next: (pagedLicenses) => {
                    this.updateLicenses(pagedLicenses);
                },
                error: (error) => {
                    if (error.status === 500) {
                        this.toastrService.error(this.translocoService.translate('license.overview.notification.load.internal-server-error'));
                    } else {
                        this.toastrService.error(this.translocoService.translate('license.overview.notification.load.error'));
                    }
                    this.licenses = [];
                }
            });
        }
    }

    downloadPrettyLicense(license): void {
        this.licenseService.downloadPrettyLicense(license.uuid).subscribe({
            next: (response) => {
                this.fileService.downloadFile(response);
            },
            error: (error) => {
                if (error.status === 404) {
                    this.toastrService.error(this.translocoService.translate('license.overview.notification.download.license.not-found'));
                } else if (error.status === 500) {
                    this.toastrService.error(this.translocoService.translate('license.overview.notification.download.license.internal-server-error'));
                } else {
                    this.toastrService.error(this.translocoService.translate('license.overview.notification.download.license.error'));
                }
            }
        });
    }

    downloadSignedLicense(license): void {
        this.licenseService.downloadSignedLicense(license.uuid).subscribe({
            next: (response) => {
                this.fileService.downloadFile(response);
            },
            error: (error) => {
                if (error.status === 404) {
                    this.toastrService.error(this.translocoService.translate('license.overview.notification.download.signed-license.not-found'));
                } else if (error.status === 500) {
                    this.toastrService.error(this.translocoService.translate('license.overview.notification.download.signed-license.internal-server-error'));
                } else {
                    this.toastrService.error(this.translocoService.translate('license.overview.notification.download.signed-license.error'));
                }
            }
        });
    }

    downloadEncryptedLicense(license): void {
        this.licenseService.downloadEncryptedLicense(license.uuid).subscribe({
            next: (response) => {
                this.fileService.downloadFile(response);
            },
            error: (error) => {
                if (error.status === 404) {
                    this.toastrService.error(this.translocoService.translate('license.overview.notification.download.encrypted-license.not-found'));
                } else if (error.status === 500) {
                    this.toastrService.error(this.translocoService.translate('license.overview.notification.download.encrypted-license.internal-server-error'));
                } else {
                    this.toastrService.error(this.translocoService.translate('license.overview.notification.download.encrypted-license.error'));
                }
            }
        });
    }

    deleteLicense(uuid: string): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent,
            {
                data: {
                    title: 'dialog.confirm.delete-license.title',
                    message: 'dialog.confirm.delete-license.message',
                    confirm: 'dialog.confirm.delete-license.confirm'
                }
            });

        dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    this.executeDeleteLicense(uuid);
                }
            }
        );
    }

    executeDeleteLicense(uuid: string): void {
        this.licenseService.deleteLicense(uuid).subscribe({
            next: () => {
                this.loadLicenses();
                this.toastrService.success(this.translocoService.translate('license.overview.notification.delete.success'));
            },
            error: (error) => {
                if (error.status === 403) {
                    this.toastrService.error(this.translocoService.translate('license.overview.notification.delete.forbidden'));
                } else if (error.status === 404) {
                    this.toastrService.error(this.translocoService.translate('license.overview.notification.delete.not-found'));
                } else if (error.status === 500) {
                    this.toastrService.error(this.translocoService.translate('license.overview.notification.delete.internal-server-error'));
                } else {
                    this.toastrService.error(this.translocoService.translate('license.overview.notification.delete.error'));
                }
            }
        });
    }

    changeSort(sort: Sort): void {
        this.sortField = sort.active;
        this.sortDirection = sort.direction;

        this.loadLicenses();
    }

    onPaginatorChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;

        this.loadLicenses();
    }

    private updateLicenses(pagedLicenses: PagedResponse<License>): void {
        this.licenses = pagedLicenses.content;
        this.totalElements = pagedLicenses.totalElements;
        this.pageIndex = pagedLicenses.number;
    }

    private updateSpecificLicenses(pagedLicenses: PagedResponse<License>): void {
        const routeConfigPath=this.activeRoute.routeConfig.path;
        const uuid = this.activeRoute.snapshot.params['uuid'];
        if (!pagedLicenses.empty) {
            if (routeConfigPath.includes('mandator')) {
                this.showLicensesOfMandator = true;
                this.filterLicensesOfMandator(pagedLicenses,uuid);
                this.getMandatorName(uuid);
            } else if (routeConfigPath.includes('key-pair')) {
                this.showLicensesOfKeyPair = true;
                this.filterLicensesOfKeyPair(pagedLicenses,uuid);
                this.getKeyPairName(uuid);
            } else if (routeConfigPath.includes('module')) {
                this.showLicensesOfModule = true;
                this.filterLicensesOfModules(pagedLicenses, uuid);
                this.getModuleName(uuid);
            }
        }
        this.totalElements = this.licenses.length;
        this.pageIndex = pagedLicenses.number;
    }

    private filterLicensesOfMandator(pagedLicenses: PagedResponse<License>, uuid: any): void {
        this.licenses = pagedLicenses.content.filter(license => license.mandator.uuid === uuid);
    }

    private getMandatorName(uuid): void {
        this.mandatorService.getMandator(uuid).subscribe({
            next: (mandator) => {
                this.mandatorName = mandator.name;
            }
        });
    }

    private filterLicensesOfKeyPair(pagedLicenses: PagedResponse<License>, uuid: any): void {
        this.licenses = pagedLicenses.content.filter(license => license.keyPair.uuid === uuid);
    }

    private getKeyPairName(uuid): void {
        this.keyPairService.getKeyPair(uuid).subscribe({
            next: (keyPair) => {
                this.keyPairName = keyPair.name;
            }
        });
    }

    private filterLicensesOfModules(pagedLicenses: PagedResponse<License>, uuid: any): void {
        this.licenses = this.filterLicensesOfModule(pagedLicenses.content, uuid);
    }

    private getModuleName(uuid): void {
        this.moduleService.getModule(uuid).subscribe({
            next: (module) => {
                this.moduleName = module.name;
            }
        });
    }

    private filterLicensesOfModule(pagedContent: License[], uuid): License[] {
        const licensesOfModule: License[] = [];
        pagedContent.forEach((license)=> {
            license.modules.forEach((module)=> {
                if (module.uuid === uuid) {
                    licensesOfModule.push(license);
                }
            });
        });
        return licensesOfModule;
    }

}
