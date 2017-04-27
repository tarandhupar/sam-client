'use strict';
export let globals = {
  isDefaultHeader: true,
  showOptional : SHOW_OPTIONAL === 'true' || ENV === 'development',
  searchFilterConfig: [
    {value: '', label: 'All', width: '60'},
    {value: 'opp', label: 'Opportunities', width: '145'},
    {value: 'cfda', label: 'Assistance Listings', width: '180'},
    {value: 'fh', label: 'Federal Hierarchy', width: '175'},
    {value: 'ent', label: 'Entities', width: '100'},
    {value: 'ex', label: 'Exclusions', width: '120'},
    {value: 'wd', label: 'Wage Determinations', width: '200'},
    {value: 'fpds', label: 'Awards', width: '100'}
  ],
};
