var GraphQLService = require("montage/data/service/graphql-service").GraphQLService,
    DataService = require("montage/data/service/data-service").DataService;
    //Client =  require("shopify-buy").Client;
    //Client =  require("shopify-buy").Client;

// var client = Client.buildClient({
//   domain: 'etiama.myshopify.com',
//   storefrontAccessToken: 'f709c6b5f736fc92f4b5b3d6e48aff67'
// });

require("montage/core/extras/string");

    //Tweet = require('logic/model/tweet').Tweet;

//var Connection = require("logic/service/twitter-service-connection.json");
    // Replace the above with the following to load mock data
// var  Connection = require("logic/service/twitter-service-connection.mock.json");

// var deserializeSelfCount = 0;
/**
 * Provides data for applications.
 *
 * @class
 * @link https://dev.twitter.com/rest/
 * @extends external:DataService
 */
exports.ShopifyService = exports.ShopifyService = GraphQLService.specialize(/** @lends AirtableService.prototype */ {

    /***************************************************************************
     * Serialization
     */

    deserializeSelf: {
        value: function (deserializer) {
            var value, result;
            // console.log("AirtableService super deserialize #"+deserializeSelfCount);
            result = this.super(deserializer);
            // console.log("AirtableService super deserialize #"+deserializeSelfCount++);

            value = deserializer.getProperty("storeName");
            if (value) {
                this.storeName = value.toLowerCase();
            }
            
            value = deserializer.getProperty("storefrontAccessToken");
            if (value) {
                this.storefrontAccessToken = value;
            }
            value = deserializer.getProperty("adminAccessToken");
            if (value) {
                this.adminAccessToken = value;
            }
            return result;
        }
    },


    _fetchSensorDetectionRawData: {
        value: function (stream) {
            var query = stream.query,
                criteria = query.criteria,
                parameters = criteria.parameters,
                rawData = parameters.rawData || [];

            this.addRawData(stream, rawData);
            this.rawDataDone(stream);
        }
    },

    storeName: {
        value: undefined
    },

    //This is per app
    storefrontAccessToken: {
        value: undefined
    },
    storefrontAccessTokenHeader: {
        value: "X-Shopify-Storefront-Access-Token"
    },
    storefrontAccessURIFragment: {
        value: ".myshopify.com/api/graphql"
    },

    //This is per app
    adminAccessToken: {
        value: undefined
    },
    adminAccessTokenHeader: {
        value: "X-Shopify-Access-Token"
    },

    adminAccessURIFragment: {
        value: ".myshopify.com/admin/api/graphql.json"
    },
    _adminAccessURI: {
        value: undefined
    },

    adminAccessURI: {
        get: function() {
            if(!this._adminAccessURI) {
                this._adminAccessURI = "https://";
                this._adminAccessURI += this.storeName;
                this._adminAccessURI += this.adminAccessURIFragment;
            }
            return this._adminAccessURI;
        }
    },

    baseId: {
        value: "appZ6CEB0Bd9fn7gK"
    },


    _storefrontAccessURI: {
        value: undefined
    },

    storefrontAccessURI: {
        get: function() {
            if(!this._storefrontAccessURI) {
                this._storefrontAccessURI = "https://";
                this._storefrontAccessURI += this.storeName;
                this._storefrontAccessURI += this.storefrontAccessURIFragment;
            }
            return this._storefrontAccessURI;
        }
    },

    _authorizedBaseURI: {
        value: undefined
    },
    authorizedBaseURI: {
        get: function() {
            return this._authorizedBaseURI || (this._authorizedBaseURI = this.baseURI+this.baseId);
        }
    },

    authorizationPolicy: {
        value: DataService.AuthorizationPolicy.NONE
    },

    providesAuthorization: {
        value: false
    },

    //value: ["./twitter-authorization-service"]
    authorizationServices: {
        value: []
    },

    authorizationManagerWillAuthorizeWithService: {
        value: function (authorizationManager, authorizationService) {
            authorizationService.connectionDescriptor = this.authorizationDescriptor;
        }
    },

    setHeadersForQuery: {
        value: function (headers, query) {
            var authorization = this.authorization;

            if (authorization && authorization.length) {
                headers['authorization-token'] = authorization[0].token;
                headers['authorization-secret'] = authorization[0].secret;
            }
        }
    },

    /**
     * Public method invoked by the framework when executing data operations 
     * Designed to be overriden by concrete RawDataServices to allow fine-graine control
     * when needed, beyond transformations offered by an ObjectDescriptorDataOperationMapping (generalization of rest-mapping)
     *
     * @method
     * @argument {Object} object - An ObjectDescriptor part of what the application is using.
     * @return {String}

     */
    mapObjectDescriptorToRawDataType: {
        value: function (objectDescriptor) {
            switch(objectDescriptor.name) {
                case "Product": return "Product";
                default: return objectDescriptor.name+"s";
            }
        }
    },

    _RECORD_ID: {
        value: "RECORD_ID()"
    },

    /**
     * Public method invoked by the framework when executing data operations 
     * Designed to be overriden by concrete RawDataServices to allow fine-graine control
     * when needed, beyond transformations offered by an ObjectDescriptorDataOperationMapping (generalization of rest-mapping)
     *
     * @method
     * @argument {DataQuery} dataQuery - An ObjectDescriptor part of what the application is using.
     * @return {String}

     */
    mapDataQueryToRawDataQuery: {
        value: function (dataQuery) {

            var criteria = dataQuery.criteria,
                parameters = criteria.parameters,
                syntax = criteria.syntax,
                rawQuery = "filterByFormula=", rawQueryParts;

            if(parameters && syntax && syntax.type === "has") {
                if(syntax.args[1].type === "property") {
                    /*
                    Shortcut assuming it's not a more complex expression, this needs to be re-written right.
                    We're building something like this:
                    curl "https://api.airtable.com/v0/appZ6CEB0Bd9fn7gK/Vendors?
                    
                    filterByFormula=OR(RECORD_ID()='recMRaSDIQ7DSKNvo',RECORD_ID()='recj69NKZshWar4m8')" \
                    -H "Authorization: Bearer keypOR745TkuhvJBV"
                    */
                    var property = syntax.args[1].args[1].value,
                        i=0, countI=parameters.length, iValue,
                        RECORD_ID = this._RECORD_ID;


                        rawQueryParts = "";

                        for(i=0, countI=parameters.length;(i<countI);i++) {
                            if(i>0) {
                                rawQueryParts+=",";
                            }
                            rawQueryParts+= (property === "id"
                                                ? RECORD_ID
                                                : property);
                            rawQueryParts+="=";
                            //Here we'll need a generic system to format a value based on it's type.
                            //I'm tarting to think that it might work to use expression mappings for that as well
                            //A converter with the expresion '$' and the string being the scope would do it.
                            iValue = parameters[i];
                            rawQueryParts+=(typeof iValue === "string") ? "'" : "";
                            rawQueryParts+=parameters[i];
                            rawQueryParts+=(typeof iValue === "string") ? "'" : "";
                        }
                    if(countI > 1) {

                        rawQuery += "OR(";
                        rawQuery += rawQueryParts;
                        rawQuery += ")";
                    }
                    else if(countI === 1) {
                        rawQuery += rawQueryParts;
                    }
                }

            }
            return rawQuery;
        }
    },

    /*

function runAction(base, method, path, queryParams, bodyData, callback) {
    var url = base._airtable._endpointUrl + '/v' + base._airtable._apiVersionMajor + '/' + base._id + path + '?' + objectToQueryParamString(queryParams);

    var headers = {
        'authorization': 'Bearer ' + base._airtable._apiKey,
        'x-api-version': base._airtable._apiVersion,
        'x-airtable-application-id': base.getId(),
    };

    var userAgent = 'Airtable.js/' + "0.5.7";
    var isBrowser = typeof window !== 'undefined';
    // Some browsers do not allow overriding the user agent.
    // https://github.com/Airtable/airtable.js/issues/52
    if (isBrowser) {
        headers['x-airtable-user-agent'] = userAgent;
    } else {
        headers['User-Agent'] = userAgent;
    }


    var options = {
        method: method.toUpperCase(),
        url: url,
        json: true,
        timeout: base._airtable.requestTimeout,
        headers: headers,
        // agentOptions are ignored when running in the browser.
        agentOptions: {
            rejectUnauthorized: base._airtable._allowUnauthorizedSsl
        },
    };

    if (bodyData !== null) {
        options.body = bodyData;
    }

    request(options, function(error, resp, body) {
        if (error) {
            callback(error, resp, body);
            return;
        }

        if (resp.statusCode === 429 && !base._airtable._noRetryIfRateLimited) {
            setTimeout(function() {
                runAction(base, method, path, queryParams, bodyData, callback);
            }, internalConfig.RETRY_DELAY_IF_RATE_LIMITED);
            return;
        }

        error = base._checkStatusForError(resp.statusCode, body);
        callback(error, resp, body);
    });
}

    */


    /** 
     * 
     * 
     * $ curl "https://api.airtable.com/v0/appZ6CEB0Bd9fn7gK/Product?maxRecords=3&view=Main%20View" \
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * Get objects from a relationship.
     * 
     * curl "https://api.airtable.com/v0/appZ6CEB0Bd9fn7gK/Vendors?OR(id=rec8116cdd76088af,id=rec245db9343f55e8,id=rec4f3bade67ff565)" \
  -H "Authorization: Bearer keypOR745TkuhvJBV"

    */

    /* 
    
    We really need to add the ability for a DataService to map 
    the actual property/expression of the actual records, limits, amount
    of object matching, pages, etc... without having to code it imperatively

    */

    fetchRawData: {
        value: function (stream) {
            var self = this,
                query = stream.query,
                criteria = stream.query.criteria,
                parameters = criteria.parameters,
                type = this.mapObjectDescriptorToRawDataType(query.type),
                apiUrl = this.storefrontAccessURI,
                headers, body, types, sendCredentials,
                rawQueryString = this.mapDataQueryToRawDataQuery(query),
                body = "{\
                    collections(first:5){\
                      edges{\
                        node{\
                          id\
                          title\
                          description\
                          descriptionHtml\
                          handle\
                          image {\
                            altText\
                            originalSrc\
                            transformedSrc\
                          }\
                          products(first:100) {\
                                edges{\
                                node{\
                                id\
                                title\
                                description\
                                  descriptionHtml\
                              }\
                            }\
                          }\
                        }\
                      }\
                    }\
                  }"

                
                //maxRecords=3
                //view=Main%20View

                //baseId: appZ6CEB0Bd9fn7gK
                //Base needs to be modelled to allow one airtable-service to be useful for multiple bases, 
                //Or multiple instances would be needed if one only deal with only one base.

                //API key: 736331d9c53cdbf7a06689853ba82262
                //Shared Secret: 07aeefeb0d3c94e3352700f02d063c77
                //Private applications authenticate with Shopify through basic HTTP authentication, using the URL format https://{apikey}:{password}@{hostname}/admin/api/{version}/{resource}.json
                headers = {
                    "Content-Type": "application/graphql",
                    "Accept": "application/json"
                };
                headers[this.storefrontAccessTokenHeader] = this.storefrontAccessToken,

                sendCredentials = false;
            
        
            return self.fetchHttpRawData(apiUrl, headers, body, types, query, sendCredentials).then(
                function (result) {
                    if (result) {
                        if(result.errors) {

                        }
                        else {
                            //We need to figure out what type is returned, and they could be nested, and nothing to do about the type of the query itself.
                            var data = result.data,
                                types = Object.keys(data),
                                i=0, countI = types.length, iType, iEdges, 
                                j=0, countJ, jNodes;

                            for(;(i<countI);i++) {
                                iType = types[i];
                                iEdges = data[iType]["edges"];
                                countJ = iEdges.length;
                                jRawData = [];
                                for(j=0;(j<countJ);j++) {
                                    jNode = iEdges[j]["node"];
                                    jRawData.push(jNode);
                                }
                                self.addRawData(stream, jRawData);

                            }

                            self.rawDataDone(stream);    
                        }
                    }
            });
        }
    }
    /*
    ,

    mapRawDataToObject: {
        value: function (rawData, object) {
            object.id = rawData.id;
            object.text = rawData.text;
            object.created_at = rawData.created_at;
            object.user = {
                name: rawData.user.name
            };
        }
    }
*/
});
