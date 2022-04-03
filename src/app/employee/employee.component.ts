import {Component, Input, Output} from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import {catchError, map, reduce} from 'rxjs/operators';

import {Employee} from '../employee';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  @Input() employee: Employee;

  @Output() editEvent: EventEmitter<Employee> = new EventEmitter();
  @Output() removeEvent: EventEmitter<Employee> = new EventEmitter();
  errorMessage: string;

  compensation: number = 0;
  directReports: Array<Employee> = [];
  showDialog: boolean = false;
  openFormType: string;

  constructor(private employeeService: EmployeeService) {
  }

  ngOnInit() {
    this.collectReportingEmployees();
  }

  collectReportingEmployees() {
    if(this.employee.directReports) {
      let reportees = this.employee.directReports;
      
      reportees.forEach(reportee => 
        this.getEmployee(reportee)
      );
    }
  }

  //directreports contains employee ids
  //we can use those to get the employees
  getEmployee(id): void {
    this.employeeService.get(id
      ).subscribe(
        (data) => {
          this.directReports = this.directReports.concat(data);
      })
  }
  //we want to update compensation of a specific person
  updateCompensation(emp: Employee) {
    emp.compensation = this.compensation;
    this.editEvent.emit(emp);
  }

  //remove one employee from the direct report
  removeReporter(emp: Employee) {
    this.removeEvent.emit(emp);
  }

  private handleError(e: Error | any): string {
    console.error(e);
    return this.errorMessage = e.message || 'Unable to retrieve employees';
  }
}
