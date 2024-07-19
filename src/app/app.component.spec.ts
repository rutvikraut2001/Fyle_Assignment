import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [ReactiveFormsModule, FormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form with 3 controls', () => {
    expect(component.form.contains('userName')).toBeTruthy();
    expect(component.form.contains('workoutType')).toBeTruthy();
    expect(component.form.contains('time')).toBeTruthy();
  });

  it('should make the userName control required', () => {
    const control = component.form.get('userName');
    control.setValue('');
    expect(control.valid).toBeFalsy();
    expect(control.errors?.['required']).toBeTruthy();
  });

  it('should make the workoutType control required', () => {
    const control = component.form.get('workoutType');
    control.setValue('');
    expect(control.valid).toBeFalsy();
    expect(control.errors?.['required']).toBeTruthy();
  });

  it('should make the time control required', () => {
    const control = component.form.get('time');
    control.setValue('');
    expect(control.valid).toBeFalsy();
    expect(control.errors?.['required']).toBeTruthy();
  });

  it('should display "Looks Good!" message when userName is valid', () => {
    const control = component.form.get('userName');
    control.setValue('JohnDoe');
    component.isSubmitForm = true;
    fixture.detectChanges();
    const messageElement = fixture.debugElement.query(By.css('#customeEmail + ng-container p'));
    expect(messageElement.nativeElement.textContent).toContain('Looks Good!');
  });

  it('should display "Required" message when userName is invalid', () => {
    const control = component.form.get('userName');
    control.setValue('');
    component.isSubmitForm = true;
    fixture.detectChanges();
    const messageElement = fixture.debugElement.query(By.css('#customeEmail + ng-container p'));
    expect(messageElement.nativeElement.textContent).toContain('Required');
  });

  it('should display "Looks Good!" message when workoutType is valid', () => {
    const control = component.form.get('workoutType');
    control.setValue('Running');
    component.isSubmitForm = true;
    fixture.detectChanges();
    const messageElement = fixture.debugElement.query(By.css('.md\\:col-span-2 + ng-container p'));
    expect(messageElement.nativeElement.textContent).toContain('Looks Good!');
  });

  it('should display "Required" message when workoutType is invalid', () => {
    const control = component.form.get('workoutType');
    control.setValue('');
    component.isSubmitForm = true;
    fixture.detectChanges();
    const messageElement = fixture.debugElement.query(By.css('.md\\:col-span-2 + ng-container p'));
    expect(messageElement.nativeElement.textContent).toContain('Required');
  });

  it('should display "Looks Good!" message when time is valid', () => {
    const control = component.form.get('time');
    control.setValue('30');
    component.isSubmitForm = true;
    fixture.detectChanges();
    const messageElement = fixture.debugElement.query(By.css('input[formControlName="time"] + ng-container p'));
    expect(messageElement.nativeElement.textContent).toContain('Looks Good!');
  });

  it('should display "Required" message when time is invalid', () => {
    const control = component.form.get('time');
    control.setValue('');
    component.isSubmitForm = true;
    fixture.detectChanges();
    const messageElement = fixture.debugElement.query(By.css('input[formControlName="time"] + ng-container p'));
    expect(messageElement.nativeElement.textContent).toContain('Required');
  });

  it('should submit the form successfully when valid', () => {
    component.form.setValue({
      userName: 'JohnDoe',
      workoutType: 'Running',
      time: '30'
    });
    component.submitForm();
    expect(component.form.valid).toBeTruthy();
  });
});
