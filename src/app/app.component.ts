import { CryptoService } from '@domains/shared/services/crypto/crypto.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ValidationErrors } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DatePipe } from '@angular/common';
import { OffLineService } from '@domains/shared/services/off-line/off-line.service';
import { MessageService } from 'primeng/api';
//import { GlobalLoaderComponent } from "../domains/shared/components/global-loader/global-loader.component";

@Component({
  selector: 'app-root',
  imports: [
    ButtonModule, ToastModule,
    ConfirmDialogModule, RouterLink,
    RouterOutlet, TranslateModule, ButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    CryptoService,
    MessageService
  ]
})
export class AppComponent implements OnInit {

  private readonly messageService = inject(MessageService);
  private readonly cryptoService = inject(CryptoService);
  private readonly offLineService = inject(OffLineService);
  private readonly translateService = inject(TranslateService);

  //pm i @ngspot/ngx-errors très important pour gérer les erreurs des formulaires
  dateString = signal('');
  title = 'Sheriff architecture';

  ngOnInit(): void {
    this.offLineService.initialize();
    this.offLineService.online$.subscribe(online => {
      this.messageService.add({severity:'info', summary: 'Connexion', detail: online ? '🌐 En ligne' : '📴 Hors ligne', key: 'online'});
    });

    const date = new Date();
    const formattedDate = new DatePipe('en').transform(date, 'dd/MM/yyyy');

    if(formattedDate != null) {
      this.dateString.set(formattedDate);
    }

    console.log('Date formaté: ', formattedDate);
    console.log('Date formatée: ', this.dateString());

    const users = [
      {
        id: null,
        name: 'wakeu'
      },
      {
        id: 2,
        name: 'akono'
      }
    ];

    console.log('Values :', Object.values(users[0]));
    console.log('Some :', users.some(user => user.id));
    console.log('Every :', users.every(user => user.id));

    const name = 'WAKEU Georges Favier';
    const enscryt = this.cryptoService.encrypt(name);
    console.log('CryptoKey 1: ', enscryt);
    console.log('CryptoKey 2: ', this.cryptoService.decrypt(enscryt));
    console.log('Test: ', this.shuffleArray<string>(['a', 'b', 'c']));

  }

  toggleDarkMode(ade: ValidationErrors) {
    console.log(ade);
  }

  toggleLangue(lang: string) {
    console.log('Langue choisie: ', lang);
    this.translateService.use(lang);
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
