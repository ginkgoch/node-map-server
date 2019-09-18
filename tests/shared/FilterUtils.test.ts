import { FilterUtils } from "../../src/shared";
import _ from "lodash";

describe('FilterUtils', () => {
    it('apply field types filter', () => {
        let filteredFields = FilterUtils.applyFieldTypesFilter(fieldsJSON, []);
        expect(filteredFields.length).toBe(15);

        filteredFields = FilterUtils.applyFieldTypesFilter(fieldsJSON, ['number']);
        expect(filteredFields.length).toBe(4);

        filteredFields = FilterUtils.applyFieldTypesFilter(fieldsJSON, ['number', 'character']);
        expect(filteredFields.length).toBe(15);
    });

    it('apply fields filter', () => {
        let filteredFields = FilterUtils.applyFieldsFilter(fieldsJSON, ['name', 'type']);
        expect(_.every(filteredFields, f => f.name !== undefined && f.type !== undefined && f.length === undefined && f.extra === undefined)).toBeTruthy();
    });
});

const fieldsJSON = [{"name":"FIPS_CNTRY","type":"character","length":2,"extra":{"decimal":0}},{"name":"GMI_CNTRY","type":"character","length":3,"extra":{"decimal":0}},{"name":"ISO_2DIGIT","type":"character","length":2,"extra":{"decimal":0}},{"name":"ISO_3DIGIT","type":"character","length":3,"extra":{"decimal":0}},{"name":"CNTRY_NAME","type":"character","length":40,"extra":{"decimal":0}},{"name":"LONG_NAME","type":"character","length":40,"extra":{"decimal":0}},{"name":"SOVEREIGN","type":"character","length":40,"extra":{"decimal":0}},{"name":"POP_CNTRY","type":"number","length":10,"extra":{"decimal":0}},{"name":"CURR_TYPE","type":"character","length":16,"extra":{"decimal":0}},{"name":"CURR_CODE","type":"character","length":4,"extra":{"decimal":0}},{"name":"LANDLOCKED","type":"character","length":1,"extra":{"decimal":0}},{"name":"SQKM","type":"number","length":12,"extra":{"decimal":2}},{"name":"SQMI","type":"number","length":12,"extra":{"decimal":2}},{"name":"COLOR_MAP","type":"character","length":1,"extra":{"decimal":0}},{"name":"RECID","type":"number","length":9,"extra":{"decimal":0}}];