import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Employee } from '../employee';

@Component({
  selector: 'app-dialog-page',
  templateUrl: './dialog-page.component.html',
  styleUrls: ['./dialog-page.component.css']
})
export class DialogPageComponent implements OnInit {
@Input() dialogType: string;
@Input() showDialog: boolean;
@Input() employeeDialog: Employee;
@Input() results: Employee;

@Output() submitUpdate: EventEmitter<Employee> = new EventEmitter();
@Output() submitRemove: EventEmitter<Employee> = new EventEmitter();
@Output() close: EventEmitter<boolean> = new EventEmitter();

showCompensation: boolean = false;
showRemove: boolean = false;
  constructor() { }

  ngOnInit(): void {
    this.setUpDialog();
  }

  ngOnChanges(changes) {
    if(changes.showDialog) {
      this.setUpDialog();
    }
  }

  setUpDialog() {
    if(this.dialogType === "updateCompensation") {
        this.showCompensation = true;
    }
    if (this.dialogType === "removeReporter") {
      this.showRemove = true;
    }
  }

  toggleCompensation(): void {
    this.showCompensation = false;
    this.close.emit(true);
  }

  toggleRemove(): void {
    this.showRemove = false;
    this.close.emit(true);
  }

  submitForm($event) {
    if(this.dialogType === "updateCompensation") {
      //gather up data to send to employee-list-component - i hate how i did this. im so sorry
      let temp = [$event.target[0].value, $event.target[1].value, $event.target[2].value, $event.target[3].value];

      //emit the data
      this.submitUpdate.emit({
        firstName: temp[0],
        lastName: temp[1],
        position: temp[2],
        compensation: temp[3],
        id: this.employeeDialog.id
      });
    }

    if(this.dialogType === "removeReporter") {
      if($event) {
        this.submitRemove.emit(this.employeeDialog);
      }
    }
  } 

}
