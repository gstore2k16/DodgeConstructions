import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

/** Landing page. Introduces the catalogue and hosts the full-size image lightbox for the hero gallery. */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  /** URL of the image currently shown full-size in the lightbox, or null when it's closed. */
  public fullSizeImage: string | null = null;

  /** Opens the lightbox showing the given image at full size. */
  public openFullSize(url: string): void {
    this.fullSizeImage = url;
  }

  /** Closes the lightbox. */
  public closeFullSize(): void {
    this.fullSizeImage = null;
  }
}
