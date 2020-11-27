describe('Demo Cypress API testing - Petstore - GET basics', () => {

  // simple requests and assertions

  // structure of response for the api request
  // https://petstore.swagger.io/v2/store/inventory
  //
  // response :
  // -- body :
  // ---- sold : <number>
  // ---- pending: <number>
  // ---- available : <number>
  // ---- ... : ...
  // -- duration : <ms>
  // -- headers : 
  // ---- date : <date>
  // ---- ... : ..
  // -- status : <statusCode>

  it('1a. GET - basic assertions - status', () => {
    // 3 calls
    cy.request('https://petstore.swagger.io/v2/store/inventory')
      .should('have.property', 'status')      // assert response has prop status
      .should('eq', 200)                      // status should equal 200

    cy.request('https://petstore.swagger.io/v2/store/inventory')
      .should('have.property', 'status', 200) // first 2 combined

    cy.request('https://petstore.swagger.io/v2/store/inventory')
      .its('status')
      .should('eq', 200)        // first 2 combined
  })

  it.skip('1b. GET - basic assertions - wrong status - FAILS', () => {
    // remove .skip to run this test case
    // next call is asserting on another status than is returned
    // assertion will fail
    cy.request('https://petstore.swagger.io/v2/store/inventory')
      .its('status')
      .should('eq', 201)        // FAIL!!
  })

  var inventory = 77    // variables can be used to assert
  
  it('2a. GET - basic assertions - body', () => {
    cy.request('https://petstore.swagger.io/v2/store/inventory')
      .should('have.property', 'body')
      .should('not.be.null')

    cy.request('https://petstore.swagger.io/v2/store/inventory')
      .its('body')
      .should('not.be.null')

    // next 2 calls assert on having nested property body.sold
    cy.request('https://petstore.swagger.io/v2/store/inventory')
      .its('body')                      
      .should('have.property', 'sold')  // nested property body.sold

    cy.request('https://petstore.swagger.io/v2/store/inventory')
      .should('have.property', 'body')  
      .should('have.property', 'sold')  // nested property body.sold

    // next 2 calls assert on having nested property body.sold matching the <inventory>
    cy.request('https://petstore.swagger.io/v2/store/inventory')
      .should('have.property', 'body')  
      .should('have.property', 'sold')  // nested property body.sold  
      // .should('eq', 27)                 // should equal <inventory>
      .should('eq', inventory)          // should equal <inventory>

    cy.request('https://petstore.swagger.io/v2/store/inventory')
      .should('have.property', 'body')  
      // .should('have.property', 'sold', 27) // combined: nested property body.sold should equal <inventory>
      .should('have.property', 'sold', inventory) // combined: nested property body.sold should equal <inventory>
  })

  it.skip('2b. GET - basic assertions - body 1 PASS + 1 FAIL', () => {
    // remove .skip to run this test case
    // next 2 calls assert on body.sold matching the <inventory>
    // 1st one passes
    // 2nd one fails
    cy.request('https://petstore.swagger.io/v2/store/inventory')
      .its('body.sold')   // works like this: property.nested-property
      .should('eq', inventory)

    cy.request('https://petstore.swagger.io/v2/store/inventory')
      // nested property can NOT be asserted together with parent property
      .should('have.property', 'body.sold')   // FAIL!!
      .should('eq', inventory)
  })

  it('3a. GET - basic assertions - duration', () => {
    cy.request('https://petstore.swagger.io/v2/store/inventory')
      .should('have.property', 'duration')
      .should('lt', 110)   // assert duration <= xxx ms, e.g. for simple performance assertions
  })

  it('3b. GET - basic assertions - duration incl retries', {retries: 2}, () => {   // 1 try + max 2 retries
    cy.request('https://petstore.swagger.io/v2/store/inventory')
      .should('have.property', 'duration')
      .should('lt', 110)   // assert duration <= xxx ms, e.g. for simple performance assertions
      // can be combined with retries in cypress.json for all tests
      // or for one specific test in its config: "retries": 2
  })
      
  it('4. GET - more readable calls', () => {
    // 4 API calls which end up in the same request url
    // Request URL: "https://petstore.swagger.io/v2/store/inventory"
    
    // 1) complete url
    cy.request('https://petstore.swagger.io/v2/store/inventory')  

    // 2) based upon config in cypress.json: "baseUrl":  "https://petstore.swagger.io/v2"
    cy.request('/store/inventory')                                

    // 3) including method for more clarity on what method is actually called
    // some API calls have look-alikes, e.g.: GET /pet/{petId} ; POST /pet/{petId} ; DELETE /pet/{petId}
    cy.request('GET', '/store/inventory')

    // 4) split into method and url (and qs or body)
    cy.request({                                                  
      method: 'GET',
      url:    '/store/inventory'
    })

      .its('body')
      .should('have.property', 'sold')
      // next assert will fail like previous; doesn't work like this, use callback instead
      // .and.should('have.property', 'pending')      
  })

  it('5. GET - callback and assertions', () => {
    // use callback function to use the response
    // for assertions on multiple properties
    cy.request({                                                  
      method: 'GET',
      url:    '/store/inventory'
    })
      .then(response => {     // callback makes 'response' available for further actions         
        cy.log(response.body)        

        // basic assertions for all requests
        expect(response.status).to.eql(200)                   // assert status
        expect(response.body).to.not.be.null                  // assert body

        var inventoryPending  = 64
        var inventorySold     = 72
        // assertion of hardcoded status and inventory
        expect(response.body).to.have.property('pending', inventoryPending) // assert body.pending
        expect(response.body.pending).to.eql(inventoryPending)              // assert body.pending

        expect(response.body).to.have.property('sold', inventorySold)    // assert body.sold
        expect(response.body.sold).to.eql(inventorySold)                 // assert body.sold

        // optional: write to file if you want to assert or use the response later
        // cypress/fixtures folder is the default location to have test data
        cy.writeFile('Cypress/fixtures/responseInventory.json', response.body)
      })
  })
})  