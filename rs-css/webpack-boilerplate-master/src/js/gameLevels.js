export default [
  {
    name: 'Tag',
    description: 'Select plate by tag',
    markup: `
    <plate class="--selected">
      <apple class="apple"></apple>
      <apple class="apple"></apple>
    </plate>
    <cup></cup>
    `,
  },
  {
    name: 'Class',
    description: 'Select plate by tag',
    markup: `
    <plate>
      <apple class="apple"></apple>
    </plate>
    <plate></plate>
    <cup class="--selected"></cup>
    `,
  },
];
