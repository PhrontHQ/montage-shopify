// import { GraphQLClient } from 'graphql-request'
const { GraphQLClient } = require('graphql-request');
const endpoint = `https://etiama.myshopify.com/admin/api/2019-07/graphql.json`;
const graphQLClient = new GraphQLClient(endpoint,{
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Shopify-Access-Token": "d4d9799d167b2ab209f7f0952abd8c6f",
    'X-GraphQL-Cost-Include-Fields': "true"
  }});
const vendorQueryPrefix = "vendor:";  

async function productsWithVendorName(vendorName, cursor) {

  const getProductWithVendorNameQuery = `
  query getProductsWithVendorNameCursor($vendorCriteria: String, $productBatchSize: Int, $cursor: String)
  {
      products(query:$vendorCriteria first:$productBatchSize after:$cursor) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
      edges{
          cursor
            node{
              id
              title
              description
              descriptionHtml
              tags
              vendor
              metafields(namespace:"phront" first: 50) {
                edges {
                  node {
                    id
                    namespace
                    key
                    value
                  }
                }
            }
          }
        }		
    }
  }
  `;

  let vendorCriteria = vendorQueryPrefix;
  vendorCriteria+=vendorName;

  let queryVariables = {
    "vendorCriteria": vendorCriteria,
    "productBatchSize": 10
  };

  if(cursor) {
    queryVariables["cursor"] = cursor;
  }

  return graphQLClient.request(getProductWithVendorNameQuery,queryVariables);

}

var metafieldProcessingQueue = [],
metafieldProcessingInterval;

async function _processMetafield(inputVariable) {
  //Set the vendor in metafield
  const setProductMetaField = `
  mutation($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        metafields(first: 100) {
          edges {
            node {
              id
              namespace
              key
              value
            }
          }
        }
      }
    }
  }`;``
  console.log("setProductMetaField with inputVariable ",inputVariable);
  let setMetafieldsResponse = await graphQLClient.request(setProductMetaField,inputVariable).catch(error => console.error(error));
  //console.log("setMetafieldsResponse is ",setMetafieldsResponse);

}

async function connectProductToVendorAndAddresses(product, vendor) {


  const setProductMetaFieldVariable = {
    "input": {
      "id": "gid://shopify/Product/3984389537895",
      "metafields": []
    }
  },
  MetaFieldVariable = {
    "namespace": "phront",
    "key": "aKey",
    "value": "aValue",
    "valueType": "STRING"
  };

  let vendorMetaFieldInputVariable = { 
    "input": {
      "metafields": []
    }
  },
    locationsMetaFieldInputVariable;

  vendorMetaFieldInputVariable.input.id = product.id;

  //look for an existing metafield, as they can on;y be updated by providing their id:
  let productMetafields = product.metafields.edges,
      vendorMetaFieldVariable, locationsMetaFieldVariable,
      m = 0, countM = productMetafields ? productMetafields.length : 0, mField;
  
  for(;m<countM;m++) {
    mField = productMetafields[m].node;
    if(mField.key === "vendor") {
      vendorMetaFieldVariable = mField;
    }
    else if(mField.key === "locations") {
      locationsMetaFieldVariable = mField;
    }
  }

    if(!vendorMetaFieldVariable) {
    vendorMetaFieldVariable = {};
    Object.assign(vendorMetaFieldVariable,MetaFieldVariable);
  }

  vendorMetaFieldVariable.key = "vendor";
  vendorMetaFieldVariable.value = vendor.id;
  vendorMetaFieldVariable.valueType = "STRING";
  vendorMetaFieldInputVariable.input.metafields = [vendorMetaFieldVariable];

  processJobInQueue(vendorMetaFieldInputVariable, _processMetafield);
  


  //Set the array of addresses id 
  //At this time, no object has any location metafields which is why we're not checking.
  let addresses = vendor.addresses,
      i, countI, addressIds = [];


  for(i=0, countI = addresses.length;i<countI;i++) {
    addressIds.push(addresses[i].id);
  }

  if(addressIds.length > 0) {
    locationsMetaFieldInputVariable = { 
      "input": {
        "metafields": []
      }
    };

    locationsMetaFieldInputVariable.input.id = product.id;

    if(!locationsMetaFieldVariable) {
      locationsMetaFieldVariable = {};
      Object.assign(locationsMetaFieldVariable,MetaFieldVariable);
    }
  
    locationsMetaFieldVariable.key = "locations";
    locationsMetaFieldVariable.value = JSON.stringify(addressIds);
    locationsMetaFieldVariable.valueType = "JSON_STRING";
    locationsMetaFieldInputVariable.input.metafields = [locationsMetaFieldVariable];
  
    
    processJobInQueue(locationsMetaFieldInputVariable, _processMetafield);
  
  }


    return;
}


