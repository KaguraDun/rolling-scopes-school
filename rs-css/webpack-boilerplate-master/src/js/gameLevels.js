export default [
  {
    name: 'Tag',
    description: 'Select plate by tag',
    elements: ['plate', 'cup'],
    selectedElements: ['plate'],
  },
  {
    name: 'level 2',
    description: 'Select cup',
    elements: ['plate', 'cup', 'cake'],
    selectedElements: ['cup'],
  },
  {
    name: 'The cake is a lie',
    description: 'Select cake by id',
    elements: ['plate', 'cake', 'plate'],
    selectedElements: ['cake'],
  },
];
