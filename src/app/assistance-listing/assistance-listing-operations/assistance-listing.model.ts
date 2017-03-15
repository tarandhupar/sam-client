export class ProgramFormModel{

  getFormFields(){
    var data = [{
      section: 'header_information',
      label: 'Header Information',
      fields:[
        {
          name: 'title',
          type: 'samText',
          label: 'Title',
          maxlength: 144,
          hint: 'Spell out any acronyms and limit to 144 characters.',
          required: true
        },
        {
          name: 'alternativeNames',
          type: 'samText',
          label: 'Popular Name',
          hint: 'The Popular Name should be different than the Program Title.',
          required: false,
          saveType: 'array'
        },
        {
          name: 'programNumber',
          type: 'samNumber',
          label: 'FAL Number',
          maxlength:  3,
          minlength: 3,
          hint: 'Provide a unique three digit program number (for example, enter 244 for CFDA number 10.244)',
          required: true,
          errorMessage: 'This number falls outside the range defined for this organization.'
        }
      ]
    },
    {
      section: 'overview',
      label: 'Overview',
      fields:[
        {
          name: 'objective',
          type: 'samTextArea',
          label: 'Objectives',
          hint: 'Provide a plain text description highlighting program goals. Use specific terms that will help public users find this listing.',
          required: true
        },
        {
          name: 'falDesc',
          type: 'samTextArea',
          label: 'Federal Assistance Listing Description',
          hint: 'Provide an introduction to the listing that tells the public in plain, clear language its purpose, who it serves, and what makes it unique.',
          required: false
        }
      ]
    }
   ];

    return data;
  }
}
