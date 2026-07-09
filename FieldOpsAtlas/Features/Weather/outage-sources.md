# Electricity Outage Sources

Generated outage data is published to `FieldOpsAtlas/Features/Weather/data/outages/`.

| Provider ID | Provider | Source used by collector | Coverage |
| --- | --- | --- | --- |
| `ukpn` | UK Power Networks | OpenDataSoft dataset `ukpn-live-faults` from `ukpowernetworks.opendatasoft.com` | Current and planned rows exposed by UKPN |
| `npg` | Northern Powergrid | OpenDataSoft dataset `live-power-cuts-data` from `northernpowergrid.opendatasoft.com` | Current and planned rows exposed by NPG |
| `nged` | National Grid Electricity Distribution | CKAN datastore resource `292f788f-4339-455b-8cc0-153e14509d4d` from `connecteddata.nationalgrid.co.uk` | Current incidents |
| `enwl` | Electricity North West | Public ENWL site API `https://www.enwl.co.uk/api/power-outages/search` | Current, today's planned and future planned outages |
| `ssen` | SSEN Distribution | Public SSEN JSON endpoint `https://external.distribution.prd.ssen.co.uk/opendataportal-prd/v4/api/getallfaults` | Current incidents |
| `spen` | SP Energy Networks | Public SPEN Salesforce LWR Apex endpoint plus `postcodes.io` postcode lookup fallback | Current, planned and restored SPEN incidents |
| `nie` | NIE Networks | Public PowerCheck API `https://powercheck.nienetworks.co.uk/NIEPowerCheckerWebAPI/api/faults` | Current faults and planned interruptions available in PowerCheck |

Provider status is written to `status.json` using `live`, `stale`, `unavailable`, `authentication required`, or `source failure`. Last-good GeoJSON is preserved only when a live provider source fails.
