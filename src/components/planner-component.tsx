'use client'
import React from 'react';
import { DroppableColumn } from './droppable-column';
import { useDragDrop } from '@/contexts/DragDropContext';

function PlannerComponent() {
  const { columns } = useDragDrop();

  return (
    <div className='h-full w-full font-mono flex items-start justify-start p-1 px-2 sm:px-6 lg:px-12'>
      <div className="rounded-lg shadow-lg p-3 sm:p-4 lg:p-6 w-full h-full overflow-x-auto scrollbar scrollbar-track-transparent scrollbar-track-rounded-full scrollbar-corner-transparent scrollbar-thumb-primary/70">
        <div className="flex gap-2 sm:gap-3 lg:gap-4 h-full md:min-h-[500px]" style={{ minWidth: 'fit-content' }}>
          {columns.map((column) => (
            <div 
              key={column.id} 
              className={`flex-shrink-0 h-full ${
                columns.length <= 2 
                  ? 'flex-1 min-w-[300px] sm:min-w-[300px] lg:min-w-[300px]' 
                  : 'w-[300px] sm:w-[300px] lg:w-[300px]'
              }`}
            >
              <DroppableColumn column={column} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlannerComponent