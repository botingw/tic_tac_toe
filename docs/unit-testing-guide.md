# Unit Testing Best Practices Guide

This guide outlines best practices for unit testing in the Tic-Tac-Toe multiplayer game project, covering both frontend and backend testing approaches.

## Table of Contents
1. [General Testing Principles](#1-general-testing-principles)
2. [Backend Testing](#2-backend-testing-nodejs-express-socketio)
3. [Frontend Testing](#3-frontend--phaser-3-testing)
4. [Example Testing Approaches](#4-example-testing-approaches)
5. [Additional Tips](#5-additional-tips)

### 1. **General Testing Principles**
- **Isolation & Modularity**:  
  - **Separate Concerns**: Keep your core game logic separate from Phaser's rendering and Socket.IO's communication code. This makes it easier to test game mechanics independently.
  - **Small, Focused Tests**: Write tests that target one function or module at a time to ensure pinpoint accuracy and quick feedback.
- **Test-Driven Development (TDD)**:  
  - Writing tests before or alongside development helps clarify your design and ensures that new features do not break existing functionality.
- **Automated Testing & CI**:  
  - Integrate tests into your continuous integration (CI) pipeline to catch regressions early.
- **Clear and Descriptive Test Cases**:  
  - Name your tests in a way that clearly states what behavior is expected. This documentation helps in understanding failures quickly.

### 2. **Backend Testing (Node.js, Express, Socket.IO)**
- **Frameworks & Tools**:  
  - **Test Runner & Assertion Libraries**: Use Mocha or Jest paired with assertion libraries like Chai or Jest's built-in assertions.
  - **HTTP Testing**: Utilize Supertest to simulate HTTP requests and validate Express endpoints.
  - **Socket.IO Testing**:  
    - Simulate client-server interactions using libraries such as `socket.io-client` in your tests.
    - Test real-time communication by emitting and listening for events, ensuring that event handling logic works as expected.
- **Mocking & Stubbing**:  
  - Use libraries like Sinon to create mocks, stubs, and spies. This allows you to isolate and test asynchronous flows or external service interactions without relying on actual network connections.
- **Asynchronous Code Testing**:  
  - Ensure your tests can handle asynchronous operations using async/await, promises, or callbacks. Consider using tools like fake timers (e.g., Sinon's clock) to simulate time-dependent behaviors.

### 3. **Frontend & Phaser 3 Testing**
- **Abstract Game Logic**:  
  - **Decouple Logic from Rendering**: Abstract non-visual game logic into separate modules. This allows you to unit test game rules, state transitions, and scoring without dealing with Phaser's rendering or physics systems.
- **Testing Frameworks**:  
  - Use Jest or Jasmine to run tests in a headless environment (possibly with jsdom) to simulate the browser.
- **Mocking Phaser APIs**:  
  - Since Phaser includes many global functions and dependencies on the DOM/canvas, mock or stub these APIs so you can test your game logic in isolation.
- **Simulate User Input & Game Loop**:  
  - Write tests that simulate key presses, mouse clicks, or other user interactions and verify that the game state updates accordingly.
  - For time-based events (like animations or physics updates), consider abstracting the game loop logic so you can control and test it deterministically.
- **Integration Tests**:  
  - In addition to unit tests, consider integration or end-to-end tests (using tools like Cypress) for scenarios where the interaction between Phaser, Socket.IO, and the backend is critical.

### 4. **Example Testing Approaches**

#### **Backend (Express & Socket.IO) Example with Jest & Supertest:**
```js
// Example: Testing an Express route with Supertest and Jest
const request = require('supertest');
const app = require('./app'); // Your Express app

describe('GET /api/status', () => {
  it('should return status 200 with a JSON response', async () => {
    const res = await request(app).get('/api/status');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});
```

#### **Frontend (Game Logic) Example with Jest:**
```js
// Example: Testing game score logic in isolation
const { calculateScore } = require('./gameLogic');

describe('calculateScore', () => {
  it('should correctly calculate the score based on game events', () => {
    const events = [{ points: 10 }, { points: 20 }, { points: -5 }];
    const score = calculateScore(events);
    expect(score).toBe(25);
  });
});
```

### 5. **Additional Tips**
- **Use Dependency Injection**:  
  - Inject external dependencies (like network or Phaser components) into your modules. This makes it easier to replace them with mocks during testing.
- **Write Tests for Edge Cases**:  
  - Don't just test the "happy path." Include tests for error handling, unexpected inputs, and boundary conditions.
- **Regular Refactoring**:  
  - As your game grows, refactor tests alongside your code to ensure they remain maintainable and relevant.
- **Monitor Test Coverage**:  
  - Use coverage tools (like Istanbul/nyc) to ensure you're testing a significant portion of your codebase, but also be mindful that 100% coverage doesn't guarantee bug-free code.

## Conclusion

By following these practices, you'll create a robust testing suite that helps maintain the quality and reliability of both your backend and game logic, making future development and refactoring much safer. 