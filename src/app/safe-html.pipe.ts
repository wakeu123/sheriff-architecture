import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {

  transform(value: string): SafeHtml {
    return inject(DomSanitizer).bypassSecurityTrustHtml(this.sanitize(value));
  }

  private sanitize(html: string): string {
    // Implémenter une logique de nettoyage plus poussée si nécessaire
    return html.replace(/<script.*?>.*?<\/script>/gi, '');
  }

}
