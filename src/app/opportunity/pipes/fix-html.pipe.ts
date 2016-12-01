import { Pipe, PipeTransform } from '@angular/core';


@Pipe({name: 'fixhtml'})
export class FixHTMLPipe implements PipeTransform {

  transform(html: string): string {

    // Remove &nbsp; (ascii space)
    html = html.replace(/&nbsp;\s?/g, '');

    // Remove empty tags
    html = html.replace(/<[^\/>][^>]*><\/[^>]+>/g, '');

    // Remove inline styles
    html = html.replace(/ style="[^"]*"/g, '');

    // Remove strong tags
    html = html.replace(/<\/?strong>/g, '');

    // Remove BRs
    html = html.replace(/<br\s?\/?>/g, '');

    // Remove SPANs
    html = html.replace(/<\/?span>/g, '');

    return html;
  }
}

