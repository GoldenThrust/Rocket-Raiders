# Rocket Raiders

Rocket Raiders is a fast-paced multiplayer space shooter game where players engage in thrilling cosmic battles using high-speed rockets and powerful weapons. The game takes you to the depths of space, where skillful maneuvering and strategic attacks are the keys to survival.

## Table of Contents

- [Rocket Raiders](#rocket-raiders)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Installation](#installation)
  - [Scripts](#scripts)
  - [Gameplay](#gameplay)
  - [Development](#development)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- **Multiplayer Battles:** Engage in real-time cosmic battles against players from around the world.
- **Dynamic Gameplay:** Navigate your rocket through an ever-changing field of asteroids and enemies.
- **Power-Ups:** Collect power-ups to enhance your rocket's abilities and survive longer.
- **High Scores:** Compete with friends and players worldwide for the highest score.
- **Responsive Design:** Enjoy the game on both desktop and mobile devices.
- **Immersive Soundtrack:** Experience the thrill of space with an engaging soundtrack and sound effects.

## Technologies Used

- MERN Stack (MongoDB, Express.js, React.js, Node.js)
- Redis
- EJS (Embedded JavaScript)
- Vanilla JavaScript
- HTML5 Canvas
- CSS3
- [Webpack](https://webpack.js.org/) (Module bundler)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/GoldenThrust/rocket-raiders.git
   ```
2. Navigate to the project directory:
   ```bash
   cd rocket-raiders
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Configure the environment variables by creating a `.env` file in the root directory based on the `.env-example` file:
   ```bash
   cp .env-example .env
   ```
   Update the `.env` file with your configuration:
   ```env
   DEV=true
   PORT=3001
   REDIS_HOST=127.0.0.1
   REDIS_PASSWORD=your_redis_password
   REDIS_PORT=6379
   MONGODB_URI='mongodb://127.0.0.1:27017/rocket-raiders'
   COOKIE_SECRET=your_cookie_secret
   JWT_SECRET=your_jwt_secret
   VITE_HOST_URL=http://localhost:3001
   HOST_URL=http://localhost:3001
   ```
5. Run the following commands to build and serve the application:
   ```bash
   npm run pack
   npm run build
   npm run server
   ```
6. Open your browser and go to `http://localhost:3001` to play the game.


## Scripts

Below are the available npm scripts for the project:

- **build:** Compiles the production build of the client using `cross-env` and `react-router`.
  ```bash
  npm run build
  ```
- **dev:** Starts the development server with `react-router`.
  ```bash
  npm run dev
  ```
- **start:** Serves the built client files using `serve`.
  ```bash
  npm run start
  ```
- **typecheck:** Runs type checking using `react-router typegen` and `tsc`.
  ```bash
  npm run typecheck
  ```
- **server:** Runs the server by executing `index.js` and `worker.js`.
  ```bash
  npm run server
  ```
- **start-server:** Starts the server with `nodemon` for automatic restarts.
  ```bash
  npm run start-server
  ```
- **pack:** Bundles the application using `webpack`.
  ```bash
  npm run pack
  ```
- **test:** Placeholder for running tests.
  ```bash
  npm test
  ```

## Gameplay

- **Controls:**  
  - **Keyboard**: Use the **arrow keys** to move the rocket.  
  - **Shooting**: Press **Enter** or **Shift** to shoot, or click/hold the screen (on mobile) to shoot.
  - **Mobile**: Hold the screen to shoot and move the rocket using device motion (tilt the phone).
  
- **Objective:**  
  The goal of **Rocket Raiders** is to accumulate the most kills by destroying enemy rockets and obstacles. Engage in fast-paced, multiplayer cosmic battles and be the last rocket standing with the highest kill count.

- **Tips:**  
  - Keep an eye on the Minimap of the screen for incoming enemies.
  - Use power-ups strategically to boost your chances of survival.
  - Always keep moving to avoid being an easy target.

## Development

Feel free to contribute to Rocket Raiders. Here are the steps to set up the development environment:

1. Fork the repository.
2. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature or fix description"
   ```
4. Push your branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information on how to get involved.

## License

Rocket Raiders is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
