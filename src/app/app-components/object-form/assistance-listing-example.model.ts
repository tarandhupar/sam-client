export class ProgramFormModel{

  getFormFields(){
    var data = [{
      section: 'header_information',
      label: 'Header Information',
      fields:[
        {
          name: 'title',
          type: 'sam-text',
          label: 'Title',
          maxlength: 144,
          hint: 'Spell out any acronyms and limit to 144 characters.',
          required: true
        },
        {
          name: 'alternativeNames',
          type: 'sam-text',
          label: 'Popular Name',
          hint: 'The Popular Name should be different than the Program Title.',
          required: false,
          saveType: 'array'
        },
        {
          name: 'programNumber',
          type: 'sam-number',
          label: 'FAL Number',
          maxlength:  3,
          minlength: 3,
          hint: 'Provide a unique three digit CFDA number (for example, enter 244 for CFDA number 10.244)',
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
            type: 'sam-text-area',
            label: 'Objectives',
            hint: 'Provide a plain text description highlighting program goals. Use specific terms that will help public users find this listing.',
            required: true
          },
          {
            name: 'falDesc',
            type: 'sam-text-area',
            label: 'Federal Assistance Listing Description',
            hint: 'Provide an introduction to the listing that tells the public in plain, clear language its purpose, who it serves, and what makes it unique.',
            required: false
          }
        ]
      },
      {
        section: 'contact_information',
        label: 'Contact Information',
        fields:[
          {
            name: 'content',
            type: 'sam-text-area',
            label: 'Additional Information',
            required: false
          }
        ]
      }
    ];

    return data;
  }
}
