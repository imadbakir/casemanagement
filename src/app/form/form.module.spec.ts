import { FormModule } from './form.module';

describe('FormModule', () => {
  let formioModule: FormModule;

  beforeEach(() => {
    formioModule = new FormModule();
  });

  it('should create an instance', () => {
    expect(formioModule).toBeTruthy();
  });
});
