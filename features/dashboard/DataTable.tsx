import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type Column<T> = {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  className?: string;
};

export function DataTable<T>({ columns, rows, rowKey }: { columns: Column<T>[]; rows: T[]; rowKey: (row: T) => string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-ink-800 bg-ink-900">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-ink-800 text-start text-xs text-ink-400">
            {columns.map((col) => (
              <th key={col.key} scope="col" className={cn('px-4 py-3 text-start font-medium', col.className)}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-b border-ink-800/60 transition-colors last:border-0 hover:bg-ink-800/40">
              {columns.map((col) => (
                <td key={col.key} className={cn('px-4 py-3 align-middle text-ink-100', col.className)}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
