var GraphQLService = require("montage/data/service/graphql-service").GraphQLService,
    Criteria = require("montage/core/criteria").Criteria,
    DataQuery = require("montage/data/model/data-query").DataQuery,
    DataService = require("montage/data/service/data-service").DataService,
    equal = require("fast-deep-equal/es6");

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

            value = deserializer.getProperty("adminAccessHost");
            if (value) {
                this.adminAccessHost = value;
            }
            return result;
        }
    },

    isUniquing: {
        value: true
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
        value: "/admin/api/2019-10/graphql.json"
    },

    _adminAccessHost: {
        value: undefined
    },

    adminAccessHost: {
        get: function() {
            if(!this._adminAccessHost) {
                this._adminAccessHost = "https://";
                this._adminAccessHost += this.storeName;
                this._adminAccessHost += ".myshopify.com";
                this._adminAccessHost += this.adminAccessURIFragment;
            }
            return this._adminAccessHost;
        },
        set: function(value) {
            this._adminAccessHost = value;
            this._adminAccessHost += this.adminAccessURIFragment;
        }
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
                case "Product": return "products";
                case "Service": return "products";
                case "Vendor": return "customers";
                default: return objectDescriptor.name.toLowerCase()+"s";
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
    mapDataQueryToRawServiceURL: {
        value: function (dataQuery) {
            var objectDescriptor = dataQuery.type;

            switch(objectDescriptor.name) {
                case "Collection": return this.storefrontAccessURI;
                case "Product": return this.storefrontAccessURI;
                case "Service": return this.storefrontAccessURI;
                case "Vendor": return this.adminAccessHost;
                case "Address": return this.adminAccessHost;
                default: return this.storefrontAccessURI;
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
    _customerQueryDefaultBody: {
        value: ")\
        {\
            id\
            firstName\
            lastName\
            email\
            phone\
            addresses(first:5){\
                  id\
                  name\
                  firstName\
                  lastName\
                  phone\
                  company\
                  address1\
                  address2\
                  city\
                  provinceCode\
                  zip\
                  country\
                  latitude\
                  longitude\
            }\
          metafields(namespace:\"phront\" first: 10) {\
            edges {\
              node {\
                id\
                namespace\
                key\
                value\
              }\
            }\
         }\
      }"
    },

    _allCustomerQuery: {
        value: {
            "query":`
                    query getCustomersWithCursor($batchSize: Int, $cursor: String)
                        {
                            customers(first:$batchSize, after:$cursor) {
                                pageInfo {
                                    hasNextPage
                                    hasPreviousPage
                                }
                                edges {
                                    cursor
                                    node {
                                    id
                                    firstName
                                    lastName
                                    email
                                    phone
                                    addresses {
                                        id
                                        name
                                        firstName
                                        lastName
                                        phone
                                        company
                                        address1
                                        address2
                                        city
                                        provinceCode
                                        zip
                                        country
                                        latitude
                                        longitude
                                    }
                                    tags
                                }
                            }
                        }
                    }`,
            "variables": {
                "batchSize": 90,
                "cursor": null
            }
        }
    },
    
    //Passing stream is needed to accesss a current cursor
    mapDataQueryToRawDataQuery: {
        value: function (dataQuery, stream) {

            var typeName = this.mapObjectDescriptorToRawDataType(dataQuery.type),
                criteria = dataQuery.criteria,
                parameters = criteria.parameters,
                syntax = criteria.syntax,
                rawQuery = "", rawQueryParts;


            if(typeName === "collections") {
                rawQuery = "{\
                    collections(first:5){\
                      edges{\
                        node{\
                          id\
                          title\
                          description\
                          descriptionHtml\
                          handle\
                          image {\
                            id\
                            altText\
                            originalSrc\
                            transformedSrc\
                          }\
                          products(first:170)   {\
                                edges{\
                                    node{\
                                        id\
                                        title\
                                        description\
                                        descriptionHtml\
                                        images(first:100) {\
                                            edges{\
                                                node{\
                                                    id\
                                                    altText\
                                                    originalSrc\
                                                    transformedSrc\
                                                }\
                                            }\
                                        }\
                                        vendor\
                                        variants(first:5){\
                                            edges{\
                                                node{\
                                                    id\
                                                    title\
                                                    price\
                                                    image {\
                                                        id\
                                                        altText\
                                                        originalSrc\
                                                        transformedSrc\
                                                    }\
                                                    product {\
                                                        id\
                                                    }\
                                                    availableForSale\
                                                    selectedOptions {\
                                                        name\
                                                        value\
                                                    }\
                                                    sku\
                                                    weight\
                                                    weightUnit\
                                                    presentmentPrices(first:1) {\
                                                        edges{\
                                                                node {\
                                                                    compareAtPrice {\
                                                                        amount\
                                                                        currencyCode\
                                                                    }\
                                                                    price {\
                                                                    amount\
                                                                    currencyCode\
                                                                }\
                                                        }\
                                                    }\
                                                }\
                                            }\
                                        }\
                                    }\
                                    metafields(first: 2) {\
                                        edges {\
                                          node {\
                                            id\
                                            namespace\
                                            key\
                                            value\
                                          }\
                                        }\
                                     }\
                                }\
                            }\
                          }\
                        }\
                      }\
                    }\
                  }";
            }
            else if(typeName === "customers" /* also vendor */) {
                //console.log("fetching customers");

                if(parameters) {
                    rawQuery = "query {\
                        customer(";
                    if(syntax && syntax.type === "equals") {
                        if(syntax.args[0].type === "property")  {
                            var property = syntax.args[0][1],
                                value;
                            if(syntax.args[1].type === "parameters") {
                                value = parameters;
                            }
                            rawQuery += "id:\"";
                            rawQuery+= value;
                            rawQuery+= "\"";
                        }
                    }
                    rawQuery += this._customerQueryDefaultBody;
                    rawQuery += "}";       
                } else {
                    //Request for all customers:
                    if(dataQuery.batchSize) {
                        this._allCustomerQuery.variables.batchSize = dataQuery.batchSize;
                    }

                    if(stream  && stream.operation && stream.operation.cursor) {
                        this._allCustomerQuery.variables.cursor = stream.operation.cursor;
                    }

                    rawQuery = JSON.stringify(this._allCustomerQuery);

                }

            }

            return rawQuery;
        }
    },

    //Crude / hard codede for now:
    _fetchRawDataBodyForQuery: {
        value: function (query) {
        }
    },


    __streamsByQuery: {
        value: undefined
    },

    _streamsByQuery: {
        get: function () {
            if(!this.__streamsByQuery) {
                this.__streamsByQuery = new Map();
            }
            return this.__streamsByQuery;
        }
    },

    _registerStreamForQuery: {
        value: function (stream, query) {
            var streamsByQuery = this._streamsByQuery,
                queryStreams = streamsByQuery.get(query),
                queryIterator,
                queryStreams,
                aQuery;

            if(queryStreams) {
                queryStreams.add(stream);
            }
            //We don't know about that query yet:
            else {
                //Iterate
                queryIterator = streamsByQuery.keys();
                while((aQuery = queryIterator.next().value)) {
                    if(equal(aQuery, query)) {
                        //Same query, we add the stream to it and share the array.
                        queryStreams = streamsByQuery.get(aQuery);
                        queryStreams.add(stream);
                        streamsByQuery.set(query,queryStreams);
                        break;
                    }
                }
                //No previous similar query found:
                if(!queryStreams) {
                    queryStreams = new Set();
                    queryStreams.add(stream);
                    streamsByQuery.set(query,queryStreams);
                }
            }
            return queryStreams;
        }
    },
    _unregisterStreamForQuery: {
        value: function (stream, query) {
            var streamsByQuery = this._streamsByQuery,
                queryStreams = streamsByQuery.get(query);

            if(queryStreams) {
                var index = queryStreams.indexOf(stream);
                if(index !== -1) {
                    queryStreams.splice(index,1);
                }
                streamsByQuery.delete(query);
            }

        }
    },

    /* 
    
    We really need to add the ability for a DataService to map 
    the actual property/expression of the actual records, limits, amount
    of object matching, pages, etc... without having to code it imperatively

    */

    fetchRawData: {
        value: function (stream) {
            var self = this,
                query = stream.query,
                objectDescriptor = query.type,
                criteria = stream.query.criteria,
                syntax = criteria.syntax,
                parameters = criteria.parameters,
                apiUrl = this.mapDataQueryToRawServiceURL(query),
                headers, body, types, sendCredentials,
                rawQueryString = this.mapDataQueryToRawDataQuery(query,stream),
                registeredStreams = this._registerStreamForQuery(stream,query);


                //The 2 current type of objects we're fetching by id, hard coded for now...
                if(objectDescriptor.name === "Vendor") {
                    var dataIdentifier;
                    if(parameters && syntax && syntax.type === "equals") {
                        if(syntax.args[0].type === "property")  {
                            var property = syntax.args[0].args[1].value,
                                value;
                            if(syntax.args[1].type === "parameters") {
                                value = parameters;
                            }

                            if(property === "id") {
                                dataIdentifier = this.dataIdentifierForTypePrimaryKey(objectDescriptor, value);
                            }
                        }
                    }

                    if(dataIdentifier) {
                        var rawData = this.snapshotForDataIdentifier(dataIdentifier);
                        if (rawData) {
                            //It's been fetched already
                            this.addRawData(stream, [rawData]);
                            return this.rawDataDone(stream);
                        }
                        else if(registeredStreams.size>1) {
                            //If there's a known stream for an identical query in flight, we'll piggyback on that:
                            var iterator = registeredStreams.values(),
                                rootStream = iterator.next().value;
                            
                            rootStream.then(function (data) {

                                for(var i=0, iResult;(iResult = data[i]); i++) {
                                    stream.addData(iResult);
                                }
                                stream.dataDone();
                            });
                            return;            
                        }
                    }
                }
                else if(objectDescriptor.name === "Address") {
                    var locationAddressIds = JSON.parse(parameters),
                        i=0, countI = locationAddressIds ? locationAddressIds.length : 0, iAddresdId, iDataIdentifier, iAddress,
                        addresses = [],
                        identifierCriteria = Criteria.withExpression("identifier == $identifier"),
                        identifierCriteriaSyntax = identifierCriteria.syntax;
                    for(;i<countI;i++) {
                        iAddresdId=locationAddressIds[i];
                        iDataIdentifier = this.dataIdentifierForTypePrimaryKey(objectDescriptor, iAddresdId);

                        //Addresses may not be created yet. So I either need a new parallele API to objectForDataIdentifier() that returns a promise when the object is registered, or try to tie it to the vendor's addresses.
                        // var identiferCriteria = (new Criteria()).initWithSyntax(identifierCriteriaSyntax,{identifier:iDataIdentifier}),
                        //     identifierQuery = DataQuery.withTypeAndCriteria(objectDescriptor,identiferCriteria),
                         //     identiferStream = this.rootService.fetchData(identifierQuery);
                        iAddress = this.rootService.objectForDataIdentifier(iDataIdentifier);
                        if(iAddress) {
                            addresses.push(iAddress);
                        }
                    }

                    console.log("fetching Addresses");
                    return;
                }

                //If there's a known stream for an identical query in flight, we'll piggyback on that:
                if(registeredStreams.size>1 && !stream.operation && !stream.operation.cursor) {
                    return;
                }
                
                
                //maxRecords=3
                //view=Main%20View

                //baseId: appZ6CEB0Bd9fn7gK
                //Base needs to be modelled to allow one airtable-service to be useful for multiple bases, 
                //Or multiple instances would be needed if one only deal with only one base.

                //API key: 736331d9c53cdbf7a06689853ba82262
                //Shared Secret: 07aeefeb0d3c94e3352700f02d063c77
                //Private applications authenticate with Shopify through basic HTTP authentication, using the URL format https://{apikey}:{password}@{hostname}/admin/api/{version}/{resource}.json
                headers = {
                    "Accept": "application/json"
                };

                if(rawQueryString.indexOf('{"query') === 0) {
                    headers["Content-Type"] = "application/json";
                }
                else {
                    headers["Content-Type"] = "application/graphql";
                }

                if(apiUrl !== this.adminAccessHost) {
                    headers[this.storefrontAccessTokenHeader] = this.storefrontAccessToken;
                }
                else {                    
                    headers[this.adminAccessTokenHeader] = this.adminAccessToken;
                }

                sendCredentials = false;
            
        
            //var fetchHttpRawDataCount = this._handleReadOperationCount++;              
            //console.time("Shopify fetchHttpRawData "+fetchHttpRawDataCount);
            return self.fetchHttpRawData(apiUrl, headers, rawQueryString, types, query, sendCredentials).then(
                function (result) {
                    //console.timeEnd("Shopify fetchHttpRawData "+fetchHttpRawDataCount);

                    if (result) {
                        if(result.errors) {
                            console.error(error);
                        }
                        else {
                            //We need to figure out what type is returned, and they could be nested, and nothing to do about the type of the query itself.
                            var data = result.data,
                                types = Object.keys(data),
                  i=0, countI = types.length, iType, iTypeValue, iEdges, iPageInfo, iCursor,
                                j=0, countJ, jNode, jCursor;

                            //#FIXME This is wasteful as we're slicing stream.data
                            //To dispacth the right array.
                            stream._lastBatchIndex = stream.data.length;
                            for(;(i<countI);i++) {
                                iType = types[i];
                                iTypeValue = data[iType];
                                if(iPageInfo = iTypeValue["pageInfo"]) {
                                    stream._hasNextPage = iPageInfo.hasNextPage;
                                    stream._hasPreviousPage = iPageInfo.hasPreviousPage;
                                }
                                //Reset the cursor for the type
                                iCursor = null;
                                if(iEdges = iTypeValue["edges"]) {
                                    countJ = iEdges.length;
                                    jRawData = [];
                                    for(j=0;(j<countJ);j++) {
                                        jNode = iEdges[j]["node"];
                                        //#DEBUG
                                        // if(iType === "customers") {
                                        //     console.log("--> Received Customer "+jNode.firstName+" "+jNode.lastName);
                                        // }
                                        jRawData.push(jNode);
                                    }

                                    jCursor = iEdges[j-1]["cursor"];
                                    if(jCursor) {
                                        stream._cursor = iCursor = jCursor;
                                    }

                                    self.addRawData(stream, jRawData);    
                                }
                                else {
                                    if(iTypeValue instanceof Array) {
                                        self.addRawData(stream, iTypeValue);   

                                    }
                                    else {
                                        self.addOneRawData(stream, iTypeValue);  
                                    }
                                }
                            }

                            if(query.doesBatchResult) {
                                self.rawDataBatchDone(stream);    
                            }
                            else {
                                self.rawDataDone(stream);    
                            }
                        }
                    }
            },function(error) {
                console.error(error);
            });
        }
    },

    _handleReadOperationCount: {
        value:0
      },
  
    handleReadOperation: {
        value: function(readOperation) {
          var stream = readOperation.referrer;//DataStream for now

            return this.fetchRawData(stream);

        }
    }  
    
});
