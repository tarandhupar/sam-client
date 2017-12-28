'use strict';
export let globals = {
  showOptional : SHOW_OPTIONAL === 'true' || ENV === 'development',
  searchFilterConfig: [
    {value: '', label: 'All Domains', width: '130'},
    {value: 'cfda', label: 'Assistance Listing', width: '180'},
    {value: 'opp', label: 'Contract Opportunities', width: '215'},
    {value: 'fpds', label: 'Contract Data', width: '165'},
    {value: 'ei', label: 'Entity Information', width: '185'},
    {value: 'fh', label: 'Federal Hierarchy', width: '175'},
    {value: 'wd', label: 'Wage Determinations', width: '200'},
  ],
};
