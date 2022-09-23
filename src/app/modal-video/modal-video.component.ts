import { Component, Input } from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-basic',
  templateUrl: './modal-video.component.html',
  styleUrls: ['./modal-video.component.scss']
})
export class NgbdModalBasic {
  @Input()
  enlaceVideo!: String;
  
  closeResult = '';



  constructor(private modalService: NgbModal) { }
  ancho!: number;
  alto!: number;
  iniciado: boolean = false;
  


  open(content: any) {
    this.modalService.open(content, { size: this.CheckDimensionModal(), ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  ngOnInit() {


    this.ancho = window.innerWidth * 0.6;
    this.alto = Math.round(this.ancho / 1.7777);
    this.iniciado = true;

  }

  CheckDimensionModal() {
    if (window.innerWidth < 800) {
      return 'sm';
    }
    else {
      return 'xl';
    }
  }

}

