# Pathfinding Visualizer

This application is a pathfinding visualizer built with Next.js. It allows users to visualize the shortest path between two points on a multi-floor map.

## Features

- Interactive map visualization
- Multi-floor navigation
- Shortest path calculation and display
- Dynamic floor switching
- Start and end point selection

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library for React

## Getting Started

### Prerequisites

- Node.js (version 20 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/pathfinding-visualizer.git
   cd pathfinding-visualizer
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Select a start location from the dropdown menu.
2. Select an end location from the dropdown menu.
3. The application will automatically calculate and display the shortest path.
4. Use the floor buttons to switch between different floors and view the path.

## Project Structure

- `src/app/page.tsx`: Main application component
- `src/components/PathVisualizer.tsx`: Component for visualizing the path
- `src/utils/`: Utility functions for pathfinding and graph operations
- `src/types/`: TypeScript type definitions

## Testing

Run the test suite with:

```bash
npm test
# or
yarn test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/docs/)
