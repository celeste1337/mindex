import {Component, OnInit, Output} from '@angular/core';
import {catchError, map, reduce} from 'rxjs/operators';
import {from, Observable, throwError} from 'rxjs';

import {Employee} from '../employee';
import {EmployeeService} from '../employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  errorMessage: string;
  employeeDialog: Employee;
  results: Employee;

  showDialog: boolean = false;
  dialogType: string;


  constructor(private employeeService: EmployeeService) {
  }

  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees() {
    this.employeeService.getAll()
    .pipe(
      reduce((emps, e: Employee) => emps.concat(e), []),
      map(emps => this.employees = emps),
      catchError(this.handleError.bind(this))
    ).subscribe();
  }

  private handleError(e: Error | any): string {
    console.error(e);
    return this.errorMessage = e.message || 'Unable to retrieve employees';
  }

  //edit/deletes below
  editCompensation($event: any) {
    //open dialog
    console.log(this.showDialog);
      this.showDialog = true;
      this.dialogType = "updateCompensation";
      this.employeeDialog = $event;
  }

  sendEditRequest($event:any) {
    //send put req
    this.employeeService.save($event).subscribe((result) => this.results = result);
  }

  removeReporter($event: any) {
    //open dialog
    this.showDialog = true;
    this.employeeDialog = $event;
    this.dialogType = "removeReporter";
  }

  receiveUpdate($event) {
    this.sendEditRequest($event);
    this.showDialog = false;

    this.getAllEmployees();
  }

  receiveRemove($event) {
    //send remove req
    this.employeeService.remove($event).subscribe((err) => console.log("completed" || err));
    this.showDialog = false;

    this.getAllEmployees();
  }

  closeDialog() {
    this.showDialog = false;
  }
}
