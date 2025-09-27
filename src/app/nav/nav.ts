import { Component } from '@angular/core';
import { SettingIcon } from '../shared/icons/setting-icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav',
  imports: [SettingIcon, RouterModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {

}
