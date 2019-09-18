import _ from "lodash";
import { RouterContext } from "koa-router";
import { IEnvelope, Feature } from "ginkgoch-geom";

export class FilterUtils {
    //#region field types
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
    //#endregion

    //#region fields
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
        let fieldsFilter = FilterUtils.parseFieldsFilter(ctx);
        fields = FilterUtils.applyFieldsFilter(fields, fieldsFilter);
        return fields;
    }
    //#endregion

    //#region features
    static parseFeaturesFilter(ctx: RouterContext): FeaturesFilter {
        // ?fields=[]&from=0&limit=10&envelope=-180,-90，180，90

        const filter: FeaturesFilter = {};
        if (ctx.query.fields !== undefined) {
            filter.fields = FilterUtils.parseFieldsFilter(ctx);
        }

        if (ctx.query.from !== undefined) {
            filter.from = parseInt(<string>ctx.query.from);
        }

        if (ctx.query.limit !== undefined) {
            filter.limit = parseInt(<string>ctx.query.limit);
        }

        if (ctx.query.envelope !== undefined) {
            const envelopeParams = (<string>ctx.query.envelope).split(',');
            if (envelopeParams.length === 4) {
                let [minx, miny, maxx, maxy] = envelopeParams.map(p => parseFloat(p));
                filter.envelope = { minx, miny, maxx, maxy };
            }
        }

        return filter;
    }

    static applyFeaturesFilter(features: Feature[], filter: FeaturesFilter): Feature[] {
        let from = 0;
        let limit = features.length;
        if (filter.from) {
            from = filter.from;
        }

        if (filter.limit) {
            limit = filter.limit;
        }
        
        features = _.chain(features).slice(from, from + limit).value();

        return features;
    }

    static applyPropertiesFilter(properties: Map<string, any>[], filter: FeaturesFilter) {
        let from = 0;
        let limit = properties.length;
        if (filter.from) {
            from = filter.from;
        }

        if (filter.limit) {
            limit = filter.limit;
        }

        properties = _.chain(properties).slice(from, from + limit).map(p => {
            const props: any = {};
            p.forEach((v, k) => props[k] = v);
            return props;
        }).value();

        return properties;
    }
    //#endregion
}

export interface FeaturesFilter {
    fields?: string[],
    from?: number,
    limit?: number,
    envelope?: IEnvelope
}