export class QueryFilterResult {

    Filter: {
        FilterString: string;
        FilterValues: any;
    }[] = [];

    OrderBy?:{
        OrderByString?: string;
        OrderByDirection?: "ASC" | "DESC";
    } | null;

    Pagination?:{
        Page?: number;
        PageSize?: number;
    } | null;
}