import _ from "lodash";
import { RouterContext } from "koa-router";

export class FilterUtils {
    static parseFieldTypesFilter(ctx: RouterContext): Array<string> {
        if (!ctx.query.types) {
            return [];
        }
        else {
            return (<string>ctx.query.types).split(',');
        }
    }

    static applyFieldTypesFilter(fields: any[], filter: string[]) {
        if (filter.length > 0) {
            fields = fields.filter(f => _.includes(filter, f.type.toLowerCase()));
        }
        return fields;
    }

    static applyFieldTypesFilterFromContext(fields: any[], ctx: RouterContext): any[] {
        const filter = this.parseFieldTypesFilter(ctx).map(type => type.toLowerCase());
        fields = this.applyFieldTypesFilter(fields, filter);
        return fields;
    }
    
    static parseFieldsFilter(ctx: RouterContext): Array<string> {
        if (!ctx.query.fields) {
            return [];
        }
        else {
            return (<string>ctx.query.fields).split(',');
        }
    }

    static applyFieldsFilter(fields: any[], filter: string[]) {
        if (filter.length > 0) {
            fields = fields.map(f => _.pick(f, filter))
        }

        return fields;
    }

    static applyFieldsFilterFromContext(fields: any[], ctx: RouterContext): any[] {
        let fieldsFilter =  FilterUtils.parseFieldsFilter(ctx);
        fields = FilterUtils.applyFieldsFilter(fields, fieldsFilter);
        return fields;
    }
}