import React from "react";
import { motion } from "framer-motion";
import type { ReportEntity } from "../../../api/Admin/Report/report.type";

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  center?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

const ReportDataTable = <T extends ReportEntity>({
  data,
  columns,
}: DataTableProps<T>) => {
  return (
    <div className="overflow-x-auto overflow-y-hidden bg-white dark:bg-[#1a1a1c] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <table className="w-full table-fixed text-left text-sm text-gray-900 dark:text-white">
        <thead className="bg-gray-50 dark:bg-[#2c2c2c] text-base font-semibold h-16">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`p-4 ${column.center ? "text-center" : ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`border-t border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#2c2c2c]`}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`p-4 ${column.center ? "text-center" : ""} ${
                    column.key === "userId" || column.key === "target"
                      ? "truncate"
                      : ""
                  }`}
                >
                  {column.render(item)}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportDataTable;
