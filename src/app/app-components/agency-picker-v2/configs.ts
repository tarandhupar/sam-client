export const DpmtSelectConfig = {
    options: [
        {
            value:'',
            label: 'Please select a Department/Ind. Agency',
            name: ''
        }
    ],
    show: true,
    label: 'Department/Ind. Agency',
    name: 'Department',
    type: 'department',
    selectedOrg: ""
};

export const AgencySelectConfig = {
    options: [
        {
            value:'',
            label: 'Please select a Sub-tier',
            name: ''
        }
    ],
    show: false,
    label: 'Sub-tier',
    name: 'Agency',
    type: 'agency',
    selectedOrg: ""
};

export const OfficeSelectConfig = {
    options: [
        {
            value:'',
            label: 'Please select an Office',
            name: ''
        }
    ],
    show: false,
    label: 'Office',
    name: 'Office',
    type: 'office',
    selectedOrg: ""
};