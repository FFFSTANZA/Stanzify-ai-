import { BaseSlide, BaseSlideProps } from './BaseSlide';

export interface TableSlideProps extends Omit<BaseSlideProps, 'children'> {
  title?: string;
  headers: string[];
  rows: string[][];
  highlightFirstColumn?: boolean;
  highlightFirstRow?: boolean;
}

export function TableSlide({
  title,
  headers,
  rows,
  highlightFirstColumn = false,
  highlightFirstRow = false,
  ...baseProps
}: TableSlideProps) {
  return (
    <BaseSlide {...baseProps} align="center" verticalAlign="center">
      {title && (
        <h1 
          className="text-5xl font-bold mb-12 text-center"
          style={{ color: baseProps.palette?.primary }}
        >
          {title}
        </h1>
      )}
      <div className="max-w-6xl mx-auto overflow-auto">
        <table className="w-full bg-white rounded-xl shadow-xl overflow-hidden">
          <thead>
            <tr style={{ backgroundColor: baseProps.palette?.primary }}>
              {headers.map((header, index) => (
                <th 
                  key={index}
                  className="px-6 py-4 text-left text-white font-bold text-lg"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className={`${
                  rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } ${highlightFirstRow && rowIndex === 0 ? 'font-bold' : ''} animate-in fade-in slide-in-from-bottom-2 duration-500`}
                style={{ animationDelay: `${rowIndex * 100}ms` }}
              >
                {row.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex}
                    className={`px-6 py-4 ${
                      (highlightFirstColumn && cellIndex === 0) || (highlightFirstRow && rowIndex === 0)
                        ? 'font-bold'
                        : ''
                    }`}
                    style={{
                      color: (highlightFirstColumn && cellIndex === 0) 
                        ? baseProps.palette?.secondary 
                        : undefined
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BaseSlide>
  );
}
