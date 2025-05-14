module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.specs.ts', 
    '**/modules/**/*.specs.ts', 
    '**/controllers/**/*.specs.ts', 
    '**/services/**/*.specs.ts'
  ],
};