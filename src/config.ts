// Re-export of ConfigData in mykomap/index above seems not to work,
// so import it directly from here:
import { ConfigData } from  "mykomap/app/model/config-schema";
import type {
  PropDef
} from "mykomap/app/model/data-services";
import {
  mkObjTransformer,
  Transforms as T,
} from "mykomap/obj-transformer";
import * as versions from "./version.json";

import about from "./about.html";
//import { getPopup } from './popup'; // Uncomment if custom popup needed
import { InitiativeObj } from "mykomap/src/map-app/app/model/initiative";

type Row = Record<string, string|null|undefined>;
const baseUri = 'https://hackney.gov.uk/licensing/';

const licenceTypeIndex: Record<string, string> = {
  '257 HMO': 'lic:257hmo',
  'Additional HMO licence': 'lic:additionalHmo',
  'Mandatory HMO licence': 'lic:mandatoryHmo',
  'Selective licence': 'lic:selective',
};

const rowToObj = mkObjTransformer<Row, InitiativeObj>({
  uri: T.prefixed(baseUri).from('property_id'),
  name: T.text('').from('address'),
  address: T.text('').from('address'),
  lat: T.nullable.number(null).from('latitude'),
  lng: T.nullable.number(null).from('longitude'),
  description: T.text('').from('licence_type'),
  postcode: T.text('').from('postcode'),
  licenceHolder: T.text('').from('licence_holder_name'),
  licenceRef: T.text('').from('licence_reference_number'),
  managingAgent: T.text('').from('managing_agent_name'),
  licenceType: T.lookup({ index: licenceTypeIndex, default: '' }).from('licence_type'),
});


type Dictionary<T> = Partial<Record<string, T>>;
type FieldsDef = Dictionary<PropDef | 'value' >;
const fields: FieldsDef = {
  description: 'value',
  address: 'value',
  postcode: 'value',
  licenceHolder: 'value',
  licenceRef: 'value',
  managingAgent: 'value',
  licenceType: {
    type: 'vocab',
    uri: 'lic:',
  },
};


export const config: ConfigData = new ConfigData({
  namedDatasets: ['hackney'],
  htmlTitle: 'Hackney Property Licensing',
  defaultLatLng: [51.545, -0.055],
  fields: fields,
  filterableFields: ['licenceType'],
  searchedFields: [
    'description',
    'address',
    'postcode',
    'licenceHolder',
  ],
  languages: ['EN'],
  language: 'EN',
  vocabularies: [
    {
      type: 'json',
      id: 'hackney-vocabs',
      label: 'Hackney Licensing Vocabs',
      url: 'vocabs.json',
    },
  ],
  dataSources: [
    {
      id: 'hackney-licensing',
      label: 'Hackney Licensing Data',
      type: 'csv',
      url: 'hackney.csv',
      transform: rowToObj,
    },
  ],
  showDatasetsPanel: false,
  showDirectoryPanel: true,
  aboutHtml: about,
//  customPopup: getPopup, // uncomment if custom popup wanted
  ...versions,
});
