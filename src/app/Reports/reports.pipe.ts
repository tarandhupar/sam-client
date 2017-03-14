import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'repfil'
})

export class ReportsPipe implements PipeTransform {

    transform(reports: any, id: any): any {
        if (id === undefined) return reports;

        return reports.filter(function (report) {
            return report.id.includes(id);
        })
    }
}
