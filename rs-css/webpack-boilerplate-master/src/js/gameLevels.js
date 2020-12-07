export default [
  {
    complete: false,
    completeWithHelp: false,
    name: 'Tags and plates',
    description: 'Select plate by tag',
    markup: ['<plate class="--selected">'],
  },
  {
    complete: false,
    completeWithHelp: false,
    name: 'Tags and cookie',
    description: 'Select cookie on plate',
    markup: ['<plate>', '<cookie class="--selected">', '</cookie>', '</plate>'],
  },
  {
    complete: false,
    completeWithHelp: false,
    name: 'Class',
    description: 'Select fancy plate by class',
    markup: [
      '<plate>',
      '</plate>',
      '<plate class = "fancy --selected">',
      '</plate>',
      '<plate>',
      '</plate>',
    ],
  },
];
