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

  // variables can be used to assert
  var inventory = 262   // adjust to actual current number to pass this test case
  
  it('2a. GET - basic assertions - body', () => {
  // test case will most likely fail initially because inventory will be different
  // in requests 5 thru 8
  // change number of above defined variable to actual inventory to pass this test case

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
    // when test case fails (response takes longer than 110 ms) you can retry manually
    // by clicking the round arrow ('Run All Tests') in the Cypress runner or by clicking R on the keyboard
    cy.request('https://petstore.swagger.io/v2/store/inventory')
      .should('have.property', 'duration')
      .should('lt', 110)   // assert duration <= xxx ms, e.g. for simple performance assertions
  })

  it('3b. GET - basic assertions - duration incl retries', {retries: 2}, () => {   // 1 try + max 2 retries
    // add retries to the specific test case --> in the config of the test itself: {"retries": 2}
    // or for all tests --> in cypress.json: "retries": 2
    // when the test fails it will automatically retry until it passes or until the number of retries is reached
    cy.request('https://petstore.swagger.io/v2/store/inventory')
      .should('have.property', 'duration')
      .should('lt', 110)   // assert duration <= xxx ms, e.g. for simple performance assertions
  })
      
  it('4. GET - more readable calls', () => {
    // 4 API calls which end up in the same request url:
    // "https://petstore.swagger.io/v2/store/inventory"
    
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
    // test case will most likely fail initially because inventories will be different
    // change number of 2 below defined variables to actual inventory numbers to pass this test case
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

        var inventoryPending  = 281   // adjust to actual current number to pass this test case
        var inventorySold     = 262   // adjust to actual current number to pass this test case
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