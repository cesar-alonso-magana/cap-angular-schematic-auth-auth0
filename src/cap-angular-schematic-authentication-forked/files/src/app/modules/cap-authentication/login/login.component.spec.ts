import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConstantsService } from 'src/app/shared/services/app.constants';
import { RouterTestingModule } from '@angular/router/testing';
import { SeoService } from 'src/app/shared/services/seo.service';
import { CommunicationComponentsService } from 'src/app/shared/services/communication-components.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let documentSpy: jasmine.Spy;
  const constantsServiceMock = { };

  const communicationComponentsServiceMock = {
    sendUser: () => { }
  };

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule.withRoutes([]) ],
      providers: [
        SeoService,
        { provide: ConstantsService, useValue: constantsServiceMock },
        { provide: CommunicationComponentsService, useValue:  communicationComponentsServiceMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    documentSpy = spyOn(document, 'querySelectorAll').and.returnValue('<link rel="canonical" href=""></link>');
    spyOn(TestBed.get(SeoService), 'generateTags');
    spyOn(TestBed.get(SeoService), 'updateCanonicalUrl');
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(documentSpy).toHaveBeenCalled();
  });
});
