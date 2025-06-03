import { gsap } from 'gsap';
import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-global-loader',
  standalone: true,
  imports: [],
  template: `
    <div class="global-loader">
      <div class="container">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
      <div class="container">
        <div class="shadow"></div>
        <div class="shadow"></div>
        <div class="shadow"></div>
        <div class="shadow"></div>
      </div>
    </div>
  `,
  styleUrl: './global-loader.component.scss'
})
export class GlobalLoaderComponent implements OnInit {

  ngOnInit(): void {
    this.animateElement();
  }

  private animateElement() {
    gsap.to(".dot", { y: -60, stagger: { each: 0.2, repeat: -1, yoyo: true } });
    gsap.to(".shadow", { y: 60, stagger: { each: 0.2, repeat: -1, yoyo: true }, opacity: 0.1 });
  }
}
