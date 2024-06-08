import React, { useEffect, useState } from 'react';
import Block from './block';

export default function Grid() {
  const [grid, setGrid] = useState([]);
  const [rows, setRows] = useState(Math.floor(window.innerHeight / 16));
  const [cols, setCols] = useState(Math.floor(window.innerWidth / 16));
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setRows(Math.floor(window.innerHeight / 16));
      setCols(Math.floor(window.innerWidth / 16));
      createGrid();
    };

    const handleKeyPress = (e) => {
      if (e.key === 's') {
        setIsRunning(prev => !prev);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyPress);
    createGrid(); // Initialize grid on mount

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    createGrid();
  }, [rows, cols]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        getNextGeneration();
      }, 100); // Update interval as desired
    } else if (interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, grid]);

  const createGrid = () => {
    const temp = Array.from({ length: rows }, () => Array(cols).fill(false));
    setGrid(temp);
  };

  const toggleCell = (row, col) => {
    const newGrid = grid.map((r, i) => 
      r.map((cell, j) => (i === row && j === col ? !cell : cell))
    );
    setGrid(newGrid);
  };

  const getNextGeneration = () => {
    const newGrid = grid.map((r, i) =>
      r.map((cell, j) => {
        const neighbors = getAliveNeighbors(i, j);
        if (cell) {
          return neighbors === 2 || neighbors === 3;
        } else {
          return neighbors === 3;
        }
      })
    );
    setGrid(newGrid);
  };

  const getAliveNeighbors = (row, col) => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], /*    */ [0, 1],
      [1, -1], [1, 0], [1, 1],
    ];
    return directions.reduce((acc, [x, y]) => {
      const newRow = row + x;
      const newCol = col + y;
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        acc += grid[newRow][newCol] ? 1 : 0;
      }
      return acc;
    }, 0);
  };

  return (
    <div
      className='flex flex-wrap'
      style={{
        width: `${cols * 16}px`,
        height: `${rows * 16}px`,
        overflow: 'hidden',
      }}
    >
      {grid.map((row, i) =>
        row.map((cell, j) => (
          <Block
            key={`${i}-${j}`}
            isAlive={cell}
            toggleCell={() => toggleCell(i, j)}
          />
        ))
      )}
    </div>
  );
}
