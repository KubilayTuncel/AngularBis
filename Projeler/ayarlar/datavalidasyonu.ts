import { AbstractControl } from '@angular/forms';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function dateRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;
    const minDate = new Date(2022, 0, 1);
    const maxDate = new Date(2099, 11, 31);

    if (startDate && endDate && startDate >= endDate) {
        control.get('endDate')?.setErrors({ invalidDateRange: true });
    }
    if (startDate && startDate < minDate){
        control.get('startDate')?.setErrors({minDateError: true});
    }
    if (endDate && endDate < minDate) {
        control.get('endDate')?.setErrors({minDateError: true});
    }
    if (startDate && startDate > maxDate){
        control.get('startDate')?.setErrors({maxDateError: true});
    }
    if (endDate && endDate > maxDate){
        control.get('endDate')?.setErrors({maxDateError: true});
    }
    return null;
}

