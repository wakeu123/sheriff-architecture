import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
//import * as DOMPurify from 'dompurify';

@Pipe({
  name: 'safeHtml',
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {

  transform(value: string): SafeHtml {

    //return inject(DomSanitizer).bypassSecurityTrustHtml(DOMPurify.sanitize(value));
    return inject(DomSanitizer).bypassSecurityTrustHtml(this.sanitize(value));
  }

  private sanitize(html: string): string {
    // Implémenter une logique de nettoyage plus poussée si nécessaire
    return html.replace(/<script.*?>.*?<\/script>/gi, '')
               .replace(/on\w+="[^"]*"/g, '');
  }

}