function _processJobInQueue() {

  jobProcessingTimeout = setTimeout(function() {
    console.log("<"+Date.now()+"> process Job In Queue");
    var job = jobProcessingQueue.shift();
    if(job) {
      job.processor(job.job);
    }
    if(jobProcessingTimeout) clearTimeout(jobProcessingTimeout);
    if(jobProcessingQueue.length > 0) {
      _processJobInQueue();
    }  
  },2000);
}


async function processJobInQueue(job, processor, queue, interval) {
  jobProcessingQueue.push({job:job, processor:processor, queue:queue, interval: interval});
  if(!jobProcessingTimeout) _processJobInQueue();
}

var jobProcessingQueue = [],
jobProcessingTimeout;


// async function processCustomer(iCustomer) {
//   customerProcessingQueue.push(iCustomer);

//   if(!customerProcessingInterval) {
//     customerProcessingInterval = setInterval(function() {
//       _processCustomer(customerProcessingQueue.shift());
//       if(customerProcessingQueue.length === 0) {
//         clearTimeout(customerProcessingInterval);
//         customerProcessingInterval = null;
//       }
//     },30000);  
//   }
// }

async function _processCustomer(iCustomer) {
  let vendorName1 = iCustomer.firstName + " " + iCustomer.lastName,
  addresses = iCustomer.addresses,
  companyProductResponse,
  vendorName1ProductResponse,
  companyProductEdges,
  vendorName1ProductEdges,
  productEdges = [],
  vendorName2;

  console.log('Processing customer:', vendorName1);

  if(addresses.length) {
      company = addresses[0].company;
    if(company && company !== vendorName1) {
      //console.log("company: ",company);
      companyProductResponse = await productsWithVendorName(company);
      companyProductEdges = companyProductResponse.products.edges;
    }

    if(companyProductEdges && companyProductEdges.length) {
      console.debug(companyProductEdges.length+" products found with vendor's value "+company);
      productEdges.push.apply(productEdges,companyProductEdges);
    }
    else {
      console.debug("0 products found with vendor's value "+company);
    }

  }



  //We're going to lookup products on vendorName1 and the company name in the address.    
  //console.log("vendorName1: ",vendorName1," cursor is ",customers[i].cursor);
  vendorName1ProductResponse = await productsWithVendorName(vendorName1);
  vendorName1ProductEdges = vendorName1ProductResponse.products.edges;

  if(vendorName1ProductEdges && vendorName1ProductEdges.length) {
    console.debug(vendorName1ProductEdges.length+" products found with vendor's value "+vendorName1);
    productEdges.push.apply(productEdges,vendorName1ProductEdges);
  }
  else {
    console.debug("0 products found with vendor's value "+vendorName1);
  }


  let j, countJ, jProductNode;

  console.debug("Processing "+productEdges.length+" products for "+vendorName1);

  if(productEdges && productEdges.length > 0) {
    for(j=0, countJ=productEdges.length;j<countJ;j++) {
      jProductNode = productEdges[j].node;
      console.log(vendorName1+": product["+j+"] is ",jProductNode.title); 
      connectProductToVendorAndAddresses(jProductNode, iCustomer);
    }  
  }

}

async function main() {
    //const endpoint = `https://${apikey}:${password}@${hostname}/admin/api/2019-07/graphql.json`


  const getCustomers = `
  query getCustomersWithCursor($customerBatchSize: Int, $customerAddressesBatchSize: Int, $cursor: String)
  {
    customers(first:$customerBatchSize, after:$cursor) {
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
                addresses(first:$customerAddressesBatchSize) {
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
        }
      }
    }
  }
`;
let queryVariables = {
  customerBatchSize: 50,
  customerAddressesBatchSize: 50
  };
  let customerResponse = await graphQLClient.request(getCustomers,queryVariables);
  console.log("customerResponse is ",customerResponse);

  let customers = customerResponse.customers.edges,
      i=0, countI = customers.length,
      pageInfo = customerResponse.customers.pageInfo;

  //console.log("customers is ",customers);

  while(i<countI) {
    let iCustomer = customers[i].node;

    //processCustomer(iCustomer);
    processJobInQueue(iCustomer, _processCustomer);

    if(i === countI-1 && pageInfo.hasNextPage) {
      queryVariables.cursor = customers[i].cursor;
      console.log("next batch of customers with variables:",queryVariables);
      customerResponse = await graphQLClient.request(getCustomers,queryVariables);
      customers = customerResponse.customers.edges;
      countI = customers.length;      
      i=0;
      pageInfo = customerResponse.customers.pageInfo;
    }
    else {
      i++;
    }

  }
}

main().catch(function(error) {
 console.error(error)
});