import React from 'react';
import { Booking } from '@/types/api';
import { QueueCard } from './QueueCard';

interface QueueColumnProps {
  title: string;
  bookings: Booking[];
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  isEmpty?: boolean;
}

const QueueColumn: React.FC<QueueColumnProps> = ({
  title,
  bookings,
  onDragOver,
  onDrop,
  isEmpty = false,
}) => (
  <div className="flex-1 flex flex-col">
    <h3 className="text-qe-h3 font-600 text-qe-ink mb-qe-6">{title}</h3>
    <div
      className="flex-1 space-y-qe-4 p-qe-6 rounded-qe-lg bg-qe-surface-2 border-2 border-dashed border-qe-line"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {bookings.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-qe-ink-3">
          <p className="text-qe-body">{isEmpty ? 'No customers' : 'Drag bookings here'}</p>
        </div>
      ) : (
        bookings.map((booking, idx) => <QueueCard key={booking.id} booking={booking} position={idx} />)
      )}
    </div>
  </div>
);

export { QueueColumn };
