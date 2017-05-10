'use strict';
export let globals = {
  isDefaultHeader: true,
  showOptional : SHOW_OPTIONAL === 'true' || ENV === 'development',
  searchFilterConfig: [
    {value: '', label: 'All Domains', width: '130'},
    {value: 'cfda', label: 'Assistance Listings', width: '180'},
    {value: 'opp', label: 'Contract Opportunities', width: '215'},
    {value: 'fpds', label: 'Contract Awards', width: '165'},
    {value: 'ent', label: 'Entity Registrations', width: '190'},
    {value: 'ex', label: 'Entity Exclusions', width: '165'},
    {value: 'fh', label: 'Federal Hierarchy', width: '175'},
    {value: 'wd', label: 'Wage Determinations', width: '200'},
  ],
};
