import { useIsMobile } from '@/hooks/useMobile';

interface ResponsiveTableProps {
  headers: string[];
  rows: Array<{
    id: string;
    cells: React.ReactNode[];
    actions?: React.ReactNode;
  }>;
  onSelectAll?: (selected: boolean) => void;
  selectedIds?: Set<string>;
  onSelect?: (id: string) => void;
  showCheckbox?: boolean;
}

export function ResponsiveTable({
  headers,
  rows,
  onSelectAll,
  selectedIds = new Set(),
  onSelect,
  showCheckbox = false,
}: ResponsiveTableProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    // Layout listrado para mobile
    return (
      <div className="space-y-2">
        {rows.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum item cadastrado
          </div>
        ) : (
          rows.map((row, idx) => (
            <div
              key={row.id}
              className={`p-3 rounded-lg border ${
                idx % 2 === 0 ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                {showCheckbox && (
                  <input
                    type="checkbox"
                    checked={selectedIds.has(row.id)}
                    onChange={() => onSelect?.(row.id)}
                    className="w-4 h-4 mt-1 flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {row.cells.map((cell, cellIdx) => (
                      <div key={cellIdx}>
                        <div className="text-xs font-semibold text-gray-600 mb-0.5">
                          {headers[cellIdx]}
                        </div>
                        <div className="text-gray-900 break-words">
                          {cell}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {row.actions && (
                  <div className="flex gap-1 flex-shrink-0">
                    {row.actions}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  // Layout tabela para desktop
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            {showCheckbox && (
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.size === rows.length && rows.length > 0}
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                  className="w-4 h-4"
                />
              </th>
            )}
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-3 text-left font-semibold text-gray-700"
              >
                {header}
              </th>
            ))}
            {/* Coluna de ações */}
            <th className="px-4 py-3 text-left font-semibold text-gray-700">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length + (showCheckbox ? 2 : 1)}
                className="px-4 py-8 text-center text-gray-500"
              >
                Nenhum item cadastrado
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {showCheckbox && (
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(row.id)}
                      onChange={() => onSelect?.(row.id)}
                      className="w-4 h-4"
                    />
                  </td>
                )}
                {row.cells.map((cell, idx) => (
                  <td key={idx} className="px-4 py-4 text-gray-900">
                    {cell}
                  </td>
                ))}
                <td className="px-4 py-4 flex gap-2 items-center flex-wrap">
                  {row.actions}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
