import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserInfo } from '../user-info.model';
import { UserInfoService } from '../service/user-info.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './user-info-delete-dialog.component.html',
})
export class UserInfoDeleteDialogComponent {
  userInfo?: IUserInfo;

  constructor(protected userInfoService: UserInfoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userInfoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
