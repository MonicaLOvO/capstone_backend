import { QueryFilterResult } from "../model/QueryFilterResult";

export class RepositoryHelper {
  static generateFilter(queryParams: Record<string, string>, entityColumns: Map<string, { columnName: string, columnType: string }>): QueryFilterResult {
    const result = new QueryFilterResult();
    
    // Go through all the query params passed in
    for (const key in queryParams) {
      // Check if the key is a valid query param
      switch (key) {
        // Pagination
        case "Page":
          if (!isNaN(Number(queryParams[key]))) {
            if (result.Pagination) {
              result.Pagination.Page = Number(queryParams[key]);
            }
            else {
              result.Pagination = {
                Page: Number(queryParams[key]),
                PageSize: 10
              };
            }
          }
          break;
        case "PageSize":
          if (!isNaN(Number(queryParams[key]))) {
            if (result.Pagination) {
              result.Pagination.PageSize = Number(queryParams[key]);
            }
            else {
              result.Pagination = {
                PageSize: Number(queryParams[key]),
                Page: 1
              };
            }
          }
          break;
        // Order by
        case "OrderColumn":
          if (!queryParams[key] || queryParams[key].length === 0) {
            continue;
          }
          const columnName = entityColumns.get(queryParams[key] ?? "");
          if (!columnName) {
            continue;
          }
          if (result.OrderBy) {
            result.OrderBy.OrderByString = columnName.columnName;
          }
          else {
            result.OrderBy = {
              OrderByString: columnName.columnName,
              OrderByDirection: "ASC"
            };
          }
          break;
        case "OrderDirection":
          let orderDirection: "ASC" | "DESC" = "ASC";
          if (queryParams[key] && queryParams[key].length > 0) {
            orderDirection = queryParams[key].toUpperCase() === "ASC".toUpperCase() ? "ASC" : "DESC";
          }
          if (result.OrderBy) {
            result.OrderBy.OrderByDirection = orderDirection;
          }
          else {
            result.OrderBy = {
              OrderByDirection: orderDirection
            };
          }
          break;

        // Table column filter
        default:
          // If the key value contains data
          if (queryParams[key] && queryParams[key].length > 0) {
            const column = entityColumns.get(key ?? "");
            if (!column) {
              continue;
            }

            if (column.columnType === "string" || column.columnType === "enum") {
              result.Filter.push({
                FilterString: `${column.columnName} LIKE :${column.columnName}`,
                FilterValues: {
                  [column.columnName]: `%${queryParams[key]}%`
                }
              });
            }
            else if (column.columnType === "number") {
              const value = queryParams[key].split(",");
              if (value.length > 1) {
                result.Filter.push({
                  FilterString: `${column.columnName} >= :${column.columnName}`,
                  FilterValues: {
                    [column.columnName]: Number(value[0])
                  }
                });
                result.Filter.push({
                  FilterString: `${column.columnName} <= :${column.columnName}`,
                  FilterValues: {
                    [column.columnName]: Number(value[1])
                  }
                });

              }
              else {
                result.Filter.push({
                  FilterString: `${column.columnName} = :${column.columnName}`,
                  FilterValues: {
                    [column.columnName]: Number(queryParams[key])
                  }
                });
              }
            }
            else if (column.columnType === "boolean") {
              result.Filter.push({
                FilterString: `${column.columnName} = :${column.columnName}`,
                FilterValues: {
                  [column.columnName]: Boolean(queryParams[key])
                }
              });
            }
            else if (column.columnType === "date") {
              const value = queryParams[key].split(",");
              if (value.length > 1 && value[0] && value[1]) {
                result.Filter.push({
                  FilterString: `${column.columnName} >= :${column.columnName}`,
                  FilterValues: {
                    [column.columnName]: new Date(value[0])
                  }
                });
                result.Filter.push({
                  FilterString: `${column.columnName} <= :${column.columnName}`,
                  FilterValues: {
                    [column.columnName]: new Date(value[1])
                  }
                });
              }
              else {
                result.Filter.push({
                  FilterString: `${column.columnName} = :${column.columnName}`,
                  FilterValues: {
                    [column.columnName]: new Date(queryParams[key])
                  }
                });
              }
            }
            else {
              continue;
            }
          }
      }

    }
    return result;
  }
}