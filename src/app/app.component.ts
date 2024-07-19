import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from 'angular-custom-modal';
import { ApexChart, ApexNonAxisChartSeries, ApexResponsive, ChartComponent } from 'ng-apexcharts';

interface Workout {
  workoutType: string;
  minutes: number;
}
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  @ViewChild('displayChartModal') displayChartModal!: ModalComponent;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  isMenuOpen = false;
  createdBy = 'Rutvik Raut';
  currentYear: number = new Date().getFullYear();
  navLinks: any[] = [
    { label: 'Home', url: '#' },
    { label: 'Contact', url: 'mailto:rutvikraut30@gmail.com' }
  ];
  form: FormGroup;
  isSubmitForm = false;
  workoutType = ['Running', 'Cycling', 'Walking', 'Yoga'];
  selectedWorkoutTypes: string[] = [];
  search: any;

  cols = [
    { field: 'name', title: 'Name' },
    { field: 'workoutNames', title: 'Workouts' },
    { field: 'workoutCount', title: 'No. Of Workouts' },
    { field: 'totalMinutes', title: 'Total Workout Minutes' },
    { field: 'analysis', title: 'Analysis' },
  ];
  transformedRows: any[] = [];
  rows: any[] = []
  workoutTypeArray: string[] = [];
  store: any;
  isLoading = true;
  userName;
  workoutTypesForChart;
  workoutMinutesForChart;
  constructor(public fb: FormBuilder) {
    this.rows = [
      {
        id: 1,
        name: 'John Doe',
        workouts: [
          { type: 'Running', minutes: 30 },
          { type: 'Cycling', minutes: 45 },
          { type: 'Walking', minutes: 15 }
        ]
      },
      {
        id: 2,
        name: 'Jane Smith',
        workouts: [
          { type: 'Swimming', minutes: 60 },
          { type: 'Running', minutes: 20 }
        ]
      },
      {
        id: 3,
        name: 'Mike Johnson',
        workouts: [
          { type: 'Yoga', minutes: 50 },
          { type: 'Cycling', minutes: 40 }
        ]
      },
    ];
    this.transformedRows = this.transformRows(this.rows);
    this.initForm();

  }

  initChart() {
    this.chartOptions = {
      series: this.workoutMinutesForChart,
      chart: {
        width: 380,
        type: "pie"
      },
      labels: this.workoutTypesForChart,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
  transformRows(rows: any[]): any[] {
    return rows.map(row => {
      const uniqueWorkouts: any[] = [];
      const workoutTypes = new Set();

      row.workouts.forEach((workout: any) => {
        if (!workoutTypes.has(workout.type)) {
          workoutTypes.add(workout.type);
          uniqueWorkouts.push(workout);
        }
      });

      return {
        id: row.id,
        name: row.name,
        workoutNames: uniqueWorkouts.map(workout => workout.type).join(', '),
        workoutCount: uniqueWorkouts.length,
        totalMinutes: uniqueWorkouts.reduce((sum: number, workout: any) => sum + workout.minutes, 0)
      };
    });
  }

  initForm() {
    this.form = this.fb.group({
      id: this.transformedRows.length + 1,
      userName: ['', Validators.required],
      time: ['', Validators.required],
      workoutType: ['', Validators.required]
    });
  }

  
  open(value) {
    this.userName = value.name
    const matchedRecord = this.rows.find(row => row.name === value.name);
    if (matchedRecord) {
      this.workoutTypesForChart = matchedRecord.workouts.map(workout => workout.type);
      this.workoutMinutesForChart = matchedRecord.workouts.map(workout => workout.minutes);
      this.initChart();
      this.displayChartModal.open();
    } else {
      alert('No matching record found');
    }

  }

  submitForm() {
    this.isSubmitForm = true;
    if (this.form.valid) {
      const existingRecordIndex = this.transformedRows.findIndex(record => record.name === this.form.value.userName);
      if (existingRecordIndex !== -1) {
        /* Update Record*/
        const existingRecord = this.rows[existingRecordIndex];
        const existingWorkoutIndex = existingRecord.workouts.findIndex(workout => workout.type === this.form.value.workoutType);
        if (existingWorkoutIndex !== -1) {
          // Update existing workout
          existingRecord.workouts[existingWorkoutIndex].minutes = Number(this.form.value.time);
        } else {
          existingRecord.workouts.push({ type: this.form.value.workoutType, minutes: Number(this.form.value.time) });
        }

        this.rows[existingRecordIndex] = existingRecord;
      }
      else {
        /* Add Record*/
        const newRecord = {
          id: this.form.value.id,
          name: this.form.value.userName,
          workouts: [
            { type: this.form.value.workoutType, minutes: Number(this.form.value.time) }
          ]
        }
        this.rows.push(newRecord)
      }
      this.transformedRows = this.transformRows(this.rows);
      this.form.reset();
      this.isSubmitForm = false;
      this.selectedWorkoutTypes = [];
      this.initForm();

    }

  }

  updateTransformedRows() {
    this.transformedRows = this.rows.map(row => ({
      id: row.id,
      name: row.name,
      workoutNames: row.workouts.map((workout: Workout) => workout.workoutType).join(', '),
      workoutCount: row.workouts.length,
      totalMinutes: row.workouts.reduce((sum: number, workout: Workout) => sum + workout.minutes, 0)
    }));
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
